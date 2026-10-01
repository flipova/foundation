"""CLI (main) for the gluestack config + tokens generator."""

from __future__ import annotations

from .common import *
from .config import render_gluestack_config, theme_role_colours
from .model import load_manifest
from .tokens import render_tokens_theme

RENDERERS = {
    "gluestackConfig": render_gluestack_config,
    "gluestackTokens": render_tokens_theme,
}


def _list(man: ManifestModel) -> None:
    for tid, roles in theme_role_colours(man):
        print(f"{tid} ({len(roles)} role(s))")
        for rid, triplet in roles:
            print(f"  --{rid}: {triplet}")


def _targets(man: ManifestModel) -> list[tuple[Path, str]]:
    targets: list[tuple[Path, str]] = []
    for kind, rel in man.outputs.items():
        render = RENDERERS.get(kind)
        if render is None:
            print(f"error: manifest output {kind!r} has no generator", file=sys.stderr)
            raise SystemExit(2)
        if not rel:
            print(f"error: manifest output {kind!r} has an empty path", file=sys.stderr)
            raise SystemExit(2)
        targets.append(((man.root / rel).resolve(), render(man)))
    if not targets:
        print("error: manifest declares no outputs", file=sys.stderr)
        raise SystemExit(2)
    return targets


def main() -> int:
    repo_root = Path(__file__).resolve().parents[4]
    default_manifest = repo_root / "design" / "manifest.xml"
    parser = argparse.ArgumentParser(
        description="Compile design/tokens.xml + design/themes.xml into the gluestack-ui theme config")
    parser.add_argument("--manifest", "-m", default=str(default_manifest))
    parser.add_argument("--root", "-r", default=str(repo_root),
                        help="repo root (output paths resolve against it)")
    parser.add_argument("--check", action="store_true",
                        help="verify the generated files match (regeneration drift)")
    parser.add_argument("--list", action="store_true", help="list themes and their roles")
    args = parser.parse_args()

    man = load_manifest(Path(args.root), Path(args.manifest))

    if args.list:
        _list(man)
        return 0

    drift = 0
    for target, text in _targets(man):
        if args.check:
            if not target.exists() or target.read_text(encoding="utf-8") != text:
                print(f"changed {target}" if target.exists() else f"missing {target}")
                drift += 1
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            with open(target, "w", encoding="utf-8", newline="\n") as fh:
                fh.write(text)
            print(f"written {target}")

    if args.check:
        if drift:
            return 1
        print("up to date")
    return 0

