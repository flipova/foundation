# Changes

## Unreleased

- **Release system, one branch.** The pipeline (`.github/workflows/release.yml`) is now the Corral model (fingerprinted, no
  repository-specific step); what proves foundation fit to ship lives in `package.json`: `ci:verify` (`scripts/ci-verify.js`) and
  `ci:deliver`. The version is the git tag, stamped into the manifest inside the runner. DOCS.md sections 7 and 8 describe
  `corral release plan | run | promote | resume | doctor | migrate | gui`; the branch ladder is retired.

Versions follow SemVer with the channels `alpha → beta → rc → stable` (see [DOCS.md](DOCS.md#8-releasing-with-corral)).

## 3.0.0 (next, breaking)

A new architecture: one UI contract, five providers, themes that belong to the app.

### Added

- **The contract** (`@flipova/foundation/contract`): props and pure recipes for **57 components** (the whole
  gluestack catalogue). A recipe turns a resolved theme into exact style values; every provider applies them.
- **The unified `ui`** (`@flipova/foundation` and `/ui`): `import { Button } from '@flipova/foundation'` renders the
  component of the library chosen in `<FlipovaProvider adapter={…}>`, and falls back to flipova's when that library
  does not have it (or when no provider is mounted).
- **Providers**: `flipova` (all 57, React Native only), `gluestack`, `reusables`, `paper`, `tamagui`; each is an
  optional peer dependency loaded only from its own sub-path.
- **`providers/rn-base`**: the 14 components that are React Native itself, served by every adapter.
- **`COMPONENTS.md`**: generated coverage table, kept honest by `components/alignment.test.ts` (every directory of the
  gluestack catalogue is mapped to a contract name, flipova has all of them, `ui` exports all of them, adapters
  declare only known names).
- **`flipova-design gui`**: a local web editor for the XML registries (colours, scales, themes, roles, preview).
- **`flipova-design adopt`**: copies the registries into the app, which then owns its design system.
- **Boundary check** (`npm run boundary`): layers, optional peers, no `@flipova/*` import, no frontend folder.
- **Public documentation** (`documentation/`, `website/`): 8 documents from the `flipova.assets` public templates, published as a Docusaurus site by the `docs` step of `ci/ci.yml` (built on every pull request, published by `release.yml` after a stable delivery; no second workflow).
- **Docs ↔ code guard** (`npm run docs:check`, in `npm test`): documentation that disagrees with the code fails CI.

### Fixed

- Peer dependencies: `react-native` is now declared (required); `nativewind` and `lucide-react` are optional.
- `package-lock.json` is back in sync with `package.json` (`npm ci` works).
- Documentation named the provider prop `registry`; it is `theme`.

### Changed (breaking)

- Themes are no longer shipped: the package carries only a neutral `light` / `dark` starter. Your themes live in your
  app's `design/` and generate into `theme/`.
- The gluestack catalogue moved from `components/ui/*` to `components/providers/gluestack/ui/*`
  (sub-path `@flipova/foundation/providers/gluestack/ui`).
- `components/ui` is now the unified layer; import components from the root or `/ui`.
- Python tooling and `design/documentation.xml` removed; the toolchain is Node only.

### Migration

1. Run `npx flipova-design adopt`, then `npx flipova-design gen`.
2. Wrap the app: `<FlipovaProvider adapter={…} theme={designTheme}>` (`adopt` writes `theme/provider.tsx`).
3. Replace imports of gluestack components by the unified ones, or by the `/providers/gluestack/ui` sub-path.
4. Install the optional peer of the provider you choose (react-native-paper, @tamagui/core, @rn-primitives/switch…).

### Known limits

- Four gluestack modules (bottomsheet, date-time-picker, image-viewer, slider) cannot be loaded by the test
  environment, so they are served by flipova; others still fall back where no verified wrapper exists yet.
- Parity is checked on resolved style values, not on pixels; nothing is rendered on a device.
- Icon is a text glyph (no SVG); Calendar and DateTimePicker work on dates only (`YYYY-MM-DD`).

## 2.4.4

Last release of the 2.x line (gluestack components + registry-driven theming pipeline).
