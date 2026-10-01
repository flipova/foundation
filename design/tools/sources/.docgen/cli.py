#!/usr/bin/env python3
"""docgen CLI - assembles the content kinds and writes the site.

    python3 docgen.py --manifest ../../manifest.xml --documentation ../../documentation.xml
        --root ../.. --out ../../docs/generated
    (or via the wrappers: design/tools/unix/doc.sh / windows/doc.cmd)
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from .model import parse_documentation, parse_manifest
from .reference import (
    render_schema_reference,
    render_themes_reference,
    render_tokens_reference,
)
from .site import write_site

# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    repo_root_default = Path(__file__).resolve().parents[4]
    default_manifest = repo_root_default / "design" / "manifest.xml"

    parser = argparse.ArgumentParser(
        description="Generate the Flipova Foundation documentation site from the manifest and documentation.xml.")
    parser.add_argument("--manifest", "-m", default=str(default_manifest))
    parser.add_argument("--documentation", "-d", default=None,
                          help="Path to documentation.xml (default: <design dir>/documentation.xml)")
    parser.add_argument("--root", "-r", default=None,
                          help="Repo root (defaults to the manifest's parent's parent, "
                               "i.e. the directory containing design/)")
    parser.add_argument("--out", "-o", default=None,
                          help="Output directory for the generated site "
                               "(default: <repo root>/docs/generated)")
    args = parser.parse_args()

    manifest_path = Path(args.manifest).resolve()
    design_dir = manifest_path.parent
    root = Path(args.root).resolve() if args.root else design_dir.parent
    out_dir = Path(args.out).resolve() if args.out else root / "docs" / "generated"
    doc_path = Path(args.documentation).resolve() if args.documentation else design_dir / "documentation.xml"
    if not doc_path.exists():
        raise SystemExit(f"documentation file not found: {doc_path} -- run docgen from a checkout containing design/documentation.xml")

    model = parse_manifest(manifest_path)
    model["doc_sections"] = parse_documentation(doc_path)

    schema_path = design_dir / "schema.xsd"
    tokens_path = design_dir / "tokens.xml"
    themes_path = design_dir / "themes.xml"

    dynamic: dict[str, str] = {}
    try:
        dynamic["schema"] = render_schema_reference(schema_path)
    except Exception as exc:  # noqa: BLE001
        print(f"warning: could not render schema reference: {exc}", file=sys.stderr)
        dynamic["schema"] = "_Schema reference unavailable -- see `design/schema.xsd` directly._\n"

    dynamic["tokens"] = render_tokens_reference(tokens_path)
    dynamic["themes"] = render_themes_reference(themes_path)

    # Version stamping: the ONE version is the root package.json (the version
    # actually published). The registry deliberately stores no copy of it, so
    # there is nothing that can drift after `changeset version` bumps it.
    # Resolved BEFORE writing the site: the generated pages show the version.
    version = ""
    try:
        version = json.loads((root / "package.json").read_text(encoding="utf-8")).get("version", "")
    except (ValueError, OSError):
        version = ""
    model["version"] = version

    written = write_site(model, out_dir, dynamic, root)

    # Keep the Docusaurus site package.json (docs/package.json) aligned.
    site_pkg_path = out_dir.parent / "package.json"
    if version and site_pkg_path.exists():
        try:
            site_pkg = json.loads(site_pkg_path.read_text(encoding="utf-8"))
            if site_pkg.get("version") != version:
                site_pkg["version"] = version
                with open(site_pkg_path, "w", encoding="utf-8", newline="\n") as fh:
                    fh.write(json.dumps(site_pkg, indent=2) + "\n")
                print(f"synced {site_pkg_path} version -> {version}")
        except (ValueError, OSError) as exc:
            print(f"warning: could not sync {site_pkg_path}: {exc}", file=sys.stderr)

    print(f"Documentation generated: {len(written)} file(s) under {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
