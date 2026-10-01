"""Manifest model (strictly read from manifest.xml)."""

from __future__ import annotations

from .common import *

# ---------------------------------------------------------------------------
# Manifest model (strictly read from manifest.xml)
# ---------------------------------------------------------------------------


@dataclass
class ManifestModel:
    root: Path
    manifest_path: Path
    schema_path: Path
    source: str
    outputs: dict[str, str]                 # output kind -> relative path
    ctx: checker.RegistryModel

    @property
    def registers(self) -> list[str]:
        return self.ctx.registers


def load_manifest(root: Path, manifest_path: Path) -> ManifestModel:
    mroot = etree.parse(str(manifest_path)).getroot()
    pipeline = mroot.find(q("meta") + "/" + q("pipeline"))
    if pipeline is None:
        raise SystemExit("manifest: missing meta/pipeline")
    source_el = pipeline.find(q("source"))
    outputs_el = pipeline.find(q("outputs"))
    if outputs_el is None:
        raise SystemExit("manifest: missing meta/pipeline/outputs")
    outputs: dict[str, str] = {}
    for child in outputs_el:
        outputs[checker.localname(child.tag)] = (child.text or "").strip()

    schema_path = manifest_path.parent / "schema.xsd"
    if not schema_path.exists():
        raise SystemExit("schema.xsd not found next to the manifest")

    ctx = checker.build_model(root, manifest_path)
    return ManifestModel(
        root=root.resolve(),
        manifest_path=manifest_path.resolve(),
        schema_path=schema_path,
        source=(source_el.text or "").strip() if source_el is not None else "",
        outputs=outputs,
        ctx=ctx,
    )
