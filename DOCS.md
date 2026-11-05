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

`npm test` = `design:test` + `boundary:test` + `boundary` + `vitest run`. The pipeline (`.github/workflows/release.yml`):
`ladder` (who may feed whom), `quality` (node 20 and 22: lint, format, types, build, boundary, tests, registry up to date;
from alpha: full design pipeline, `npm pack --dry-run`), `security` (CodeQL), `deliver` (release tags only), `summary`.
A change is verified **once**, on its pull request; only a release tag starts a run on push.

Test environment notes: `react-native` is aliased to `react-native-web`; stand-ins in `test-support/` replace modules that
cannot load there (nativewind, react-native-svg, safe-area-context, react-native-reanimated, @legendapp/motion). Animation
is therefore not verified.

## 8. Releasing with Corral

Ladder: `work branch → dev → alpha → beta → rc → main → tag @flipova/foundation@X.Y.Z`; each channel only accepts the
previous one (hotfix/* may target anywhere). The tag triggers `deliver`: tag matches `package.json`, build, `npm run deploy`
(npm trusted publishing with provenance, dist-tag from the version's stage), GitHub release (pre-release for alpha/beta/rc).

**First rung: get the work onto `dev`.** `corral promote` only walks `dev → alpha → beta → rc → main` and works on what is
already on `dev` (it opens its PRs on the forge), so local changes must be committed, pushed and merged first:

```bash
corral conform --repo foundation                      # once: creates dev/alpha/beta/rc and the protections
corral script run foundation-ship                     # work branch → commit → push → PR to dev → merge when CI is green
# the same by hand:
corral checkout feat/foundation-3.0 --repo foundation
corral commit --repo foundation -m "feat!: …"
corral push --repo foundation
corral prs open --repo foundation --merge             # PR work branch → dev, waits for green CI, merges (squash)
```

Then the ladder itself (`corral script run foundation-release …`, or by hand):

```bash
corral version state --repo foundation            # current version, stage, tag
corral version next major --repo foundation       # compute the next version (read-only): 3.0.0
corral promote 3.0.0-alpha.1 --repo foundation --dry-run   # what it would do
corral promote 3.0.0-alpha.1 --repo foundation --merge     # alpha: opens the PRs, merges when CI is green
corral promote 3.0.0-beta.1  --repo foundation --merge
corral promote 3.0.0-rc.1    --repo foundation --merge
corral promote 3.0.0         --repo foundation --merge     # main + tag -> delivery
corral releases --repo foundation                 # latest release / tag
corral version sync --repo foundation             # tags never published to npm ("ghost tags")
```

Before the first alpha of 3.0.0: update this file and `CHANGES.md`, and run the toolchain gates locally
(`npm run typecheck && npm run lint && npm test && npm run design:pipeline && npm pack --dry-run`).
The npm trusted publisher is bound to the workflow **file name** (`release.yml`): do not rename it
(`npm trust github flipova/foundation --file release.yml --allow-publish`).

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
