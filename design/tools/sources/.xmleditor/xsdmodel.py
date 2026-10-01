"""XSD introspection — the single source of truth for the visual editor.

Nothing in the editor hardcodes a document structure: every root element,
allowed child block, occurrence range, attribute, default/fixed value,
enumeration and documentation string is read from `design/schema.xsd` at
runtime. Any XML that validates against the schema is therefore editable
(and creatable) without a single code change.

Supported XSD constructs (all used by design/schema.xsd):
  xs:element (top-level, local, ref=, inline complexType/simpleType)
  xs:complexType (named + anonymous), mixed=, xs:sequence/choice/all,
  xs:group (named, ref=), xs:attributeGroup (named, ref=),
  xs:complexContent/xs:extension (base chain), xs:simpleContent/xs:extension,
  xs:attribute (use=, default=, fixed=, inline simpleType),
  xs:simpleType (restriction base=, xs:enumeration, xs:pattern),
  xs:any, xs:annotation/xs:documentation.
"""

from __future__ import annotations

from collections import OrderedDict
from dataclasses import dataclass, field
from pathlib import Path

from lxml import etree

XS = "http://www.w3.org/2001/XMLSchema"
XSI = "http://www.w3.org/2001/XMLSchema-instance"
UNBOUNDED: int | None = None  # sentinel: maxOccurs="unbounded"

#: xs:group / xs:attributeGroup cycles are cut after this many expansions.
_MAX_GROUP_DEPTH = 24


def xs(tag: str) -> str:
    """Qualify a local name in the XML Schema namespace."""
    return f"{{{XS}}}{tag}"


def localname(tag: str) -> str:
    """Bare name of a possibly namespace-qualified tag ('' for comments/PIs)."""
    if not isinstance(tag, str):
        return ""
    return tag.rsplit("}", 1)[-1] if "}" in tag else tag


def _occurs(node: etree._Element, attr: str, default: int) -> int | None:
    raw = node.get(attr)
    if raw is None:
        return default
    if raw == "unbounded":
        return UNBOUNDED
    try:
        return int(raw)
    except ValueError:
        return default


def _doc_text(node: etree._Element) -> str:
    """First xs:annotation/xs:documentation text, whitespace-normalised."""
    ann = node.find(xs("annotation"))
    if ann is None:
        return ""
    parts = [d.text for d in ann.findall(xs("documentation")) if d.text]
    return " ".join(" ".join(parts).split())


def node_key(node: etree._Element) -> str:
    """Stable identity for a node inside its document.

    ``id(node)`` must never be used to memoise lxml elements: proxies are
    created on demand and freed aggressively, so the same id can be handed
    out again for a different node. The document path is stable and unique.
    """
    tree = node.getroottree()
    if tree is not None:
        return tree.getpath(node)
    return f"{node.tag}@{node.sourceline}"



def _mul(a: int | None, b: int | None) -> int | None:
    """Combine two occurrence counts (None means unbounded)."""
    if a is None or b is None:
        return UNBOUNDED
    return a * b


def format_occurs(min_occurs: int, max_occurs: int | None) -> str:
    """Human-readable occurrence range: ``1..1``, ``0..1``, ``1..*``."""
    hi = "*" if max_occurs is UNBOUNDED else str(max_occurs)
    return f"{min_occurs}..{hi}"


# ---------------------------------------------------------------------------
# Block model — the vocabulary the GUI manipulates
# ---------------------------------------------------------------------------


@dataclass
class AttributeSpec:
    """One ``xs:attribute`` a block accepts."""

    name: str
    type_name: str = "xs:string"
    use: str = "optional"  # required | optional | prohibited
    default: str | None = None
    fixed: str | None = None
    enumerations: list[str] = field(default_factory=list)
    pattern: str | None = None
    documentation: str = ""

    @property
    def required(self) -> bool:
        return self.use == "required"

    @property
    def read_only(self) -> bool:
        """``@fixed`` pins the value: the editor must not offer free editing."""
        return self.fixed is not None

    @property
    def initial(self) -> str:
        """Value materialised on a freshly created block."""
        if self.fixed is not None:
            return self.fixed
        if self.default is not None:
            return self.default
        return ""

    @property
    def is_boolean(self) -> bool:
        return self.type_name in ("xs:boolean", "boolean")


@dataclass
class LeafSpec:
    """Simple (text-only) content: the block is a value slot."""

    base: str = "xs:string"
    enumerations: list[str] = field(default_factory=list)
    pattern: str | None = None
    documentation: str = ""


@dataclass
class BlockSpec:
    """A reusable block definition resolved from the schema.

    Both global ``xs:element`` declarations and local particles resolve to
    this single shape, so the GUI has exactly one notion of "block" and can
    nest any schema-valid combination without a special case anywhere.
    """

    name: str
    key: str = ""
    type_name: str = ""
    documentation: str = ""
    attributes: list[AttributeSpec] = field(default_factory=list)
    children: list[ParticleSpec] = field(default_factory=list)
    leaf: LeafSpec | None = None
    mixed: bool = False
    allows_any: bool = False
    is_root: bool = False

    @property
    def is_leaf(self) -> bool:
        return self.leaf is not None and not self.children

    @property
    def is_container(self) -> bool:
        return bool(self.children)

    @property
    def kind(self) -> str:
        """Profile category (derived, never hardcoded in the GUI)."""
        if self.is_leaf:
            return "value"
        if self.mixed:
            return "text"
        if self.is_container:
            return "container"
        return "empty"

    @property
    def required_attributes(self) -> list[AttributeSpec]:
        return [a for a in self.attributes if a.required]

    def child(self, name: str) -> ParticleSpec | None:
        for particle in self.children:
            if particle.name == name:
                return particle
        return None

    def attribute(self, name: str) -> AttributeSpec | None:
        for attr in self.attributes:
            if attr.name == name:
                return attr
        return None

    @property
    def summary(self) -> str:
        """One-line description of the block's shape (type + child count)."""
        parts = []
        if self.type_name:
            parts.append(self.type_name)
        if self.children:
            parts.append(f"{len(self.children)} child block(s)")
        elif self.leaf is not None:
            parts.append(self.leaf.base)
        return " · ".join(parts)


@dataclass
class ParticleSpec:
    """A block slot inside a content model, carrying its occurrence range."""

    block: BlockSpec
    min_occurs: int = 1
    max_occurs: int | None = 1
    via_choice: bool = False
    via_ref: bool = False

    @property
    def name(self) -> str:
        return self.block.name

    @property
    def repeatable(self) -> bool:
        return self.max_occurs is None or self.max_occurs > 1

    @property
    def required(self) -> bool:
        return self.min_occurs >= 1

    @property
    def occurs_label(self) -> str:
        return format_occurs(self.min_occurs, self.max_occurs)

    @property
    def cardinality(self) -> str:
        """UML-ish cardinality hint shown on the diagram connector."""
        if self.max_occurs is UNBOUNDED:
            return f"{self.min_occurs}..*"
        if self.min_occurs == self.max_occurs:
            return str(self.min_occurs)
        return self.occurs_label


# ---------------------------------------------------------------------------
# Schema model
# ---------------------------------------------------------------------------


@dataclass
class SchemaModel:
    """Everything the editor knows, read from ``schema.xsd`` at runtime."""

    path: Path
    target_namespace: str = ""
    element_form_default: str = "unqualified"
    attribute_form_default: str = "unqualified"
    roots: list[BlockSpec] = field(default_factory=list)
    blocks: dict[str, BlockSpec] = field(default_factory=dict)
    _root_index: dict[str, BlockSpec] = field(default_factory=dict, repr=False)

    # -- lookup ----------------------------------------------------------

    @property
    def root_names(self) -> list[str]:
        return [b.name for b in self.roots]

    def root(self, name: str) -> BlockSpec | None:
        return self._root_index.get(name)

    def block(self, name: str) -> BlockSpec | None:
        """Resolve a block by qualified key, named type, or plain name.

        Element names repeat across content models, so the qualified ``key``
        (``Type.element``) is authoritative; the plain-name lookup exists for
        palette/CLI convenience and returns the first match.
        """
        if name in self.blocks:
            return self.blocks[name]
        if name in self._root_index:
            return self._root_index[name]
        for candidate in self._root_index.values():
            if candidate.type_name == name:
                return candidate
        for candidate in self.blocks.values():
            if candidate.type_name == name:
                return candidate
        for candidate in self.blocks.values():
            if candidate.name == name:
                return candidate
        return None

    def blocks_named(self, name: str) -> list[BlockSpec]:
        """Every block declaration sharing a local name (context-free query)."""
        found = [b for b in self._root_index.values() if b.name == name]
        found.extend(b for b in self.blocks.values() if b.name == name)
        return found

    def block_for_element(self, element_name: str) -> BlockSpec | None:
        """Map an XML element name (possibly namespace-qualified) to a block."""
        bare = element_name.rsplit("}", 1)[-1] if "}" in element_name else element_name
        return self._root_index.get(bare) or self.blocks.get(bare)

    # -- profile ---------------------------------------------------------

    def profile(self) -> OrderedDict[str, list[BlockSpec]]:
        """Block profile: categories derived purely from the schema shape.

        This is what feeds the palette; adding a construct to the XSD grows
        the profile automatically.
        """
        reachable: OrderedDict[str, BlockSpec] = OrderedDict()
        repeatable: OrderedDict[str, BlockSpec] = OrderedDict()

        def visit(block: BlockSpec) -> None:
            ident = block.key or block.name
            if ident in reachable:
                return
            reachable[ident] = block
            for particle in block.children:
                if particle.repeatable:
                    repeatable[particle.block.key or particle.name] = particle.block
                visit(particle.block)

        for root in self.roots:
            visit(root)

        root_names = {b.name for b in self.roots}
        categories: OrderedDict[str, list[BlockSpec]] = OrderedDict()
        categories["Roots"] = list(self.roots)
        containers = [b for b in reachable.values() if b.is_container and b.name not in root_names]
        if containers:
            categories["Containers"] = containers
        values = [b for b in reachable.values() if b.is_leaf and b.name not in root_names]
        if values:
            categories["Values"] = values
        texts = [b for b in reachable.values() if b.mixed and b.name not in root_names]
        if texts:
            categories["Text (mixed)"] = texts
        repeats = [b for b in repeatable.values() if b.name not in root_names]
        if repeats:
            categories["Repeatable (collections)"] = repeats
        return categories

    def profile_blocks(self) -> list[BlockSpec]:
        """Flat, de-duplicated list of every block in the profile."""
        seen: OrderedDict[str, BlockSpec] = OrderedDict()
        for blocks in self.profile().values():
            for block in blocks:
                seen.setdefault(block.key or block.name, block)
        return list(seen.values())


# ---------------------------------------------------------------------------
# Loader: XSD -> SchemaModel
# ---------------------------------------------------------------------------


class _SchemaLoader:
    """Walks an XSD document once and produces the immutable block index."""

    def __init__(self, root: etree._Element) -> None:
        self.root = root
        self.target_namespace = root.get("targetNamespace", "")
        self.element_form_default = root.get("elementFormDefault", "unqualified")
        self.attribute_form_default = root.get("attributeFormDefault", "unqualified")

        self.elements = self._index("element")
        self.complex_types = self._index("complexType")
        self.simple_types = self._index("simpleType")
        self.groups = self._index("group")
        self.attribute_groups = self._index("attributeGroup")

        self._nodes: dict[str, BlockSpec] = {}
        self._types: dict[str, BlockSpec] = {}
        self._named: dict[str, BlockSpec] = {}
        self._leaves: dict[str, LeafSpec] = {}
        self._all: OrderedDict[str, BlockSpec] = OrderedDict()

    # -- index helpers ---------------------------------------------------

    def _index(self, tag: str) -> dict[str, etree._Element]:
        found: dict[str, etree._Element] = {}
        for node in self.root.findall(xs(tag)):
            name = node.get("name")
            if name:
                found[name] = node
        return found

    # -- entry point -----------------------------------------------------

    def build(self, path: Path) -> SchemaModel:
        roots: list[BlockSpec] = []
        for node in self.root.findall(xs("element")):
            name = node.get("name")
            if not name:
                continue
            roots.append(self.element_block(node, name, is_root=True))

        # An element block whose named type is recursive (type -> nested
        # element -> same type) adopts the type block while it is still under
        # construction, so its snapshot misses every particle/attribute added
        # after the recursive reference (e.g. NodeTreeType's own <node>
        # particle and its @role/@element attributes). Every root has been
        # walked by now: re-adopt from the finished type blocks to refresh
        # those stale snapshots. Non-recursive blocks re-adopt identical
        # content, so the pass is idempotent.
        for block in self._nodes.values():
            if not block.type_name:
                continue
            final = self._named.get(block.type_name)
            if final is not None and final is not block:
                self._adopt(block, final)

        model = SchemaModel(
            path=path,
            target_namespace=self.target_namespace,
            element_form_default=self.element_form_default,
            attribute_form_default=self.attribute_form_default,
            roots=roots,
            blocks=dict(self._all),
        )
        model._root_index = {b.name: b for b in roots}
        for block in self._types.values():
            if block.key:
                model.blocks.setdefault(block.key, block)
        return model

    def _register(self, block: BlockSpec) -> BlockSpec:
        if block.name:
            self._all.setdefault(block.key or block.name, block)
        return block

    # -- elements --------------------------------------------------------

    def element_block(
        self,
        node: etree._Element,
        name: str,
        is_root: bool = False,
        parent_key: str = "",
    ) -> BlockSpec:
        key = node_key(node)
        cached = self._nodes.get(key)
        if cached is not None:
            if is_root:
                cached.is_root = True
            return cached

        qualified = name if (is_root or not parent_key) else f"{parent_key}.{name}"
        type_name = node.get("type") or ""
        block = BlockSpec(
            name=name,
            key=qualified,
            type_name=type_name,
            documentation=_doc_text(node),
            is_root=is_root,
        )
        # Registered before the content model is walked so a recursive
        # reference (element -> ... -> same element) resolves to this very
        # object instead of recursing forever.
        self._nodes[key] = block

        if type_name:
            if type_name in self.complex_types:
                named_type = self.complex_type_block(
                    self.complex_types[type_name], type_name, named=True)
                self._adopt(block, named_type)
            elif type_name in self.simple_types:
                block.leaf = self.simple_type_leaf(self.simple_types[type_name])
            else:
                block.leaf = LeafSpec(base=type_name)
        else:
            inline_complex = node.find(xs("complexType"))
            inline_simple = node.find(xs("simpleType"))
            if inline_complex is not None:
                self._adopt(block, self.complex_type_block(inline_complex, name))
            elif inline_simple is not None:
                block.leaf = self.simple_type_leaf(inline_simple)

        return self._register(block)

    def _adopt(self, block: BlockSpec, base: BlockSpec) -> None:
        """Copy an anonymous/named type's shape onto an element block."""
        block.attributes = list(base.attributes)
        block.children = list(base.children)
        block.mixed = base.mixed
        block.allows_any = base.allows_any
        if base.leaf is not None:
            block.leaf = base.leaf

    # -- complex types ---------------------------------------------------

    def complex_type_block(
        self, node: etree._Element, type_name: str, named: bool = False
    ) -> BlockSpec:
        """Resolve a complexType (named or anonymous inline).

        Anonymous inline types are cached by node path, never by name: two
        content models may declare the same element name (``fixedShape`` in
        the header contract and in the logic contract) with different shapes,
        and a name-keyed cache would silently merge them.
        """
        cache_key = node_key(node)
        cached = self._types.get(cache_key)
        if cached is not None:
            return cached
        if named:
            existing = self._named.get(type_name)
            if existing is not None:
                # Recursive type (e.g. NodeType -> node -> NodeType): hand back
                # the block still under construction so nesting stays complete
                # instead of returning an empty stub that hides allowed blocks.
                return existing

        block = BlockSpec(name=type_name, key=type_name if named else "",
                          type_name=type_name,
                          documentation=_doc_text(node),
                          mixed=(node.get("mixed") == "true"))
        self._types[cache_key] = block
        if named:
            self._named[type_name] = block

        complex_content = node.find(xs("complexContent"))
        simple_content = node.find(xs("simpleContent"))

        if complex_content is not None:
            if complex_content.get("mixed") == "true":
                block.mixed = True
            derived = complex_content.find(xs("extension"))
            if derived is None:
                derived = complex_content.find(xs("restriction"))
            if derived is not None:
                self._merge_base(block, derived.get("base"))
                self._read_particles(block, derived, 1, 1)
                self._read_attributes(block, derived)
        elif simple_content is not None:
            derived = simple_content.find(xs("extension"))
            if derived is None:
                derived = simple_content.find(xs("restriction"))
            if derived is not None:
                block.leaf = self._leaf_from_base(derived.get("base"))
                self._read_attributes(block, derived)
        else:
            self._read_particles(block, node, 1, 1)
            self._read_attributes(block, node)
        return block


    def _merge_base(self, block: BlockSpec, base_name: str | None) -> None:
        """Inherit attributes/particles from a named base type (xs:extension)."""
        if not base_name:
            return
        if base_name in self.complex_types:
            base = self.complex_type_block(
                self.complex_types[base_name], base_name, named=True)
            known = {a.name for a in block.attributes}
            block.attributes.extend(a for a in base.attributes if a.name not in known)
            block.children.extend(base.children)
            block.allows_any = block.allows_any or base.allows_any
            if base.mixed:
                block.mixed = True
        elif base_name in self.simple_types:
            block.leaf = self.simple_type_leaf(self.simple_types[base_name])
        else:
            block.leaf = LeafSpec(base=base_name)

    # -- attributes ------------------------------------------------------

    def _read_attributes(self, block: BlockSpec, node: etree._Element) -> None:
        known = {a.name for a in block.attributes}
        for attr_node in list(node.findall(xs("attribute"))):
            spec = self.attribute_spec(attr_node)
            if spec is not None and spec.name not in known:
                block.attributes.append(spec)
                known.add(spec.name)
        for group_node in node.findall(xs("attributeGroup")):
            ref = group_node.get("ref")
            group = self.attribute_groups.get(ref) if ref else group_node
            if group is None:
                continue
            for attr_node in group.findall(xs("attribute")):
                spec = self.attribute_spec(attr_node)
                if spec is not None and spec.name not in known:
                    block.attributes.append(spec)
                    known.add(spec.name)

    def attribute_spec(self, node: etree._Element) -> AttributeSpec | None:
        name = node.get("name")
        if not name:
            return None
        type_name = node.get("type") or "xs:string"
        spec = AttributeSpec(
            name=name,
            type_name=type_name,
            use=node.get("use", "optional"),
            default=node.get("default"),
            fixed=node.get("fixed"),
            documentation=_doc_text(node),
        )
        if type_name in self.simple_types:
            leaf = self.simple_type_leaf(self.simple_types[type_name])
            spec.enumerations = list(leaf.enumerations)
            spec.pattern = leaf.pattern
        inline = node.find(xs("simpleType"))
        if inline is not None:
            leaf = self.simple_type_leaf(inline)
            spec.enumerations = list(leaf.enumerations)
            spec.pattern = leaf.pattern
        return spec

    def _leaf_from_base(self, base_name: str | None) -> LeafSpec:
        if base_name and base_name in self.simple_types:
            return self.simple_type_leaf(self.simple_types[base_name])
        return LeafSpec(base=base_name or "xs:string")

    # -- simple types ----------------------------------------------------

    def simple_type_leaf(self, node: etree._Element) -> LeafSpec:
        key = node_key(node)
        cached = self._leaves.get(key)
        if cached is not None:
            return cached

        leaf = LeafSpec(documentation=_doc_text(node))
        restriction = node.find(xs("restriction"))
        if restriction is not None:
            leaf.base = restriction.get("base") or "xs:string"
            leaf.enumerations = self._enumerations(restriction)
            pattern_node = restriction.find(xs("pattern"))
            if pattern_node is not None:
                leaf.pattern = pattern_node.get("value")
            nested = restriction.find(xs("simpleType"))
            if nested is not None and not leaf.enumerations:
                inner = self.simple_type_leaf(nested)
                leaf.enumerations = list(inner.enumerations)
                leaf.pattern = leaf.pattern or inner.pattern
        union = node.find(xs("union"))
        if union is not None:
            leaf.base = "union"
            for member in union.findall(xs("simpleType")):
                leaf.enumerations.extend(self.simple_type_leaf(member).enumerations)
            for member_name in (union.get("memberTypes") or "").split():
                if member_name in self.simple_types:
                    leaf.enumerations.extend(
                        self.simple_type_leaf(self.simple_types[member_name]).enumerations)
        if node.find(xs("list")) is not None:
            leaf.base = "list"

        self._leaves[key] = leaf
        return leaf

    def _enumerations(self, restriction: etree._Element) -> list[str]:
        values: list[str] = []
        for enum_node in restriction.findall(xs("enumeration")):
            value = enum_node.get("value")
            if value is not None:
                values.append(value)
        return values

    # -- particles -------------------------------------------------------

    def _read_particles(
        self,
        block: BlockSpec,
        node: etree._Element,
        mult_min: int,
        mult_max: int | None,
        via_choice: bool = False,
        depth: int = 0,
    ) -> None:
        """Flatten a content model, multiplying occurrence ranges on the way.

        Nested ``xs:sequence`` / ``xs:choice`` / ``xs:group ref`` are resolved
        so the GUI sees one flat list of blocks per parent, each with its real
        cardinality — no schema construct is left unimplemented.
        """
        if depth > _MAX_GROUP_DEPTH:
            return
        for child in node:
            tag = localname(child.tag)
            if tag in ("sequence", "all", "choice"):
                child_min = _mul(mult_min, _occurs(child, "minOccurs", 1))
                child_max = _mul(mult_max, _occurs(child, "maxOccurs", 1))
                self._read_particles(block, child, child_min or 0, child_max,
                                     via_choice or tag == "choice", depth + 1)
            elif tag == "group":
                ref = child.get("ref")
                group_node = self.groups.get(ref) if ref else child
                if group_node is None:
                    continue
                child_min = _mul(mult_min, _occurs(child, "minOccurs", 1))
                child_max = _mul(mult_max, _occurs(child, "maxOccurs", 1))
                self._read_particles(block, group_node, child_min or 0, child_max,
                                     via_choice, depth + 1)
            elif tag == "element":
                particle = self._particle(child, mult_min, mult_max, via_choice, block.key)
                if particle is not None and block.child(particle.name) is None:
                    block.children.append(particle)
            elif tag == "any":
                block.allows_any = True

    def _particle(
        self,
        node: etree._Element,
        mult_min: int,
        mult_max: int | None,
        via_choice: bool,
        parent_key: str = "",
    ) -> ParticleSpec | None:
        ref = node.get("ref")
        name = ref or node.get("name")
        if not name:
            return None

        if ref:
            target = self.elements.get(ref)
            if target is None:
                return None
            block = self.element_block(target, ref)
        else:
            block = self.element_block(node, name, parent_key=parent_key)

        min_occurs = _mul(_occurs(node, "minOccurs", 1), mult_min) or 0
        if via_choice:
            # In an xs:choice the alternatives are optional individually: the
            # choice as a whole requires one of them, never each of them.
            min_occurs = 0
        max_occurs = _mul(_occurs(node, "maxOccurs", 1), mult_max)
        return ParticleSpec(
            block=block,
            min_occurs=min_occurs,
            max_occurs=max_occurs,
            via_choice=via_choice,
            via_ref=bool(ref),
        )


def load_schema(path: Path) -> SchemaModel:
    """Parse a schema once and return its immutable, fully-expanded model."""
    parser = etree.XMLParser(remove_comments=False, resolve_entities=False)
    tree = etree.parse(str(path), parser)
    loader = _SchemaLoader(tree.getroot())
    return loader.build(Path(path).resolve())




