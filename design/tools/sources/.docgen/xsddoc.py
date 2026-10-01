#!/usr/bin/env python3
"""xsd2md walker — generic XSD -> Markdown renderer driven by <xs:documentation>.

Split out of the historical docgen.py monolith: collects complexTypes /
simpleTypes / groups / key constraints from a schema and renders the
Schema Reference pages (see .docgen/reference.py::render_schema_reference).
"""
from __future__ import annotations

from dataclasses import dataclass, field

from lxml import etree

# ---------------------------------------------------------------------------
# Schema Reference renderer (inlined from the former xsd2doc.py; generic
# XSD -> Markdown walker driven by <xs:documentation> annotations).
# ---------------------------------------------------------------------------
XS = "http://www.w3.org/2001/XMLSchema"
NS = {"xs": XS}


def qn(tag: str) -> str:
    return f"{{{XS}}}{tag}"


def local(tag: str) -> str:
    return etree.QName(tag).localname if "{" in tag else tag


def doc_text(node) -> str:
    """Extrait et nettoie le texte de la première xs:annotation/xs:documentation d'un noeud."""
    ann = node.find(qn("annotation"))
    if ann is None:
        return ""
    parts = []
    for d in ann.findall(qn("documentation")):
        if d.text:
            parts.append(d.text)
    text = " ".join(p.strip() for p in parts if p and p.strip())
    # Normalise les espaces multiples issus de l'indentation XML
    return " ".join(text.split())


def summary_of(text: str) -> str:
    """Première phrase d'un bloc de documentation, utilisée comme résumé court."""
    if not text:
        return ""
    for sep in (". ", " — ", " - "):
        if sep in text:
            return text.split(sep, 1)[0].strip().rstrip(".") + "."
    return text


@dataclass
class AttrInfo:
    name: str
    type: str
    use: str
    fixed: str | None
    default: str | None
    doc: str


@dataclass
class ChildInfo:
    name: str
    type_ref: str
    min_occurs: str
    max_occurs: str
    doc: str
    inline: bool = False  # True si le type est déclaré en ligne (anonyme)


@dataclass
class TypeInfo:
    name: str
    kind: str  # 'complexType' | 'simpleType' | 'element' | 'group'
    doc: str
    attrs: list = field(default_factory=list)
    children: list = field(default_factory=list)
    enum_values: list = field(default_factory=list)
    base: str | None = None
    constraints: list = field(default_factory=list)  # (kind, name, xpath_info)


def describe_particle(parent_el, container: TypeInfo, prefix=""):
    """Parcourt un sequence/choice/group ref et remplit container.children."""
    for node in parent_el:
        if not isinstance(node.tag, str):
            continue  # comments / processing instructions have callable tags
        tag = local(node.tag)
        if tag in ("sequence", "choice", "all"):
            marker = " (choix)" if tag == "choice" else ""
            describe_particle(node, container, prefix=prefix + marker)
        elif tag == "group":
            ref = node.get("ref", "").split(":")[-1]
            container.children.append(
                ChildInfo(name=f"« groupe: {ref} »", type_ref=ref,
                          min_occurs="1", max_occurs="1",
                          doc=f"Inclusion du groupe réutilisable `{ref}`.{prefix}")
            )
        elif tag == "element":
            name = node.get("name", node.get("ref", "?"))
            min_o = node.get("minOccurs", "1")
            max_o = node.get("maxOccurs", "1")
            d = doc_text(node)
            type_attr = node.get("type")
            inline_ct = node.find(qn("complexType"))
            inline_st = node.find(qn("simpleType"))
            if type_attr:
                type_ref = type_attr.split(":")[-1]
                inline = False
            elif inline_ct is not None or inline_st is not None:
                type_ref = f"{container.name}.{name}"
                inline = True
            else:
                type_ref = "xs:string"
                inline = False
            container.children.append(
                ChildInfo(name=name, type_ref=type_ref, min_occurs=min_o,
                          max_occurs=max_o, doc=d + prefix, inline=inline)
            )


def parse_attributes(el) -> list:
    out = []
    for a in el.findall(qn("attribute")):
        out.append(AttrInfo(
            name=a.get("name", a.get("ref", "?")),
            type=(a.get("type", "").split(":")[-1] or "inline"),
            use=a.get("use", "optional"),
            fixed=a.get("fixed"),
            default=a.get("default"),
            doc=doc_text(a),
        ))
    return out


def parse_constraints(el) -> list:
    out = []
    for kind in ("key", "keyref", "unique"):
        for c in el.findall(qn(kind)):
            sel = c.find(qn("selector"))
            fields = c.findall(qn("field"))
            info = {
                "name": c.get("name"),
                "refer": c.get("refer", "").split(":")[-1] if kind == "keyref" else None,
                "selector": sel.get("xpath") if sel is not None else "",
                "fields": [f.get("xpath") for f in fields],
            }
            out.append((kind, info))
    return out


def collect_types(schema_root) -> dict[str, TypeInfo]:
    types: dict[str, TypeInfo] = {}

    # complexTypes et simpleTypes nommés au niveau racine
    for ct in schema_root.findall(qn("complexType")):
        name = ct.get("name")
        if not name:
            continue
        info = TypeInfo(name=name, kind="complexType", doc=doc_text(ct))
        info.attrs = parse_attributes(ct)
        # contenu simple (extension de xs:string, etc.)
        simple = ct.find(qn("simpleContent"))
        if simple is not None:
            ext = simple.find(qn("extension"))
            if ext is not None:
                info.base = ext.get("base", "").split(":")[-1]
                info.attrs += parse_attributes(ext)
        else:
            describe_particle(ct, info)
        types[name] = info

    for st in schema_root.findall(qn("simpleType")):
        name = st.get("name")
        if not name:
            continue
        info = TypeInfo(name=name, kind="simpleType", doc=doc_text(st))
        restr = st.find(qn("restriction"))
        if restr is not None:
            info.base = restr.get("base", "").split(":")[-1]
            info.enum_values = [e.get("value") for e in restr.findall(qn("enumeration"))]
        types[name] = info

    # groupes réutilisables
    for gr in schema_root.findall(qn("group")):
        name = gr.get("name")
        if not name:
            continue
        info = TypeInfo(name=name, kind="group", doc=doc_text(gr))
        describe_particle(gr, info)
        types[name] = info

    # éléments racine (avec complexType éventuellement en ligne)
    for el in schema_root.findall(qn("element")):
        name = el.get("name")
        if not name:
            continue
        info = TypeInfo(name=name, kind="element (racine)", doc=doc_text(el))
        ct = el.find(qn("complexType"))
        if ct is not None:
            info.attrs = parse_attributes(ct)
            describe_particle(ct, info)
        info.constraints = parse_constraints(el)
        types[f"@{name}"] = info  # préfixe pour distinguer des types portant le même nom

    return types


def render_markdown(types: dict, title: str) -> str:
    lines = [f"# {title}", ""]
    lines.append(
        "> Documentation générée automatiquement depuis le schéma XSD "
        "par `xsd2doc.py`. Ne pas éditer à la main : modifier le `.xsd` "
        "puis régénérer.\n"
    )

    roots = {k: v for k, v in types.items() if k.startswith("@")}
    groups = {k: v for k, v in types.items() if v.kind == "group"}
    simples = {k: v for k, v in types.items() if v.kind == "simpleType"}
    complexes = {k: v for k, v in types.items()
                 if v.kind == "complexType"}

    # Sommaire
    lines.append("## Sommaire\n")
    if roots:
        lines.append("- **Fichiers racine** : " +
                      ", ".join(f"[{v.name}](#{v.name.lower()})" for v in roots.values()))
    if complexes:
        lines.append("- **Types complexes** : " +
                      ", ".join(f"[{n}](#{n.lower()})" for n in sorted(complexes)))
    if groups:
        lines.append("- **Groupes réutilisables** : " +
                      ", ".join(f"[{n}](#{n.lower()})" for n in sorted(groups)))
    if simples:
        lines.append("- **Types simples / énumérations** : " +
                      ", ".join(f"[{n}](#{n.lower()})" for n in sorted(simples)))
    lines.append("")

    def render_children_table(info: TypeInfo):
        if not info.children:
            return []
        out = ["| Élément | Occurrences | Type | Description |",
               "|---|---|---|---|"]
        for c in info.children:
            occ = f"{c.min_occurs}..{'∞' if c.max_occurs == 'unbounded' else c.max_occurs}"
            type_link = (
                f"[`{c.type_ref}`](#{c.type_ref.lower().split('.')[0]})"
                if not c.inline and c.type_ref in types
                else f"`{c.type_ref}` (en ligne)" if c.inline
                else f"`{c.type_ref}`"
            )
            out.append(f"| `{c.name}` | {occ} | {type_link} | {c.doc or '—'} |")
        out.append("")
        return out

    def render_attrs_table(info: TypeInfo):
        if not info.attrs:
            return []
        out = ["| Attribut | Type | Contrainte | Description |",
               "|---|---|---|---|"]
        for a in info.attrs:
            constraint = a.use
            if a.fixed:
                constraint += f", figé à `{a.fixed}`"
            if a.default:
                constraint += f", défaut `{a.default}`"
            out.append(f"| `{a.name}` | `{a.type}` | {constraint} | {a.doc or '—'} |")
        out.append("")
        return out

    def render_type_block(info: TypeInfo, heading_level="##"):
        block = [f"{heading_level} {info.name}", ""]
        if info.doc:
            block.append(f"*{info.doc}*\n")
        if info.kind == "simpleType":
            block.append(f"Type de base : `{info.base}`\n")
            if info.enum_values:
                block.append("Valeurs autorisées : " +
                              ", ".join(f"`{v}`" for v in info.enum_values) + "\n")
        else:
            if info.base:
                block.append(f"Contenu textuel simple, extension de `{info.base}`.\n")
            block += render_attrs_table(info)
            block += render_children_table(info)
        if info.constraints:
            block.append("**Contraintes d'intégrité :**\n")
            for kind, c in info.constraints:
                if kind == "keyref":
                    block.append(
                        f"- `{c['name']}` (*keyref* → `{c['refer']}`) : "
                        f"chaque `{c['selector']}` doit référencer un `{c['fields'][0]}` "
                        f"existant dans la clé correspondante."
                    )
                elif kind == "key":
                    block.append(
                        f"- `{c['name']}` (*key*) : `{c['selector']}` est une clé "
                        f"faisant foi sur `{c['fields'][0]}`."
                    )
                else:
                    block.append(
                        f"- `{c['name']}` (*unique*) : `{c['fields'][0]}` doit être "
                        f"unique parmi `{c['selector']}`."
                    )
            block.append("")
        return block

    if roots:
        lines.append("## Fichiers racine\n")
        for info in roots.values():
            lines += render_type_block(info, heading_level="###")

    if complexes:
        lines.append("## Types complexes\n")
        for name in sorted(complexes):
            lines += render_type_block(complexes[name], heading_level="###")

    if groups:
        lines.append("## Groupes réutilisables\n")
        for name in sorted(groups):
            lines += render_type_block(groups[name], heading_level="###")

    if simples:
        lines.append("## Types simples / énumérations\n")
        for name in sorted(simples):
            lines += render_type_block(simples[name], heading_level="###")

    return "\n".join(lines) + "\n"
