from __future__ import annotations

from pathlib import Path

from lxml import etree

from .errors import LintResult, ValidationError


class XSDLinter:
    """Generic XML Schema linter - agnostic, no domain knowledge."""

    def __init__(self, schema_path: str | None = None):
        self._schema: etree.XMLSchema | None = None
        if schema_path:
            self.load_schema(schema_path)

    def load_schema(self, schema_path: str) -> None:
        try:
            schema_doc = etree.parse(schema_path)
            self._schema = etree.XMLSchema(schema_doc)
        except etree.XMLSchemaParseError as e:
            raise ValueError(f"Invalid XSD schema: {e}") from e

    def validate_file(self, xml_path: str) -> LintResult:
        result = LintResult()
        result.files_checked = 1
        try:
            doc = etree.parse(xml_path)
        except etree.XMLSyntaxError as e:
            result.errors.append(ValidationError(
                file=xml_path, line=e.lineno, column=e.offset,
                message=f"Malformed XML: {e.msg}"
            ))
            result.files_invalid = 1
            return result
        if self._schema is None:
            schemaLocation = doc.getroot().get(
                "{http://www.w3.org/2001/XMLSchema-instance}schemaLocation"
            )
            if schemaLocation:
                parts = schemaLocation.split()
                if len(parts) >= 2:
                    schema_dir = Path(xml_path).parent
                    schema_file = schema_dir / parts[-1]
                    if schema_file.exists():
                        self.load_schema(str(schema_file))
        if self._schema is None:
            result.errors.append(ValidationError(
                file=xml_path, line=None, column=None,
                message="No schema available",
                severity="warning"
            ))
            result.files_valid = 1
            return result
        try:
            self._schema.assertValid(doc)
            result.files_valid = 1
        except etree.DocumentInvalid:
            for log_entry in self._schema.error_log:
                result.errors.append(ValidationError(
                    file=log_entry.filename or xml_path,
                    line=log_entry.line,
                    column=log_entry.column,
                    message=log_entry.message,
                ))
            result.files_invalid = 1
        return result
