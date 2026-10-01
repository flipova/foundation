"""docs model - declarative sources of the documentation site.

Parses `design/manifest.xml` (project metadata + determinism rules) and
`design/documentation.xml` (navigation + narrative Markdown content) into the
typed model consumed by .docgen/reference.py and .docgen/site.py.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from lxml import etree

NS = "urn:flipova:foundation:registry"

# Map (section-id, article-id) -> dynamic key (rendered in .docgen/cli.py).
# Shared by site.py (article rendering).
DYNAMIC_ARTICLES = {
    ("schema-reference", "schema"): "schema",
    ("theming", "tokens"): "tokens",
    ("theming", "themes"): "themes",
}


def q(tag: str) -> str:
    return f"{{{NS}}}{tag}"


# Models
@dataclass
class DocArticle:
    id: str
    title: str
    slug: str
    content: str = ""


@dataclass
class DocSection:
    id: str
    title: str
    order: int
    articles: list[DocArticle] = field(default_factory=list)


# Parsers
def parse_manifest(manifest_path: Path):
    """Parse the manifest.xml file (project metadata + determinism rules)."""
    tree = etree.parse(str(manifest_path))
    root = tree.getroot()
    project = ""
    version = ""
    license_name = ""
    language = "en"
    registry_root = ""
    pipeline_source = ""
    outputs = {}
    determinism_rules = []

    meta = root.find(q("meta"))
    if meta is not None:
        el = meta.find(q("project"))
        if el is not None:
            project = (el.text or "").strip()
        el = meta.find(q("license"))
        if el is not None:
            license_name = (el.text or "").strip()
        el = meta.find(q("language"))
        if el is not None:
            language = (el.text or "en").strip()
        el = meta.find(q("registryRoot"))
        if el is not None:
            registry_root = (el.text or "").strip()

        pipeline = meta.find(q("pipeline"))
        if pipeline is not None:
            source_el = pipeline.find(q("source"))
            if source_el is not None:
                pipeline_source = (source_el.text or "").strip()
            outputs_el = pipeline.find(q("outputs"))
            if outputs_el is not None:
                for output in outputs_el:
                    tag = etree.QName(output.tag).localname
                    outputs[tag] = (output.text or "").strip()

        determinism = meta.find(q("determinism"))
        if determinism is not None:
            for rule in determinism:
                if etree.QName(rule.tag).localname == "rule":
                    rule_def = {
                        "id": rule.get("id", ""),
                        "kind": rule.get("kind", ""),
                        "severity": rule.get("severity", ""),
                        "description": "",
                        "params": {},
                    }
                    desc_el = rule.find(q("description"))
                    if desc_el is not None:
                        rule_def["description"] = (desc_el.text or "").strip()
                    params_el = rule.find(q("params"))
                    if params_el is not None:
                        for param in params_el:
                            if etree.QName(param.tag).localname == "param":
                                rule_def["params"][param.get("name", "")] = (param.text or "").strip()
                    determinism_rules.append(rule_def)

    return {
        "project": project,
        "version": version,
        "license": license_name,
        "language": language,
        "registry_root": registry_root,
        "pipeline_source": pipeline_source,
        "outputs": outputs,
        "determinism_rules": determinism_rules,
        "doc_sections": [],
    }


def parse_documentation(doc_path: Path) -> list[DocSection]:
    """Parse the documentation tree (`design/documentation.xml`)."""
    tree = etree.parse(str(doc_path))
    root = tree.getroot()
    if etree.QName(root.tag).localname != "documentation":
        raise SystemExit(f"{doc_path}: expected root element <documentation>, got <{etree.QName(root.tag).localname}>")
    doc_sections: list[DocSection] = []
    for section in root:
        if etree.QName(section.tag).localname != "section":
            continue
        sec_def = DocSection(
            id=section.get("id", ""),
            title=section.get("title", ""),
            order=int(section.get("order", "0")),
        )
        for article in section:
            if etree.QName(article.tag).localname != "article":
                continue
            content_el = article.find(q("content"))
            content = (content_el.text or "").strip("\n") if content_el is not None else ""
            sec_def.articles.append(DocArticle(
                id=article.get("id", ""),
                title=article.get("title", ""),
                slug=article.get("slug", ""),
                content=content,
            ))
        doc_sections.append(sec_def)
    return sorted(doc_sections, key=lambda s: s.order)
