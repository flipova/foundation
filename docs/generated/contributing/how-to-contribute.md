# How to Contribute

The registries are the single source of truth. Change the XML, run the
pipeline, commit the regenerated output.

1. **Edit a source of truth:**
   - palette/shade value -> `design/tokens.xml`;
   - theme role mapping -> `design/themes.xml`;
   - determinism rule -> the `<determinism>` block in `design/manifest.xml`
     (then implement/locate the handler in `checker.py`);
   - documentation -> the relevant `<article><content>` in
     `design/documentation.xml`.
2. **Regenerate and validate:**
   ```bash
   npm run design:pipeline
   ```
   This runs `gen`, `check`, `verify` and `doc` in order, all of which must be
   clean.
3. **Keep the canonical index in sync** if you touched a registry:
   ```bash
   npm run design:canonical   # then commit design/canonical.index.txt
   ```
4. **Never hand-edit a generated file** (`config.ts`, `tokens.js`,
   `docs/generated/**`) - the next run overwrites it.
5. **Never add a design value to `tailwind.config.js`**: it only wires the
   generated `tokens.js`. A colour, scale, font family, shadow or z-index always
   belongs in `design/tokens.xml` / `design/themes.xml`.
6. **Keep the roles in sync across themes**: a semantic colour is a `<role>` in
   *every* theme of `design/themes.xml` (the generator warns when they diverge).
