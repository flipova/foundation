"""Flipova Foundation documentation generator (implementation package).

Split out of the historical ``docgen.py`` monolith for modularity:

- ``xsddoc.py``    : generic XSD -> Markdown walker (Schema Reference)
- ``model.py``     : parse_manifest / parse_documentation + typed models
- ``reference.py`` : tokens / themes / schema reference renderers
- ``site.py``      : article rendering, xref resolution, site writing
- ``cli.py``       : argument parsing & assembly (``main``)
"""

from __future__ import annotations

from .cli import main
from .model import DocArticle, DocSection, parse_documentation, parse_manifest
from .reference import (
    render_schema_reference,
    render_themes_reference,
    render_tokens_reference,
)
from .site import build_title_index, render_article_body, resolve_xrefs, write_site
from .xsddoc import collect_types, render_markdown

__all__ = [
    # model
    "DocArticle",
    "DocSection",
    # site
    "build_title_index",
    # xsd walker
    "collect_types",
    # cli
    "main",
    "parse_documentation",
    "parse_manifest",
    "render_article_body",
    # reference
    "render_markdown",
    "render_schema_reference",
    "render_themes_reference",
    "render_tokens_reference",
    "resolve_xrefs",
    "write_site",
]

