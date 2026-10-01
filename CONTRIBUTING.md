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

### Issues and pull requests

Every change is traceable back to an issue, and every issue ends up in a
changelog entry.

1. **Open an issue first** using one of the two forms (`.github/ISSUE_TEMPLATE/`).
   They ask for the version and the affected layer, which is exactly what is
   needed to judge a design-system report. For this repository the "area" is the
   registry entry involved: a token, a theme role, a determinism rule, a tool.
2. **Branch off `main`** with a kebab-case name (`feature/`, `fix/`, `docs/`,
   `refactor/`, `hotfix/`) and **one topic per branch**.
3. **Open a pull request** with the template, and start it with `Closes #<n>`
   so the issue closes automatically on merge. That linkage is what makes the
   project board meaningful.
4. **Declare the release decision** in the PR (the *Release decision* section)
   and add the matching changeset. For a design system this is the important
   part: `major` breaks the public API (component imports, Tailwind utilities,
   CLI), `minor` adds to it, `patch` is internal.
5. **Labels are applied automatically** from the files a pull request touches
   (`.github/labeler.yml`): `registry`, `tokens`, `theme`, `components`,
   `config`, `ci`, `docs`. A pull request touching `design/` is always
   `registry`, so design changes are easy to filter.

### Pull request requirements

- Linked issue, description, and **1 approval** required.
- Status checks required: **CI must pass on Node 20 and Node 22**.
- The `Design registry` gate must pass (it refuses a pull request that breaks the
  registries, leaves a generated file stale, or changes the published surface
  without a changeset).
- Squash and merge: all discussions resolved, no merge commits.

### Release path (mandatory, hotfix exception)

```
feature/fix branch -> PR -> main
main -> changesets opens/updates the "chore: version packages" PR
"chore: version packages" -> release preflight -> publish
```

`main` **only ever receives pull request merges**, and the **only** commit
allowed to publish is the changesets version commit. A push to `main` that is
neither a pending changeset nor `chore: version packages` is refused by the
release preflight, so a release can never happen by accident.

**Hotfix exception** (emergency only): *Run workflow* on the `Release`
workflow with `hotfix = true` and a mandatory `reason`. It publishes the
version currently in `package.json` without the version pull request - but the
quality gates still run (design gate, typecheck, registry authentication).

**Credential**: the `NPM_PUBLISH_TOKEN` secret must be an **npm automation
token** (Read & Write) with write access to the `@flipova` scope. npm answers
`E404 Not Found` on upload when the token is missing, expired, classic, or
belongs to another registry. The preflight authenticates first and explains the
fix instead of failing on a bare `E404`.

`.github/workflows/ci.yml` runs the design gate on every pull request and on
every push to `main` (`design:lint`, `design:check`, `design:verify`,
`design:gen --check`), plus a hard requirement that any change to the published
surface (`design/`, `components/`, `package.json`, entry points) comes with a
changeset. A broken registry, a stale generated file or a change without a
version decision therefore cannot merge.

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
