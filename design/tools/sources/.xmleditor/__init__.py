"""Visual, XSD-driven XML block editor (implementation package).

Split out of a single script for modularity:

- ``xsdmodel.py`` : XSD introspection -> SchemaModel (roots, blocks, nested
                    particles with real cardinality, attributes, enumerations,
                    xs:group / xs:attributeGroup, complexContent extension,
                    simpleContent, xs:any, xs:documentation)
- ``blocks.py``   : block profile + contextual palette (what may go where)
- ``model.py``    : editable document (lxml), undo/redo, structural checks and
                    authoritative XSD validation via design/tools/sources/linter.py
- ``widgets.py``  : ttk widgets (palette, block tree, UML-ish diagram,
                    typed inspector, source view)
- ``editor.py``   : main window
- ``cli.py``      : CLI and headless modes (``main``)

``widgets``/``editor`` need a GUI toolkit and are therefore imported lazily by
the CLI, so every headless mode works on machines without tkinter.
"""

from __future__ import annotations

from .blocks import (
    PaletteEntry,
    can_add,
    contextual_entries,
    describe,
    missing_required,
    profile_categories,
    unfulfilled_required_attributes,
)
from .cli import DEFAULT_SCHEMA, main
from .model import XML_DECLARATION, DocumentModel, Issue
from .xsdmodel import (
    AttributeSpec,
    BlockSpec,
    LeafSpec,
    ParticleSpec,
    SchemaModel,
    format_occurs,
    load_schema,
    localname,
    node_key,
    xs,
)

__all__ = [
    # cli
    "DEFAULT_SCHEMA",
    "XML_DECLARATION",
    # xsdmodel
    "AttributeSpec",
    "BlockSpec",
    # model
    "DocumentModel",
    "Issue",
    "LeafSpec",
    # blocks
    "PaletteEntry",
    "ParticleSpec",
    "SchemaModel",
    "can_add",
    "contextual_entries",
    "describe",
    "format_occurs",
    "load_schema",
    "localname",
    "main",
    "missing_required",
    "node_key",
    "profile_categories",
    "unfulfilled_required_attributes",
    "xs",
]
