# Contributing

The registries are the single source of truth: edit the XML, run the pipeline,
commit the regenerated output.

## Git workflow

`main` is protected and auto-publishes: **never commit on it**.

### Branch strategy

```
main (protected, auto-publish)      <- no direct commit, ever
|
+-- feature/<description>           <- new features (triggers a minor version)
+-- fix/<description>               <- bug fixes (triggers a patch version)
+-- docs/<description>              <- documentation changes
+-- refactor/<description>          <- code restructuring
+-- hotfix/<description>            <- hotfixes (emergency)
```

Use descriptive, lowercase, kebab-case names.

### Branch creation workflow

```bash
# 1. Start from fresh main
git checkout main
git pull origin main

# 2. Create your feature branch
git checkout -b feature/your-branch

# 3. Work on your branch
#    ...make changes...

# 4. Add a changeset
npx changeset          # pick the bump: major / minor / patch

# 5. Update with main
git add .
git commit -m "feat(scope): description"
git push -u origin feature/your-branch

# 6. Submit
#    Open a PR against main and make sure CI passes (Node 20 & 22)
```

### Commit message convention

Use `[type]([optional scope]): [description]`

| Type | Use when |
| :--- | :--- |
| `feat` | New features (triggers a **minor** version) |
| `fix` | Bug fixes (triggers a **patch** version) |
| `docs` | Documentation changes |
| `style` | Code formatting only (no logic change) |
| `refactor` | Code restructuring |
| `test` | Adding / updating tests |
| `chore` | Maintenance tasks (no logic change) |

The type also drives the version bump, so for this repository a **breaking
change to the public API** is `feat!: ...` plus a changeset set to `major` (as
done for the v2 registry-driven theming pipeline).

### Pull request requirements

- Linked issue, description, and **1 approval** required.
- Status checks required: **CI must pass on Node 20 and Node 22**.
- Squash and merge: all discussions resolved, no merge commits.

### Release (automated)

`.github/workflows/release.yml` runs on every push to `main`:

1. `changesets/action` opens or updates a **"chore: version packages"** pull
   request (version bump + CHANGELOG).
2. **Merging that pull request is what publishes** - nothing reaches the
   registry before that human gate.
3. `npm run release` runs `build` + `typecheck` + `changeset publish`, executed
   by CI with `NPM_PUBLISH_TOKEN`. Never publish from a local machine.

## Repository layout

```
design/
|-- manifest.xml       # pipeline config + determinism rules
|-- schema.xsd         # XSD contract validated by the linter
|-- tokens.xml         # design tokens (spacing, colors, typography, ...)
|-- themes.xml         # theme role maps (light, dark)
|-- documentation.xml  # single source of documentation truth
|-- canonical.index.txt
|-- tools/             # Python toolchain (linter, checker, generate, docgen, xmleditor)

components/            # gluestack-ui component source (editable in-project)
|-- ui/gluestack-ui-provider/
|   |-- config.ts      # GENERATED: colour variables (light / dark)
|   \-- tokens.js      # GENERATED: the whole Tailwind theme

tailwind.config.js     # only wires `extend: tokens.theme` - never a design value
docs/                  # Docusaurus site (content generated into docs/generated)
```

## Workflow

1. Edit a source of truth:
   - a token / colour shade -> `design/tokens.xml`;
   - a theme role mapping -> `design/themes.xml`;
   - a determinism rule -> the `<determinism>` block of `design/manifest.xml`;
   - a documentation page -> the matching `<article><content>` in
     `design/documentation.xml`.
2. Run the pipeline and make it pass cleanly:

   ```bash
   npm run design:pipeline
   ```

3. If you touched a registry, sync the canonical index:

   ```bash
   npm run design:canonical
   ```

4. Commit the sources and the regenerated output together
   (`components/ui/gluestack-ui-provider/config.ts`,
   `components/ui/gluestack-ui-provider/tokens.js`, `docs/generated/**`,
   `design/canonical.index.txt`).

Never hand-edit a generated file - the next run overwrites it and any manual
change silently disappears.

`tailwind.config.js` is **not** a place to add design values: it only wires the
generated `tokens.js`. Colours, scales, font families, shadows and z-index
values always belong in `design/tokens.xml` / `design/themes.xml`.

## Theming change in one line

Add or edit a `<role>` in `design/themes.xml` whose `id` is the gluestack CSS
variable name without the two-dash prefix, point it at a token with
`<ref>$ref.tokens.color.....</ref>`, then run `npm run design:gen`.

To change a scale (spacing, radii, typography, shadow, motion), edit the
matching `<token>` in `design/tokens.xml`. To add a semantic colour, add a
`<role>` to **every** theme of `design/themes.xml`. Then `npm run design:gen`:
`tokens.js` - and therefore every Tailwind/nativewind utility - follows
automatically, and `tailwind.config.js` never needs to be touched.
