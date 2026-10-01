from __future__ import annotations

from .cli import main
from .discovery import discover_xml_files
from .errors import LintResult, ValidationError
from .linter import XSDLinter

__all__ = ["LintResult", "ValidationError", "XSDLinter", "discover_xml_files", "main"]

