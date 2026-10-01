"""Command line entry point of the visual XML block editor.

The GUI is the default, but the same schema introspection is exposed headless
so the tool composes with the rest of the pipeline (and with CI):

    python3 xmleditor.py                              # open the GUI
    python3 xmleditor.py design/themes.xml            # GUI on one file
    python3 xmleditor.py --list-roots
    python3 xmleditor.py --list-blocks
    python3 xmleditor.py --describe themes
    python3 xmleditor.py --validate design/*.xml
    python3 xmleditor.py --new tokens --out design/tokens.xml
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .blocks import contextual_entries, describe, profile_categories
from .model import DocumentModel
from .xsdmodel import load_schema

# design/tools/sources/.xmleditor/cli.py -> design/schema.xsd
DESIGN_DIR = Path(__file__).resolve().parents[3]
DEFAULT_SCHEMA = DESIGN_DIR / "schema.xsd"


def _print_profile(schema) -> None:
    for category, blocks in profile_categories(schema).items():
        print(f"{category} ({len(blocks)}):")
        for block in blocks:
            extra = f" [{block.type_name}]" if block.type_name else ""
            print(f"  - {block.key or block.name}{extra}")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        description="Visual, XSD-driven XML block editor (GUI by default).")
    parser.add_argument("file", nargs="?", help="XML file to open in the GUI")
    parser.add_argument("--schema", "-s", default=str(DEFAULT_SCHEMA),
                        help="schema.xsd used as the single source of truth")
    parser.add_argument("--list-roots", action="store_true",
                        help="print the root elements declared in the schema")
    parser.add_argument("--list-blocks", nargs="?", const="", metavar="BLOCK",
                        help="print the block profile, or what BLOCK accepts")
    parser.add_argument("--describe", metavar="BLOCK",
                        help="print the full schema description of a block")
    parser.add_argument("--validate", nargs="+", metavar="FILE",
                        help="validate files against the schema (headless)")
    parser.add_argument("--new", metavar="ROOT",
                        help="create a new document whose root is ROOT (headless)")
    parser.add_argument("--out", "-o", metavar="FILE",
                        help="output file for --new (defaults to stdout)")
    args = parser.parse_args(argv)

    schema_path = Path(args.schema)
    if not schema_path.exists():
        print(f"schema not found: {schema_path}", file=sys.stderr)
        return 2
    schema = load_schema(schema_path)

    if args.list_roots:
        for root in schema.roots:
            print(f"{root.name}  ({len(root.children)} block(s) below)")
            if root.documentation:
                print(f"    {root.documentation}")
        return 0

    if args.list_blocks is not None:
        if not args.list_blocks:
            _print_profile(schema)
            return 0
        block = schema.block(args.list_blocks)
        if block is None:
            print(f"unknown block: {args.list_blocks}", file=sys.stderr)
            return 2
        for entry in contextual_entries(schema, block, []):
            print(f"  {entry.label:<24} {entry.category:<12} {entry.detail}")
        return 0

    if args.describe:
        block = schema.block(args.describe)
        if block is None:
            print(f"unknown block: {args.describe}", file=sys.stderr)
            return 2
        print(describe(block))
        return 0

    if args.validate:
        failures = 0
        for name in args.validate:
            path = Path(name)
            if not path.exists():
                print(f"missing file: {path}", file=sys.stderr)
                failures += 1
                continue
            try:
                document = DocumentModel.load(schema, path)
            except Exception as exc:  # noqa: BLE001 - reported, not raised
                print(f"{path}: cannot parse ({exc})")
                failures += 1
                continue
            issues = document.validate(schema_path)
            errors = [issue for issue in issues if issue.severity == "error"]
            print(f"{path}: {len(issues)} issue(s), {len(errors)} error(s)")
            for issue in issues:
                line = f":{issue.line}" if issue.line else ""
                print(f"  [{issue.severity}]{line} {issue.message}")
            if errors:
                failures += 1
        return 1 if failures else 0

    if args.new:
        try:
            document = DocumentModel.new(schema, args.new)
        except ValueError as exc:
            print(str(exc), file=sys.stderr)
            return 2
        text = document.to_string()
        if args.out:
            out = Path(args.out)
            out.parent.mkdir(parents=True, exist_ok=True)
            with open(out, "w", encoding="utf-8", newline="\n") as handle:
                handle.write(text)
            print(f"wrote {out}")
        else:
            print(text, end="")
        return 0

    # Default: the graphical editor (imported lazily so headless modes never
    # need a display or the GUI toolkit).
    from .editor import launch

    path = Path(args.file) if args.file else None
    return launch(schema, path)


if __name__ == "__main__":
    sys.exit(main())
