# Quick Start

The design pipeline does one job: it turns the **tokens** and **themes**
registries into the gluestack/nativewind theme config. Edit the XML, then
regenerate.

```bash
# 1. XSD conformance of every XML under design/
npm run design:lint

# 2. Determinism rules + ruff lint of the toolchain
npm run design:check

# 3. Compile tokens/themes -> config.ts (colour vars) + tokens.js (Tailwind theme)
npm run design:gen

# 4. Verify the committed canonical index is in sync
npm run design:verify

# 5. Regenerate the documentation site (docs/generated)
npm run design:doc
```

Or run the whole chain at once:

```bash
npm run design:pipeline
```

Commit the regenerated `config.ts`, `tokens.js`, `docs/generated/**` and
`design/canonical.index.txt` together with the XML change.
