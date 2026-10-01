"""Editable XML document — the block operations behind the visual editor.

The document is kept as an lxml tree and every mutation goes through this
class, so undo/redo, dirty tracking, structural diagnostics and saving stay
in one place. Blocks are resolved against ``SchemaModel`` by descending the
content model from the root, which is the only way to disambiguate element
names that repeat across types (e.g. ``style``).
"""

from __future__ import annotations

import re
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

from lxml import etree

from .blocks import unfulfilled_required_attributes
from .xsdmodel import (
    AttributeSpec,
    BlockSpec,
    LeafSpec,
    ParticleSpec,
    SchemaModel,
    localname,
)

XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>'
_SOURCES_DIR = Path(__file__).resolve().parents[1]
FREEFORM_TYPE = "xs:any"


@dataclass
class Issue:
    """A schema-driven diagnostic attached to a document element."""

    severity: str
    element: etree._Element | None
    message: str
    line: int | None = None

    @property
    def label(self) -> str:
        return self.message


class DocumentModel:
    """An editable XML document validated against the schema that drives it."""

    def __init__(self, schema: SchemaModel) -> None:
        self.schema = schema
        self.path: Path | None = None
        self._tree: etree._ElementTree | None = None
        self._undo: list[str] = []
        self._redo: list[str] = []
        self.dirty = False

    # -- construction ----------------------------------------------------

    @classmethod
    def new(cls, schema: SchemaModel, root_name: str) -> DocumentModel:
        """Create an empty document whose root is *root_name*."""
        model = cls(schema)
        root_block = schema.root(root_name)
        if root_block is None:
            raise ValueError(f"unknown root element: {root_name}")
        root = model._make_element(root_block, is_root=True)
        model._tree = etree.ElementTree(root)
        model.dirty = True
        return model

    @classmethod
    def load(cls, schema: SchemaModel, path: Path) -> DocumentModel:
        model = cls(schema)
        parser = etree.XMLParser(remove_comments=False, resolve_entities=False)
        model._tree = etree.parse(str(path), parser)
        model.path = Path(path)
        model.dirty = False
        return model

    # -- accessors -------------------------------------------------------

    @property
    def tree(self) -> etree._ElementTree:
        if self._tree is None:
            raise RuntimeError("document is empty")
        return self._tree

    @property
    def root(self) -> etree._Element:
        return self.tree.getroot()

    @property
    def root_block(self) -> BlockSpec | None:
        return self.schema.block_for_element(str(self.root.tag))

    @property
    def can_undo(self) -> bool:
        return bool(self._undo)

    @property
    def can_redo(self) -> bool:
        return bool(self._redo)

    def qualified(self, name: str, is_root: bool = False) -> str:
        """Map a schema block name to the tag used in the document."""
        namespace = self.schema.target_namespace
        if not namespace:
            return name
        if self.schema.element_form_default == "qualified" or is_root:
            return f"{{{namespace}}}{name}"
        return name

    # -- block resolution ------------------------------------------------

    def block_chain(
        self, element: etree._Element
    ) -> list[tuple[BlockSpec, ParticleSpec | None]]:
        """Walk root -> element collecting (block, particle) for each level."""
        lineage: list[etree._Element] = []
        node: etree._Element | None = element
        while node is not None:
            lineage.append(node)
            node = node.getparent()
        lineage.reverse()

        chain: list[tuple[BlockSpec, ParticleSpec | None]] = []
        block = self.root_block
        if block is None or not lineage or lineage[0] is not self.root:
            return chain
        chain.append((block, None))
        for child in lineage[1:]:
            name = localname(str(child.tag))
            particle = block.child(name)
            if particle is None:
                if block.allows_any:
                    block = self.freeform_block(block, name)
                    chain.append((block, None))
                    continue
                return chain
            block = particle.block
            chain.append((block, particle))
        return chain

    def block_of(self, element: etree._Element) -> BlockSpec | None:
        """Resolve the block definition governing *element* (context-aware)."""
        chain = self.block_chain(element)
        return chain[-1][0] if chain else None

    def particle_of(self, element: etree._Element) -> ParticleSpec | None:
        """Resolve the particle (occurrence range) that allowed *element*."""
        chain = self.block_chain(element)
        return chain[-1][1] if chain else None

    def child_names(self, element: etree._Element) -> list[str]:
        return [localname(str(child.tag)) for child in element if isinstance(child.tag, str)]

    def is_known(self, element: etree._Element) -> bool:
        """True when the element sits on a schema-valid path from the root."""
        chain = self.block_chain(element)
        if not chain:
            return False
        return localname(str(element.tag)) == chain[-1][0].name or element is self.root

    # -- serialisation ---------------------------------------------------

    def to_string(self) -> str:
        """Deterministic pretty XML, matching the repository's file style.

        The default namespace lives in the root's nsmap, so qualified tags are
        serialised as ``<themes xmlns="urn:...">`` rather than ``ns0:...``.
        """
        body = etree.tostring(self.root, pretty_print=True, encoding="unicode")
        return XML_DECLARATION + "\n" + body

    def save(self, path: Path | None = None) -> Path:
        target = Path(path) if path is not None else self.path
        if target is None:
            raise ValueError("no path given and the document was never saved")
        target.parent.mkdir(parents=True, exist_ok=True)
        with open(target, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(self.to_string())
        self.path = target
        self.dirty = False
        return target

    def write_temp(self) -> Path:
        """Write the current buffer to a temp file (for XSD validation)."""
        with tempfile.NamedTemporaryFile(
                mode="w", suffix=".xml", delete=False, encoding="utf-8", newline="\n") as handle:
            handle.write(self.to_string())
        return Path(handle.name)

    # -- undo / redo -----------------------------------------------------

    def snapshot(self) -> None:
        """Record the current state so the next mutation can be undone."""
        if getattr(self, "_suspend_history", False):
            return  # batched mutation (auto_fix) records a single step itself
        self._undo.append(etree.tostring(self.root, encoding="unicode"))
        del self._redo[:]
        if len(self._undo) > 200:
            del self._undo[0]

    def _restore(self, payload: str) -> None:
        self._tree = etree.ElementTree(etree.fromstring(payload.encode("utf-8")))

    def undo(self) -> bool:
        if not self._undo:
            return False
        self._redo.append(etree.tostring(self.root, encoding="unicode"))
        self._restore(self._undo.pop())
        self.dirty = True
        return True

    def redo(self) -> bool:
        if not self._redo:
            return False
        self._undo.append(etree.tostring(self.root, encoding="unicode"))
        self._restore(self._redo.pop())
        self.dirty = True
        return True

    # -- element creation ------------------------------------------------

    def _make_element(self, block: BlockSpec, is_root: bool = False) -> etree._Element:
        """Create an element carrying the schema-mandated fixed values."""
        tag = self.qualified(block.name, is_root)
        namespace = self.schema.target_namespace
        if is_root and namespace:
            # Declare the default namespace on the root so serialisation keeps
            # the repository's `<themes xmlns="urn:...">` form.
            element = etree.Element(tag, nsmap={None: namespace})
        else:
            element = etree.Element(tag)
        for attr in block.attributes:
            if attr.read_only and attr.initial:
                element.set(attr.name, attr.initial)
        if block.leaf is not None and block.leaf.enumerations and not block.children:
            element.text = block.leaf.enumerations[0]
        return element

    def freeform_block(self, parent_block: BlockSpec, name: str) -> BlockSpec:
        """Synthetic block for xs:any content: the element name is a free key.

        Open groups (e.g. ``StylePropsType``) accept any child in the target
        namespace; the editor still needs a block to display and edit, so one
        is synthesised from the parent's context instead of hardcoded.
        """
        return BlockSpec(
            name=name,
            key=f"{parent_block.key or parent_block.name}.{name}",
            type_name=FREEFORM_TYPE,
            documentation=f"open content (xs:any in {parent_block.name}): the element name is a "
                          "free key, the value follows the style contract",
            leaf=LeafSpec(base="xs:string"),
        )

    def sort_children(self, parent: etree._Element) -> None:
        """Re-order children to the schema's sequence order (stable).

        ``xs:sequence`` is positional, so a block editor must keep siblings in
        declaration order; equal elements keep their relative order, which is
        what makes reordering repeated blocks meaningful.
        """
        block = self.block_of(parent)
        if block is None or not block.children:
            return
        order = {particle.name: index for index, particle in enumerate(block.children)}
        children = list(parent)

        def rank(child: etree._Element) -> int:
            if not isinstance(child.tag, str):
                return len(order) + 1
            return order.get(localname(str(child.tag)), len(order))

        ranked = sorted(range(len(children)), key=lambda i: rank(children[i]))
        for position, original in enumerate(ranked):
            if position != original:
                parent.insert(position, children[original])

    # -- block mutations -------------------------------------------------

    def add_child(
        self, parent: etree._Element, name: str, record: bool = True
    ) -> etree._Element | None:
        """Insert a new block under *parent*; None when the schema forbids it."""
        block = self.block_of(parent)
        if block is None:
            return None
        particle = block.child(name)
        if particle is None:
            if not block.allows_any:
                return None
            # Open content (xs:any): the caller supplies the free key.
            if record:
                self.snapshot()
            element = etree.Element(self.qualified(name))
            parent.append(element)
            self.dirty = True
            return element
        existing = self.child_names(parent).count(name)
        if particle.max_occurs is not None and existing >= particle.max_occurs:
            return None
        if record:
            self.snapshot()
        element = self._make_element(particle.block)
        parent.append(element)
        self.sort_children(parent)
        self.dirty = True
        return element

    def can_remove(self, element: etree._Element) -> tuple[bool, str]:
        """Check the minimum-occurrence constraint before deleting."""
        particle = self.particle_of(element)
        parent = element.getparent()
        if particle is None:
            return True, ""
        if parent is None:
            return False, "the document root cannot be removed"
        name = localname(str(element.tag))
        present = self.child_names(parent).count(name)
        if present <= particle.min_occurs:
            return False, (
                f"{name} requires at least {particle.min_occurs} occurrence(s) "
                f"({particle.occurs_label})")
        return True, ""

    def remove(self, element: etree._Element) -> bool:
        """Delete a block when the content model allows it."""
        allowed, _ = self.can_remove(element)
        parent = element.getparent()
        if not allowed or parent is None:
            return False
        self.snapshot()
        parent.remove(element)
        self.dirty = True
        return True

    def duplicate(self, element: etree._Element) -> etree._Element | None:
        """Clone a block right after itself when its cardinality allows it."""
        parent = element.getparent()
        if parent is None:
            return None
        particle = self.particle_of(element)
        if particle is not None and particle.max_occurs is not None:
            name = localname(str(element.tag))
            if self.child_names(parent).count(name) >= particle.max_occurs:
                return None
        self.snapshot()
        clone = etree.fromstring(etree.tostring(element))
        parent.insert(list(parent).index(element) + 1, clone)
        self.sort_children(parent)
        self.dirty = True
        return clone

    def move(self, element: etree._Element, delta: int) -> bool:
        """Swap a block with its neighbour (meaningful for repeated blocks)."""
        parent = element.getparent()
        if parent is None:
            return False
        siblings = [child for child in parent if isinstance(child.tag, str)]
        try:
            position = siblings.index(element)
        except ValueError:
            return False
        target = position + delta
        if target < 0 or target >= len(siblings):
            return False
        self.snapshot()
        other = siblings[target]
        parent.insert(list(parent).index(element), other)
        self.dirty = True
        return True

    # -- values ----------------------------------------------------------

    def attribute_map(self, element: etree._Element) -> dict:
        """Attributes actually present on the element, in document order."""
        return {name: (value or "") for name, value in element.attrib.items()}

    def set_attribute(self, element: etree._Element, name: str, value: str) -> bool:
        """Set/replace an attribute; empty value removes an optional one."""
        block = self.block_of(element)
        spec = block.attribute(name) if block is not None else None
        if spec is not None and spec.read_only:
            value = spec.fixed or ""
        if value == "" and spec is not None and not spec.required:
            return self.remove_attribute(element, name)
        if element.get(name) == value:
            return False
        self.snapshot()
        element.set(name, value)
        self.dirty = True
        return True

    def remove_attribute(self, element: etree._Element, name: str) -> bool:
        block = self.block_of(element)
        spec = block.attribute(name) if block is not None else None
        if spec is not None and spec.required:
            return False
        if name not in element.attrib:
            return False
        self.snapshot()
        del element.attrib[name]
        self.dirty = True
        return True

    def set_text(self, element: etree._Element, text: str) -> bool:
        """Replace the text content of a value block (preserving whitespace)."""
        current = element.text or ""
        if current == text:
            return False
        self.snapshot()
        element.text = text
        self.dirty = True
        return True

    def text_of(self, element: etree._Element) -> str:
        return element.text or ""

    # -- diagnostics -----------------------------------------------------

    def structural_issues(self) -> list[Issue]:
        """Fast schema-only diagnostics, recomputed live by the editor.

        Covers the constraints a block editor can express without a full XSD
        pass: required children and attributes, fixed values, enumerations,
        patterns and maxOccurs. The authoritative check remains the XSD
        validation below (``xsd_issues``), which reuses the project linter.
        """
        issues: list[Issue] = []
        self._walk(self.root, self.root_block, issues)
        return issues

    def _walk(
        self,
        element: etree._Element,
        block: BlockSpec | None,
        issues: list[Issue],
    ) -> None:
        line = element.sourceline
        if block is None:
            issues.append(Issue(
                "error", element,
                f"unresolved element <{localname(str(element.tag))}>: not reachable from the document root", line))
            return

        for name in unfulfilled_required_attributes(block, list(element.attrib)):
            issues.append(Issue("error", element, f"missing required attribute @{name}", line))

        for attr in block.attributes:
            value = element.get(attr.name)
            if value is None:
                continue
            if attr.fixed is not None and value != attr.fixed:
                issues.append(Issue(
                    "error", element,
                    f"@{attr.name} must be {attr.fixed!r} (fixed by the schema)", line))
            elif attr.enumerations and value not in attr.enumerations:
                issues.append(Issue(
                    "error", element,
                    "@{}={!r} is not one of: {}".format(attr.name, value, ", ".join(attr.enumerations)),
                    line))
            elif attr.pattern and not re.fullmatch(attr.pattern, value):
                issues.append(Issue(
                    "warning", element,
                    f"@{attr.name}={value!r} does not match the schema pattern {attr.pattern}",
                    line))

        counts: dict = {}
        for child in element:
            if isinstance(child.tag, str):
                name = localname(str(child.tag))
                counts[name] = counts.get(name, 0) + 1

        for particle in block.children:
            present = counts.get(particle.name, 0)
            if present < particle.min_occurs:
                issues.append(Issue(
                    "error", element,
                    f"missing required block <{particle.name}> ({particle.occurs_label})",
                    line))
            elif particle.max_occurs is not None and present > particle.max_occurs:
                issues.append(Issue(
                    "error", element,
                    f"too many <{particle.name}>: {present} occurrences, "
                    f"the schema allows {particle.max_occurs}", line))

        if block.leaf is not None and block.leaf.enumerations:
            value = (element.text or "").strip()
            if value and value not in block.leaf.enumerations:
                issues.append(Issue(
                    "error", element,
                    "value {!r} is not one of: {}".format(value, ", ".join(block.leaf.enumerations)), line))

        for child in element:
            if not isinstance(child.tag, str):
                continue
            particle = block.child(localname(str(child.tag)))
            if particle is None and block.allows_any:
                continue  # open content (xs:any): keys are user-defined
            self._walk(child, particle.block if particle is not None else None, issues)

    def elements_by_line(self) -> list[etree._Element]:
        """Every element node in document order (used to map XSD line errors)."""
        return [node for node in self.root.iter() if isinstance(node.tag, str)]

    def closest_element(self, line: int | None) -> etree._Element | None:
        """Element whose start line is the nearest at or before *line*."""
        if line is None:
            return None
        best: etree._Element | None = None
        best_line = -1
        for node in self.elements_by_line():
            node_line = node.sourceline or -1
            if best_line < node_line <= line:
                best, best_line = node, node_line
        return best

    def xsd_issues(self, schema_path: Path) -> list[Issue]:
        """Authoritative XSD validation of the current buffer.

        The buffer is written to a temp file and handed to the project's
        agnostic linter (``design/tools/sources/linter.py``) so the editor and
        the CLI pipeline can never disagree about validity.
        """
        if str(_SOURCES_DIR) not in sys.path:
            sys.path.insert(0, str(_SOURCES_DIR))
        from linter import XSDLinter

        temp_path = self.write_temp()
        try:
            result = XSDLinter(schema_path=str(schema_path)).validate_file(str(temp_path))
        finally:
            try:
                temp_path.unlink()
            except OSError:
                pass

        issues: list[Issue] = []
        for error in result.errors:
            issue_line = getattr(error, "line", None)
            issues.append(Issue(
                getattr(error, "severity", None) or "error",
                self.closest_element(issue_line),
                getattr(error, "message", str(error)),
                issue_line))
        return issues

    def validate(self, schema_path: Path) -> list[Issue]:
        """Structural diagnostics first, then the authoritative XSD pass."""
        return self.structural_issues() + self.xsd_issues(schema_path)

    # -- one-click auto-fix -----------------------------------------------

    def auto_fix(self, max_passes: int = 12) -> dict[str, int]:
        """Repair every issue the block model can fix itself, in one click.

        Adds missing required blocks (recursively, to a fixpoint), sets
        missing required attributes (@fixed, @default, first enumeration or a
        type-based guess), corrects values violating ``@fixed`` or an
        enumeration, and trims children beyond ``maxOccurs``. What cannot be
        guessed safely (patterns, elements unreachable from the root) is
        counted under ``unfixed`` so the caller can point at the diagnostics
        that still need a human. Recorded as a single undo step.
        """
        before = etree.tostring(self.root, encoding="unicode")
        stats = {"blocks": 0, "attributes": 0, "values": 0,
                 "removed": 0, "unfixed": 0}
        self._suspend_history = True
        try:
            for _ in range(max_passes):
                if not self._auto_fix_pass(stats):
                    break
            stats["unfixed"] = self._auto_fix_audit()
        finally:
            self._suspend_history = False
        if etree.tostring(self.root, encoding="unicode") != before:
            self._undo.append(before)
            del self._redo[:]
            if len(self._undo) > 200:
                del self._undo[0]
            self.dirty = True
        return stats

    def _auto_fix_pass(self, stats: dict) -> bool:
        """One repair sweep over the document; True when it changed anything."""
        changed = False
        for element in self.elements_by_line():
            if not isinstance(element.tag, str):
                continue
            block = self.block_of(element)
            if block is None:
                continue

            for attr in block.attributes:
                if attr.required and element.get(attr.name) is None:
                    value = _guess_attribute_value(attr)
                    if value is not None:
                        element.set(attr.name, value)
                        stats["attributes"] += 1
                        changed = True

            for attr in block.attributes:
                value = element.get(attr.name)
                if value is None:
                    continue
                if attr.fixed is not None and value != attr.fixed:
                    element.set(attr.name, attr.fixed)
                    stats["values"] += 1
                    changed = True
                elif attr.enumerations and value not in attr.enumerations:
                    element.set(attr.name, attr.enumerations[0])
                    stats["values"] += 1
                    changed = True

            counts: dict = {}
            for child in element:
                if isinstance(child.tag, str):
                    name = localname(str(child.tag))
                    counts[name] = counts.get(name, 0) + 1
            for particle in block.children:
                have = counts.get(particle.name, 0)
                if have < particle.min_occurs:
                    added = 0
                    for _ in range(particle.min_occurs - have):
                        if self.add_child(element, particle.name) is None:
                            break
                        added += 1
                    if added:
                        stats["blocks"] += added
                        have += added
                        changed = True
                if particle.max_occurs is not None and have > particle.max_occurs:
                    victims = [c for c in element
                               if isinstance(c.tag, str)
                               and localname(str(c.tag)) == particle.name]
                    for victim in victims[particle.max_occurs:]:
                        if self.remove(victim):
                            stats["removed"] += 1
                            changed = True
                        else:
                            break
        return changed

    def _auto_fix_audit(self) -> int:
        """Count what auto-fix could not repair (needs a human decision)."""
        unfixed = 0
        for element in self.elements_by_line():
            block = self.block_of(element)
            if block is None:
                unfixed += 1
                continue
            for attr in block.attributes:
                if (attr.required and element.get(attr.name) is None
                        and _guess_attribute_value(attr) is None):
                    unfixed += 1
        return unfixed


# ---------------------------------------------------------------------------
# One-click auto-fix: plausible values for required attributes
# ---------------------------------------------------------------------------

_POSITIVE_INT = {"xs:positiveInteger", "xs:unsignedByte", "xs:unsignedShort",
                 "xs:unsignedInt", "xs:unsignedLong"}
_INT = {"xs:byte", "xs:short", "xs:int", "xs:long", "xs:integer",
        "xs:nonPositiveInteger"}
_NUM = {"xs:decimal", "xs:float", "xs:double"}


def _guess_attribute_value(spec: AttributeSpec) -> str | None:
    """A plausible value for a required attribute; None when unsafe.

    Preference order: @fixed, @default, first enumeration, boolean, then a
    type-based guess (integer/decimal -> a neutral in-range value, anything
    else -> the empty string, which satisfies ``use="required"`` presence for
    plain strings). A value that cannot satisfy @pattern is not guessed.
    """
    if spec.fixed is not None:
        value = spec.fixed
    elif spec.default is not None:
        value = spec.default
    elif spec.enumerations:
        value = spec.enumerations[0]
    elif spec.is_boolean:
        value = "true"
    else:
        base = spec.type_name or ""
        if base in _POSITIVE_INT:
            value = "1"
        elif base == "xs:negativeInteger":
            value = "-1"
        elif base in _INT or "Integer" in base or base in _NUM:
            value = "0"
        else:
            value = ""
    if spec.pattern and re.fullmatch(spec.pattern, value) is None:
        return None
    return value





