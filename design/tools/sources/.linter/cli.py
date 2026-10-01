from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .discovery import discover_xml_files
from .errors import LintResult
from .linter import XSDLinter


def main() -> int:
    parser = argparse.ArgumentParser(
        description="XSD linter (agnostic)"
    )
    parser.add_argument("files", nargs="*", help="XML files to validate")
    parser.add_argument("--schema", "-s", help="Path to XSD schema")
    parser.add_argument("--manifest", "-m", help="Validate files from manifest")
    parser.add_argument("--dir", "-d", help="Validate all XML in directory")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()
    files_to_check = []
    if args.manifest:
        files_to_check.extend(discover_xml_files(args.manifest))
    if args.dir:
        files_to_check.extend(str(f) for f in Path(args.dir).glob("*.xml"))
    files_to_check.extend(args.files)
    files_to_check = list(dict.fromkeys(files_to_check))
    if not files_to_check:
        parser.error("No files to validate")
    linter = XSDLinter(schema_path=args.schema)
    total = LintResult()
    for xml_file in files_to_check:
        result = linter.validate_file(xml_file)
        total.merge(result)
        if args.verbose or result.errors:
            print(f"--- {xml_file} ---")
            for err in result.errors:
                print(f"  {err}")
            if not result.errors:
                print("  OK")
    print()
    print(total.summary())
    sys.exit(0 if total.success else 1)
