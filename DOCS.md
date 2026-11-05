# @flipova/foundation — documentation

Foundation is the bottom layer of the Flipova stack: a provider-agnostic UI contract, five providers, and the
toolchain that turns your XML design registries into theme files. No layout, no frontend, no account logic lives here.

1. [What it is](#1-what-it-is)
2. [Install and first setup](#2-install-and-first-setup)
3. [Using the components](#3-using-the-components)
4. [Theming: the registries and the GUI](#4-theming-the-registries-and-the-gui)
5. [Providers and coverage](#5-providers-and-coverage)
6. [Architecture and rules](#6-architecture-and-rules)
7. [Working on foundation: tests and CI](#7-working-on-foundation-tests-and-ci)
8. [Releasing with Corral](#8-releasing-with-corral)
9. [Conformity with Corral](#9-conformity-with-corral)
10. [Troubleshooting](#10-troubleshooting)
11. [Public documentation](#11-public-documentation)

## 1. What it is

| Piece        | Where                    | What it is                                                                                                        |
| ------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Contract     | `components/contract`    | Props of 57 components and one pure **recipe** per visual component: theme in, exact style values out.            |
| Providers    | `components/providers/*` | Adapters that hand the recipes' values to a library: `flipova`, `gluestack`, `reusables`, `paper`, `tamagui`.     |
| Unified `ui` | `components/ui`          | `import { Button } from '@flipova/foundation'`: renders the chosen provider's component, falls back to flipova's. |
| Theme        | `components/theme`       | Generated from **your** XML registries (`design/`). The package ships only a neutral starter.                     |
| Toolchain    | `design/tools`           | `flipova-design`: adopt, gen, check, verify, lint, pipeline, gui. Node only, no dependency.                       |

Design rule: the recipes are the single source of the design. Providers never invent a value; parity between providers
is tested on **resolved values** (colours, radii, spacings, sizes), not on pixels.

## 2. Install and first setup

```bash
npm install @flipova/foundation react react-native
# plus the optional peer of the provider you choose, e.g.:
npm install react-native-paper            # or @tamagui/core, or @rn-primitives/switch
```

```bash
npx flipova-design adopt     # copies the registries into ./design: from now on the app owns its design system
npx flipova-design gen       # compiles tokens + themes -> theme/design-theme.ts, config.ts, tokens.js
```

`adopt` also writes `theme/provider.tsx`. Mount it once at the root of the app:

```tsx
import { AppThemeProvider } from './theme/provider';

export default function App() {
  return <AppThemeProvider mode="system">{/* your app */}</AppThemeProvider>;
}
```

## 3. Using the components

```tsx
import { Button, Card, Heading, Text, VStack } from '@flipova/foundation';

<Card>
  <VStack space="4">
    <Heading level={2}>Welcome</Heading>
    <Text>Same props whatever the provider.</Text>
    <Button onPress={save}>Save</Button>
  </VStack>
</Card>;
```

- Choose the library in the provider: `<FlipovaProvider adapter={paper} theme={designTheme}>`.
  Adapters are imported from their own sub-path (`@flipova/foundation/providers/paper`…): only that sub-path imports
  the library.
- A component the library does not have is served by flipova, so there is never a hole. `coverageOf(adapter)` tells
  which are native; [COMPONENTS.md](COMPONENTS.md) is the full table.
- Straight to one library: import from the provider sub-path
  (`@flipova/foundation/providers/gluestack/ui` is the whole gluestack catalogue).
- Props are the same everywhere (`components/contract/types.ts`). `space` is a step of the spacing scale (`"4"` = 16).
- Icon is a text glyph; Calendar and DateTimePicker work on `YYYY-MM-DD` strings; `Portal` content is drawn by the
  flipova provider's host.

## 4. Theming: the registries and the GUI

Your design lives in four XML files in `design/` (`tokens.xml`, `themes.xml`, `manifest.xml`, `schema.xsd`). The package
imposes no theme. A theme must define the 27 required colour roles (`REQUIRED_ROLES`); a missing role is refused, naming it.

| Command                                         | Does                                                                  |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| `npx flipova-design adopt`                      | Copy the registries into the app.                                     |
| `npx flipova-design gui [--port N] [--no-open]` | Local web editor (see below).                                         |
| `npx flipova-design gen [--check\|--list]`      | Compile registries → `theme/` files; `--check` fails if they drifted. |
| `npx flipova-design check [--list-rules]`       | Determinism rules + XSD.                                              |
| `npx flipova-design verify`                     | The committed canonical index matches the registries.                 |
| `npx flipova-design lint`                       | XSD-validate every registry file.                                     |
| `npx flipova-design pipeline`                   | gen, check, verify, lint.                                             |
| `npx flipova-design where`                      | Print the resolved paths (diagnostics).                               |

**The GUI** (`gui`) serves a page on `127.0.0.1` with a token in the URL; nothing leaves the machine. Tabs: Preview
(components rendered with the theme, light/dark), Colours (palettes, shade generator), Scales (spacing, radii, font
sizes…), Themes (roles per theme, add/remove), Messages. Edits stay in a working copy until **Save**; **Validate** runs the
same checks as CI on a temporary copy; **Revert** drops the working copy. Save validates first, then writes the registries
and regenerates `theme/`. The Preview currently shows the 20 core components.

## 5. Providers and coverage

| Provider  | Native | of which the library's own | of which React Native's | Served by flipova |
| --------- | -----: | -------------------------: | ----------------------: | ----------------: |
| flipova   |     57 |                         43 |                      14 |                 0 |
| gluestack |     31 |                         31 |                       0 |                26 |
| reusables |     31 |                         19 |                      12 |                26 |
| paper     |     31 |                         17 |                      14 |                26 |
| tamagui   |     32 |                         20 |                      12 |                25 |

Regenerate the table after touching an adapter: `npm run components:doc`. The test `components/alignment.test.ts`
fails when the table, the catalogue, the contract, flipova or the unified `ui` disagree.

## 6. Architecture and rules

```
components/
  theme/       generated from the registries
  contract/    types.ts + recipes/ (pure functions)
  providers/   provider.tsx, rn-base/, flipova/, gluestack/, reusables/, paper/, tamagui/
  ui/          the unified components
design/        registries (XML), schema, toolchain (tools/)
```

`npm run boundary` enforces: layers `theme < contract < providers-core < provider/<lib>`; the unified `ui` imports only
core, flipova, contract and theme; a provider never imports another provider nor `ui`; the flipova provider imports only
`react` and `react-native` (and has no colour literal); optional peers are imported only in their own provider; no
`@flipova/*` import and no frontend folder name under `components/`.

Adding a component: types + recipe in `contract`, implementation in `providers/flipova/components/<Name>.tsx`,
`createUi('<Name>')` in `ui/index.ts`, mapping in `alignment.test.ts` if it comes from the gluestack catalogue, then
`npm run components:doc`.

## 7. Working on foundation: tests and CI

```bash
npm install --no-package-lock --ignore-scripts
npm run typecheck && npm run lint && npm run format:check
npm run build
npm test            # design toolchain, boundary, components (vitest, react-native-web)
```

`npm test` = `design:test` + `boundary:test` + `boundary` + `docs:test` + `docs:check` + `vitest run`.

The pipeline (`.github/workflows/release.yml`) is the **Corral model**: the same file in every repository, with no logic of
its own, stamped with a fingerprint on its first line (`# corral-pipeline v2 kind:node sha256:…`). It also checks itself: an `integrity` job fails any pull request that edited it (Dependabot included), `corral release doctor --fix` regenerates it. Jobs: `integrity`, `verify` (node 20 and 22:
`npm ci`, then `npm run ci:verify`), `security` (CodeQL), `deliver` (release tags only), `summary`. Everything specific to
foundation lives in `package.json`, not in the YAML:

- `ci:verify` = `node scripts/ci-verify.js` (lint, format, types, build, tests, design registry up to date, design pipeline,
  `npm pack --dry-run`; every step runs, the exit code says if any failed). Add a check there.
- `ci:deliver` = `npm run deploy --` (npm trusted publishing with provenance; receives `--tag <channel>`).

A change is verified **once**, on its pull request; only a release tag starts a run on push. Do not edit the YAML by hand:
`corral release doctor` compares it with the model and `corral release doctor --fix --merge` rewrites it.
(Dependabot's `github-actions` ecosystem edits this file too: that counts as drift. Bump the actions in Corral's model instead.)

Test environment notes: `react-native` is aliased to `react-native-web`; stand-ins in `test-support/` replace modules that
cannot load there (nativewind, react-native-svg, safe-area-context, react-native-reanimated, @legendapp/motion). Animation
is therefore not verified.

## 8. Releasing with Corral

**One branch.** `main` is the only long-lived branch. A version is a **tag** (`@flipova/foundation@X.Y.Z`); `alpha`, `beta`,
`rc` and stable are tags on the **same commit**, published under the npm dist-tags `alpha`, `beta`, `rc` and `latest`.
Promoting is a new tag: no branch, no pull request, nothing that can diverge. The version lives in the tag only: the
pipeline stamps it into `package.json` inside the runner (nothing is committed), so the manifest is never edited by hand and
can never disagree with the tag.

```bash
corral release status --repo foundation                        # version, last run, pipeline file, workflow, leftover branches
corral release plan --repo foundation --bump minor --stage alpha    # every check, nothing touched
corral release run  --repo foundation --bump minor --stage alpha    # tag -> pipeline -> npm -> GitHub release
corral release promote --repo foundation                       # next rung (beta, rc, stable) on the SAME commit
corral release rollback --to @flipova/foundation@2.4.4 --repo foundation --dry-run   # return to an earlier STABLE version: its content is republished as the next patch (nothing is deleted)
corral release resume  --repo foundation                       # finish after a failure or an approval
corral release gui                                             # the same, with graphs, in the browser
```

Before tagging, the plan checks — and refuses if one is red: the pipeline file **at the commit to tag** is the model (a tag runs
the file of the commit it points to, so a fix made afterwards cannot help it), the workflow is enabled, `package.json` has
`ci:verify` and `ci:deliver`, the tag and the npm version are free, and the ladder is respected (the previous rung was
delivered). Corral creates the **tag** only; the pipeline creates the GitHub release once npm has the package, so a release
can no longer exist without a delivery. A failure is reported with its job and step and finished with `corral release resume`
(each step is read back from GitHub and npm: nothing is re-tagged).

Getting work onto `main`: `corral script run ship --set repo=foundation --set message="feat: …"` moves the uncommitted changes
to a work branch, pushes it, opens the PR to `main` and merges it when CI is green. Hotfix: the same, then
`corral release run --repo foundation --bump patch --stage stable --skip-ladder`.

Moving from the old ladder (once): `corral release doctor --fix --merge --repo foundation` (the model), then
`corral release migrate foundation` (dry-run: which of `dev`, `alpha`, `beta`, `rc` are fully contained in `main`) and
`corral release migrate foundation --confirm foundation`. The npm trusted publisher is bound to the workflow **file name**
(`release.yml`): do not rename it (`npm trust github flipova/foundation --file release.yml --allow-publish`).
`corral promote`, `corral align` and the `promote-next` / `foundation-release` scripts are deprecated and will be removed.

## 9. Conformity with Corral

Read-only first, then repair what needs a decision.

```bash
corral doctor --repo foundation                 # anomalies: unpushed, diverged, missing LICENSE/README/ENVIRONMENT.md/pipeline
corral conform --repo foundation --dry-run      # exactly what would change (settings, branches, labels, rulesets, …)
corral product check --repo foundation          # corral.product.json: valid, no secret, no e-mail
corral workflows sync --repo foundation --dry-run   # templates vs the repository's pipeline (never overwrites without --force)
corral rulesets list --repo foundation          # branch + tag protection
corral dependabot state --repo foundation       # dependabot.yml present, security fixes on
corral security status --repo foundation        # Dependabot, secret scanning, push protection, CodeQL
corral security alerts --repo foundation
corral sbom --repo foundation                   # CycloneDX from package-lock.json -> <workspace>/sbom/
corral licenses --repo foundation               # dependency licences vs the deny / review policy
corral vault check                               # secrets hygiene (foundation needs none: no .env in the repo)
corral report --repo foundation --out REPORT.md # full read-only overview
corral audit pack --repo foundation             # audit evidence pack
```

Apply (writes to the forge — read the dry run first): `corral conform --repo foundation`,
`corral doctor --repo foundation --fix`, `corral rulesets apply --repo foundation`, `corral dependabot on --repo foundation`,
`corral product generate --repo foundation` (hand-written fields of `corral.product.json` are preserved).

Files `ENVIRONMENT.md` and `corral.product.json` are generated by Corral and are in `.prettierignore`.

## 10. Troubleshooting

| Symptom                                                          | Cause / fix                                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `design:gen:check` fails in CI                                   | A generated file drifted from the registries: `npm run design:gen` and commit.                               |
| `alignment.test.ts` fails on `COMPONENTS.md`                     | `npm run components:doc` and commit.                                                                         |
| `alignment.test.ts`: unmapped directory                          | A new gluestack catalogue directory: map it in `CATALOGUE_MAP` and add the contract component.               |
| `boundary` fails                                                 | The message names the file and the rule (layer, optional peer, forbidden folder).                            |
| `resolveTheme` throws "missing role"                             | Your theme lacks one of the 27 required roles: add it in the GUI (Themes) or in `themes.xml`.                |
| Tamagui refuses a token name                                     | `true`, `none`… are reserved: the adapter renames `none` to `zero` (`TAMAGUI_RENAMES`).                      |
| `ENEEDAUTH` on delivery                                          | No npm trusted publisher declared: `npm trust github flipova/foundation --file release.yml --allow-publish`. |
| `format:check` fails on `ENVIRONMENT.md` / `corral.product.json` | They are generated by Corral and listed in `.prettierignore`.                                                |

## 11. Public documentation

The public documentation (French source, in `documentation/v1.0/`) is written from the public templates of
`flipova.assets` (27 overview, 28 getting started, 29 how-to guides, 30 concepts, 31 reference, 32 troubleshooting and
FAQ, 33 contributing, 34 release notes) with `corral docs`, and published as a Docusaurus site (`website/`).

```bash
corral docs create foundation --version v1.0 --template 28 --ref FLP-GST-001 --title "…" --owner Flipova   # a new document
corral docs fields foundation --version v1.0                  # fill-in zones still open
corral docs test foundation --version v1.0                    # markers valid
corral docs docusaurus --repo foundation --version v1.0 --site-url https://flipova.github.io --base-url /foundation/
corral docs docusaurus --repo foundation --version v1.0 --check   # the site is up to date with the documents
corral docs translate --repo foundation --lang en --env dev   # English version (DeepL key from the vault)
cd website && npm install && npm run build                    # local build
```

A document that still contains a `[?…]` zone is not published. `website/postcss.config.js` is empty on purpose: it keeps
Docusaurus from loading the library's own PostCSS (tailwind) configuration from the parent folder. Publication runs
from `.github/workflows/docs.yml` on `main` (Settings → Pages → Source: GitHub Actions, once).

**Docs ↔ code guard.** `npm run docs:check` (part of `npm test`) reads `README.md`, `DOCS.md` and `documentation/` and
fails when they disagree with the code: an attribute that `<FlipovaProvider>` does not have, a `flipova-design` command
or `npm run` script that does not exist, a `@flipova/foundation/…` path that `exports` does not declare, a name the root
does not export, a wrong component or role count, a broken relative link, or a `[?…]` zone left in `documentation/`.
The reference document must also list every provider prop, CLI command and package export. `npm run docs:test` tests
the guard itself.
