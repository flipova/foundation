"""Flipova Foundation determinism checker (implementation package).

Split out of the historical ``checker.py`` monolith for modularity:

- ``model.py``     : Rule/Diagnostic/RegistryModel, reference resolution
- ``registry.py``  : handler registry, target expansion, ordering checks
- ``checks.py``    : one handler per rule kind (ids, ordering, references,
                     timestamps, locale, style, sync)
- ``io.py``        : build_model, canonical index, sync-version, XSD pass
- ``cli.py``       : argument parsing & dispatch (``main``)
- ``report.py``    : Report (diagnostics collector)
"""

from __future__ import annotations

from .checks import (
    handler_ids,
    handler_locale,
    handler_ordering,
    handler_references,
    handler_sync,
    handler_timestamps,
)
from .cli import main
from .io import (
    build_model,
    canonical_document,
    canonical_payload,
    resolve_reference_value,
    sync_versions,
    validate_xsd,
)
from .model import (
    Diagnostic,
    RegistryModel,
    Rule,
    cap,
    localname,
    natural_key,
    q,
    resolve_reference,
    slug,
)
from .registry import HANDLERS, expand_targets, iter_files, register
from .report import Report

__all__ = [
    # registry
    "HANDLERS",
    # model
    "Diagnostic",
    "RegistryModel",
    # report
    "Report",
    "Rule",
    # io
    "build_model",
    "canonical_document",
    "canonical_payload",
    "cap",
    "expand_targets",
    # checks
    "handler_ids",
    "handler_locale",
    "handler_ordering",
    "handler_references",
    "handler_sync",
    "handler_timestamps",
    "iter_files",
    "localname",
    # cli
    "main",
    "natural_key",
    "q",
    "register",
    "resolve_reference",
    "resolve_reference_value",
    "slug",
    "sync_versions",
    "validate_xsd",
]
