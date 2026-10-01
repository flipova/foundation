"""Block profile — the palette and the contextual "what may go here?" engine.

Everything here is computed from ``SchemaModel``: block categories, addable
children, cardinality limits and tooltips. There is no table of component or
attribute names anywhere in the editor, so extending ``design/schema.xsd``
extends the GUI with no code change.
"""

from __future__ import annotations

from collections import OrderedDict
from dataclasses import dataclass
from typing import Sequence

from .xsdmodel import UNBOUNDED, BlockSpec, ParticleSpec, SchemaModel, format_occurs


@dataclass
class PaletteEntry:
    """One addable block, with the context that made it available."""

    block: BlockSpec
    particle: ParticleSpec | None = None
    category: str = ""
    reason: str = ""

    @property
    def label(self) -> str:
        if self.block.name == "*":
            return "+ free key…"
        return self.block.name

    @property
    def detail(self) -> str:
        parts: list[str] = []
        if self.particle is not None:
            parts.append(format_occurs(self.particle.min_occurs, self.particle.max_occurs))
            if self.particle.via_choice:
                parts.append("choice")
            if self.particle.via_ref:
                parts.append("ref")
        if self.block.type_name:
            parts.append(self.block.type_name)
        return " · ".join(parts)

    @property
    def tooltip(self) -> str:
        lines: list[str] = []
        if self.reason:
            lines.append(self.reason)
        if self.particle is not None:
            lines.append(f"allowed {self.particle.occurs_label}")
        if self.block.type_name:
            lines.append(f"type: {self.block.type_name}")
        if self.block.documentation:
            lines.append(self.block.documentation)
        children = [p.name for p in self.block.children]
        if children:
            lines.append("children: {}".format(", ".join(children)))
        if self.block.attributes:
            lines.append("attributes: {}".format(", ".join(a.name for a in self.block.attributes)))
        return "\n".join(lines)


def profile_categories(schema: SchemaModel) -> OrderedDict[str, list[BlockSpec]]:
    """Palette categories derived from the schema shape (XSD-only)."""
    return schema.profile()


def can_add(particle: ParticleSpec, existing_count: int) -> bool:
    """True while the content model still accepts another copy."""
    if particle.max_occurs is UNBOUNDED:
        return True
    return existing_count < particle.max_occurs


def contextual_entries(
    schema: SchemaModel,
    block: BlockSpec | None,
    child_names: Sequence[str],
) -> list[PaletteEntry]:
    """Blocks that may be inserted under *block*, given its current children.

    ``child_names`` is the list of element names already present (repeats
    included), so cardinality limits are respected exactly. Missing required
    blocks come first — the palette doubles as a completeness checklist.
    """
    if block is None:
        return [
            PaletteEntry(block=root, category="Roots", reason="root element")
            for root in schema.roots
        ]

    counts: dict = {}
    for name in child_names:
        counts[name] = counts.get(name, 0) + 1

    required: list[PaletteEntry] = []
    allowed: list[PaletteEntry] = []
    for particle in block.children:
        current = counts.get(particle.name, 0)
        if not can_add(particle, current):
            continue
        entry = PaletteEntry(block=particle.block, particle=particle)
        if particle.required and current == 0:
            entry.category = "Required"
            entry.reason = "required by the schema"
            required.append(entry)
        else:
            entry.category = "Allowed"
            entry.reason = "allowed here"
            allowed.append(entry)

    if block.allows_any:
        allowed.append(PaletteEntry(
            block=BlockSpec(
                name="*",
                key="%s.*" % (block.key or block.name),
                type_name="xs:any",
                documentation="open content (xs:any): the schema lets you choose "
                              "the element name, the value follows the group's contract"),
            category="Open content",
            reason="the schema opens this group to free keys (xs:any)"))

    return required + allowed


def missing_required(block: BlockSpec, child_names: Sequence[str]) -> list[ParticleSpec]:
    """Required particles that have no occurrence yet."""
    present = set(child_names)
    return [p for p in block.children if p.required and p.name not in present]


def unfulfilled_required_attributes(block: BlockSpec, attribute_names: Sequence[str]) -> list[str]:
    """Required attributes that are still absent on an element."""
    present = set(attribute_names)
    return [a.name for a in block.attributes if a.required and a.name not in present]


def describe(block: BlockSpec) -> str:
    """Multi-line schema description used by the inspector pane."""
    lines = ["{}{}".format(block.name, f" ({block.type_name})" if block.type_name else "")]
    if block.key and block.key != block.name:
        lines.append(f"key: {block.key}")
    lines.append(f"kind: {block.kind}")
    if block.mixed:
        lines.append("content: mixed text + blocks")
    if block.leaf is not None:
        lines.append(f"value type: {block.leaf.base}")
        if block.leaf.enumerations:
            lines.append("allowed values: {}".format(", ".join(block.leaf.enumerations)))
        if block.leaf.pattern:
            lines.append(f"pattern: {block.leaf.pattern}")
    if block.allows_any:
        lines.append("content: xs:any (extension points allowed)")
    if block.children:
        lines.append("children:")
        for particle in block.children:
            marks = []
            if particle.required:
                marks.append("required")
            if particle.repeatable:
                marks.append("repeatable")
            if particle.via_choice:
                marks.append("choice")
            suffix = " [{}]".format(", ".join(marks)) if marks else ""
            lines.append(f"  - {particle.name} {particle.occurs_label}{suffix}")
    if block.attributes:
        lines.append("attributes:")
        for attr in block.attributes:
            flags = [attr.use]
            if attr.fixed is not None:
                flags.append(f"fixed={attr.fixed}")
            elif attr.default is not None:
                flags.append(f"default={attr.default}")
            if attr.enumerations:
                flags.append("one of {}".format("|".join(attr.enumerations)))
            if attr.pattern:
                flags.append(f"pattern={attr.pattern}")
            lines.append("  - {} ({})".format(attr.name, ", ".join(flags)))
    if block.documentation:
        lines.append("")
        lines.append(block.documentation)
    return "\n".join(lines)

