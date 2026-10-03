---
'@flipova/foundation': minor
---

flipova-design no longer copies the registries into the consumer project: it drives the toolchain already installed in node_modules/@flipova/foundation/design
init/inject inject only the app-level files (tailwind.config.js, postcss.config.js, globals.css) plus the design:* npm scripts, and never overwrite what exists unless --force
new where prints the resolved registries and artifacts, inject replays the wiring without the toolchain
a project design/manifest.xml stays supported as an explicit fork, and gen then writes into the project
design.js honours FOUNDATION_VENV and FOUNDATION_DOCS_OUT, and probes the project venv or any python on PATH that can import lxml
