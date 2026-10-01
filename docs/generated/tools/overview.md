# Tools Overview

The design toolchain is a handful of Python scripts under
`design/tools/sources/`, wired together only through `manifest.xml` and
`schema.xsd`:

| Tool | Role |
|---|---|
| `linter.py` | Validates **XSD conformance** of every XML file. 100% agnostic: it only knows "XML <-> XSD". |
| `checker.py` | Applies the **determinism rules** declared in `meta/determinism`; during `--check` it also lints `sources/` with `ruff`. |
| `generate.py` | Compiles `tokens.xml` + `themes.xml` into `config.ts` (colour variables) and `tokens.js` (the whole Tailwind theme). |
| `docgen.py` | Generates the documentation site under `docs/generated` from `documentation.xml`, `schema.xsd`, `tokens.xml` and `themes.xml`. |
| `xmleditor.py` | Visual, XSD-driven XML block editor (tkinter GUI + headless CLI) for the registry files. |

Folder layout:

```
design/tools/
├── sources/        Python scripts + their dot-packages (.checker, .docgen, .generate, .linter, .xmleditor)
├── windows/        Windows wrappers (.cmd) - pin the venv interpreter
├── unix/           Linux/macOS wrappers (.sh) - pin the venv interpreter
├── design.js       cross-platform Node entry point used by the npm scripts
├── requirements.txt
```

### Editor schema resolution

XML-aware editors (VS Code Red Hat XML / LemMinX, …) resolve the registries
through the OASIS catalog in `.vscode/xml-catalog.xml`, registered in
`.vscode/settings.json` under `xml.catalogs`. It maps
`urn:flipova:foundation:registry` to `design/schema.xsd`, so validation never
depends on `xsi:schemaLocation` path resolution (which is what makes the
`schema_reference.4` / `cvc-elt.1.a` errors appear on Windows when a path is
mis-resolved).
