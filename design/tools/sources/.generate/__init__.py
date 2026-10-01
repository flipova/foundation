"""Flipova Foundation gluestack config generator (implementation package).

The design pipeline has a single function: turn the registries
(design/tokens.xml + design/themes.xml) into the gluestack-ui/nativewind theme
configuration (components/ui/gluestack-ui-provider/config.ts).

Modules:

- ``common.py`` : shared imports, XML namespace, ``q()`` helper
- ``model.py``  : ManifestModel + load_manifest (manifest.xml)
- ``config.py`` : tokens/themes -> gluestack config.ts renderer (colours)
- ``tokens.py`` : tokens -> Tailwind/nativewind theme fragment (tokens.js)
- ``cli.py``    : argument parsing & dispatch (``main``)
"""

from __future__ import annotations

from .cli import main
from .common import GENERATOR_NOTE, NS, q
from .config import render_gluestack_config, theme_role_colours, theme_role_ids
from .model import ManifestModel, load_manifest
from .tokens import render_tokens_theme

__all__ = [
    "GENERATOR_NOTE",
    "NS",
    "ManifestModel",
    "load_manifest",
    "main",
    "q",
    "render_gluestack_config",
    "render_tokens_theme",
    "theme_role_colours",
    "theme_role_ids",
]
