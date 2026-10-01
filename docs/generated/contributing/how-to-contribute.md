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

## Versioning

There is exactly **one** version in this repository: the root `package.json`,
the one that actually gets published. The registries store no copy of it, so
nothing can drift:

- `npm run version:bump` (= `changeset version` + `npm run design:doc`) bumps
  `package.json` and regenerates the documentation in the same step, so
  `docs/package.json` and the version shown by the site follow immediately. The
  release workflow uses that command, so the "chore: version packages" pull
  request can never be inconsistent.
- `design/manifest.xml` has **no** `<version>` element: the XSD would reject it,
  so a second copy cannot be reintroduced by accident.
- `checker.py --sync-version` only propagates `@schema`; the version is not part
  of the XML contract anymore.

CI enforces the rest - on every pull request *and* on every push to `main`:

| Gate | What it prevents |
|---|---|
| `design:lint` | an XML that no longer matches `schema.xsd` |
| `design:check` | a determinism-rule violation (ids, ordering, references, locale, sync) or a Python lint error |
| `design:verify` | a canonical index that drifted from the registries |
| `design:gen --check` | a stale `config.ts` / `tokens.js` committed by hand |
| `changeset status --since=origin/main` | shipping a change to the published surface (`design/`, `components/`, `package.json`, entry points) without a version decision |

Branch protection on `main` (1 approval, required status checks, squash only) is
the remaining control and lives in the GitHub repository settings, not in the
codebase.
