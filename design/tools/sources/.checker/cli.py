from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

from .io import build_model, canonical_document, sync_versions, validate_xsd
from .model import Diagnostic
from .registry import HANDLERS, expand_targets
from .report import Report

# design/tools/sources/.checker/cli.py -> design/tools/sources
SOURCES_DIR = Path(__file__).resolve().parents[1]
RUFF_CONFIG = SOURCES_DIR / "ruff.toml"


def run_ruff(report: Report, verbose: bool) -> None:
    """Lint the toolchain's Python sources with ruff (part of ``--check``).

    Runs the project's interpreter (``python -m ruff``) over every script and
    dot-package under ``design/tools/sources`` with the same ``ruff.toml`` the
    editors use, so ``npm run design:check`` gates Python style next to the
    manifest determinism rules.
    """
    cmd = [sys.executable, "-m", "ruff", "check",
           "--config", str(RUFF_CONFIG),
           "--output-format", "concise", "--quiet", "."]
    if verbose:
        print(f"ruff: {' '.join(cmd)}  (cwd={SOURCES_DIR})")
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, cwd=str(SOURCES_DIR),
                              check=False)
    except OSError as exc:
        report.diagnostics.append(Diagnostic(
            "ruff", "error", str(RUFF_CONFIG), None, f"cannot run ruff: {exc}"))
        return
    stderr = (proc.stderr or "").strip()
    if proc.returncode not in (0, 1):
        # Not lint results: ruff is missing or the invocation failed.
        first = stderr.splitlines()[0] if stderr else f"exit code {proc.returncode}"
        report.diagnostics.append(Diagnostic(
            "ruff", "error", str(RUFF_CONFIG), None,
            f"ruff failed to run ({first}); install it with: "
            "pip install -r design/tools/requirements.txt"))
        return
    seen = 0
    for line in (proc.stdout or "").splitlines():
        line = line.strip()
        if not line:
            continue
        seen += 1
        match = re.match(r"^(?P<file>.+?):(?P<line>\d+):\d+: (?P<code>\S+) (?P<msg>.+)$", line)
        if match is None:
            report.diagnostics.append(Diagnostic(
                "ruff", "error", str(SOURCES_DIR), None, line))
            continue
        report.diagnostics.append(Diagnostic(
            "ruff", "error", match.group("file"), int(match.group("line")),
            f"{match.group('code')}: {match.group('msg')}"))
    if seen:
        print(f"ruff: {seen} violation(s) ({SOURCES_DIR})")
    elif verbose:
        print(f"ruff: clean ({SOURCES_DIR})")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Manifest-driven determinism checker (rules declared in the manifest, not in code)."
    )
    parser.add_argument("--manifest", "-m", required=True, help="Path to manifest.xml")
    parser.add_argument("--root", "-r", default=".", help="Repository root for applyTo globs (default: cwd)")
    parser.add_argument("--schema", "-s", help="Optional XSD schema: validates every XML via linter.py first")
    parser.add_argument("--check", action="store_true",
                        help="Run the declared determinism rules + the ruff lint of design/tools/sources (default)")
    parser.add_argument("--list-rules", action="store_true", help="Print the rules declared in the manifest")
    parser.add_argument("--emit-canonical", action="store_true", help="Write the deterministic canonical index")
    parser.add_argument("--out", default=None, help="Output path for --emit-canonical (default: design/canonical.index.txt)")
    parser.add_argument("--verify-canonical", action="store_true", help="Compare committed canonical index with the registry")
    parser.add_argument("--sync-version", action="store_true",
                        help="Rewrite @version/@schema on every XML root tag to the manifest values")
    parser.add_argument("--no-ruff", action="store_true",
                        help="Skip the ruff lint of design/tools/sources during --check")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    manifest_path = Path(args.manifest).resolve()
    ctx = build_model(root, manifest_path)

    if args.list_rules:
        print("Determinism rules declared in {} (handlers: {}):".format(manifest_path.relative_to(root), ", ".join(sorted(HANDLERS))))
        for rule in ctx.rules:
            status = "registered" if rule.kind in HANDLERS else "NO HANDLER (warning)"
            print(f"  - {rule.id}  kind={rule.kind} severity={rule.severity} applyTo={rule.apply_to}  [{status}]")
            print(f"      {rule.description}")
        return 0

    report = Report()

    if args.schema:
        xsd_report = validate_xsd(ctx, Path(args.schema), args.verbose)
        report.diagnostics.extend(xsd_report.diagnostics)

    if args.check:
        for rule in ctx.rules:
            if rule.kind not in HANDLERS:
                report.add(rule, manifest_path.name, None,
                           f"no handler registered for kind={rule.kind!r}; rule declared but not enforced yet")
                continue
            targets = expand_targets(root, rule.apply_to)
            HANDLERS[rule.kind](ctx, rule, targets, report)
            if args.verbose:
                print(f"rule {rule.id} [{rule.kind}]: {len(targets)} file(s), "
                      f"{sum(1 for d in report.diagnostics if d.rule_id == rule.id)} diagnostic(s)")
        if not args.no_ruff:
            run_ruff(report, args.verbose)

    if args.emit_canonical:
        out = Path(args.out) if args.out else root / "design" / "canonical.index.txt"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(canonical_document(ctx), encoding="utf-8")
        print(f"canonical index written to {out}")

    if args.verify_canonical:
        canonical_path = Path(args.out) if args.out else root / "design" / "canonical.index.txt"
        if not canonical_path.exists():
            report.diagnostics.append(Diagnostic(
                "canonical", "error", str(canonical_path), None,
                "canonical index file missing; run --emit-canonical"
            ))
        else:
            committed = canonical_path.read_text(encoding="utf-8").strip()
            expected = canonical_document(ctx).strip()
            if committed != expected:
                report.diagnostics.append(Diagnostic(
                    "canonical", "error", str(canonical_path), None,
                    "canonical index drifted from the registry; run --emit-canonical and commit the new file"
                ))

    if args.sync_version:
        synced = sync_versions(ctx)
        print(f"sync-version: {synced} file(s) updated (version={ctx.version!r} schema={ctx.schema_id!r})")

    for diag in report.diagnostics:
        print(f"  {diag}")
    errors = report.errors
    print(f"checker: {len(errors)} error(s), {len(report.warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
