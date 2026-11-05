# @flipova/foundation

[![npm version](https://img.shields.io/npm/v/@flipova/foundation.svg)](https://www.npmjs.com/package/@flipova/foundation)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

UI components for React Native (iOS, Android) and Web, with **one design applied to everything**.
Write `<Button>` once; choose which library renders it (Flipova's own, gluestack, React Native
Reusables, React Native Paper, Tamagui) in one line; the look comes from your own XML themes,
which you edit visually with `npx flipova-design gui`.

## Quick start

```bash
npm install @flipova/foundation
npx flipova-design adopt     # copies the neutral starter themes into your project, writes theme/provider.tsx
npx flipova-design gui       # edit colours, scales and themes visually (or edit design/*.xml by hand)
npm run design:gen           # -> theme/design-theme.ts (+ Tailwind artifacts)
```

```tsx
import { AppThemeProvider } from './theme/provider';
import { Button, Card, Heading, Input, Select, Tabs } from '@flipova/foundation';

export default () => (
  <AppThemeProvider mode="system">
    <Card>
      <Heading>Sign in</Heading>
      <Input placeholder="Email" />
      <Button onPress={signIn}>Continue</Button>
    </Card>
  </AppThemeProvider>
);
```

`theme/provider.tsx` is yours: it names the library and hands your generated theme to the components.

```tsx
<FlipovaProvider adapter={flipova} theme={designTheme} mode={mode}>
```

Switch library by changing `flipova` to `paper`, `tamagui`, `reusables` or `gluestack`
(each imported from `@flipova/foundation/providers/<name>`). Nothing else changes.

## Where things are

```
components/
  theme/          design-theme.ts       generated from your XML: every colour of every theme, every scale
  contract/       what a component is   props (types.ts) + recipes/ (one pure function per component: the exact
                                        colours, radii, spacings, sizes) + theme resolution
  providers/
    provider.tsx  <FlipovaProvider>     mounts one library with one theme
    rn-base/      React Native's own components, shared by every adapter
    flipova/      Flipova's own         all 57 components, built from react-native only, styled only by the recipes
    gluestack/    gluestack-ui         adapter (31 native) + ui/ (the whole gluestack catalogue, as it was)
    reusables/    React Native Reusables  adapter (31 native), NativeWind classes
    paper/        React Native Paper      adapter (31 native)
    tamagui/      Tamagui                 adapter (32 native)
  ui/             the unified components   import { Button } from '@flipova/foundation' (or '/ui')
design/           the XML registries, the schema, and the toolchain (tools/: CLI, generator, checker, GUI)
```

**The unified `ui`** renders, for each component, the one the chosen library offers, with the design
applied. When the library does not have it, the **flipova provider** serves it (and when no provider
is mounted at all, flipova with the bundled neutral theme), so there is never a hole.

The contract is **the whole gluestack catalogue: 57 components**. flipova implements all of them; every other
provider implements natively what its library really has and the tests can verify, and the rest is served by
flipova. The exact table is [`COMPONENTS.md`](COMPONENTS.md) (generated), and `coverageOf(adapter)` tells it in code.

| Provider  | Native | of which the library's own | of which React Native's (shared) | Served by flipova |
| :-------- | -----: | -------------------------: | -------------------------------: | ----------------: |
| flipova   |     57 |                         43 |                               14 |                 0 |
| gluestack |     31 |                         31 |                                0 |                26 |
| reusables |     31 |                         19 |                               12 |                26 |
| paper     |     31 |                         17 |                               14 |                26 |
| tamagui   |     32 |                         20 |                               12 |                25 |

Every adapter is native for more than half of the contract. "React Native's" are the 14 components that are React
Native itself (View, ScrollView, FlatList, SectionList, VirtualizedList, SafeAreaView, KeyboardAvoidingView,
StatusBar, RefreshControl, InputAccessoryView, Image, ImageBackground, Pressable, Box): no library replaces them,
so they live once in `providers/rn-base` and every adapter that does not wrap its own serves that one.

**Alignment check** (`components/alignment.test.ts`, part of `npm test`): every directory of the gluestack catalogue
must be mapped to a contract name (a new one fails until it is), the mapping is one to one with `UI_NAMES`, flipova
has a file for every name, the unified `ui` exports every name, adapters declare only names of the contract, and
`COMPONENTS.md` is up to date (`npm run components:doc` rewrites it).

Honest limits: four gluestack modules (bottomsheet, date-time-picker, image-viewer, slider) cannot be loaded by
the test environment (native-only or missing dependencies), so no gluestack wrapper is declared for them. The
animation libraries gluestack's overlays use (react-native-reanimated, @legendapp/motion) are replaced in tests by
stand-ins in `test-support/` (plain views, no animation): what is verified is the gluestack component and its
wrapper, not the animation. Components gluestack has but that still fall back (Accordion, Menu, Popover, Select,
Tabs, Toast, Tooltip...) are listed with the reason in COMPONENTS.md; adding a wrapper is: write it in the adapter,
add it to its `components`, `npm run components:doc`.

Props are the same on every provider (`components/contract/types.ts`). Icons are text glyphs (no SVG
dependency), Calendar and DateTimePicker work on dates only (`YYYY-MM-DD`), and `Portal` content is drawn by the
flipova provider's host.

To go straight to one library's own components, import from its sub-path
(`@flipova/foundation/providers/paper`, `.../providers/gluestack/ui` for the whole gluestack catalogue, ...).
Only that sub-path imports the library, which is an **optional peer dependency**: the root, `/ui`,
`/contract`, `/providers` and `/providers/flipova` need nothing but `react` and `react-native`.

| Sub-path                                  | Library                | Optional peer           |
| :---------------------------------------- | :--------------------- | :---------------------- |
| `@flipova/foundation` , `/ui`             | the unified components | none                    |
| `@flipova/foundation/providers/flipova`   | Flipova's own          | none                    |
| `@flipova/foundation/providers/gluestack` | gluestack-ui           | `nativewind`            |
| `@flipova/foundation/providers/reusables` | React Native Reusables | `@rn-primitives/switch` |
| `@flipova/foundation/providers/paper`     | React Native Paper     | `react-native-paper`    |
| `@flipova/foundation/providers/tamagui`   | Tamagui                | `@tamagui/core`         |

## The design is yours

The package ships **no brand and no theme names**: only a neutral starter (`light` and `dark`).
`adopt` copies it into `design/` and from then on the registries are your source of truth. The
components read colour **roles** (`primary`, `card`, `border`, `success`, ...), never theme ids, so
rename, add and recolour themes freely; a light/dark pair shares a `variant`
(`<FlipovaProvider variant="brand">`). A theme must define the roles the components read
(`REQUIRED_ROLES`); the GUI, `flipova-design check` on save, and the provider all name any that are missing.

- **Tokens** (`design/tokens.xml`): colour palettes, spacing, radii, type sizes and weights, shadows, opacity, motion.
- **Themes** (`design/themes.xml`): each theme maps roles to palette colours (`$ref.tokens.color.primary.600`) or to a literal colour.

### `npx flipova-design gui`

A local editor (nothing leaves your machine; it listens on 127.0.0.1 with a one-time token):

- **Preview**: every component, drawn from the real recipes, in the theme you pick, updated as you edit.
- **Colours**: edit any shade; build a whole palette from one colour; add or remove colours.
- **Scales**: spacing, radii, font sizes, weights, line heights, opacity, durations, z-index, breakpoints.
- **Themes**: add (copy), rename, change mode/variant, delete; map every role to a colour with a picker.
- Edits live in a working copy. **Save** validates first (determinism rules, XSD, required roles), then writes
  your XML, the canonical index and the generated files. **Revert** drops the working copy.
- The preview needs the built package (`dist/`); the published package has it.

Edits are made in the text of the XML (comments and layout are kept), so the diff is what a careful hand edit would give.

## The XML toolchain

Plain Node (>= 18, no dependency, no Python): `npx flipova-design <command>`.

| Command                                | What it does                                                                                        |
| :------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `init`                                 | inject app-level wiring (Tailwind/PostCSS/CSS files, `design:*` scripts); never overwrites          |
| `adopt`                                | copy the registries into the project, rewrite the outputs into `theme/`, write `theme/provider.tsx` |
| `gui [--port N] [--no-open]`           | the visual editor (adopts first if the project has not)                                             |
| `gen [--check]`                        | compile the registries into `design-theme.ts`, `config.ts`, `tokens.js`                             |
| `check`, `verify`, `canonical`, `lint` | determinism rules, canonical index, XSD                                                             |
| `pipeline`                             | gen, check, verify, lint                                                                            |
| `where`                                | print the resolved paths                                                                            |

`design/schema.xsd` is validated by a built-in validator for the subset of XML Schema the registries use;
a schema that uses anything else is refused when loaded rather than half-checked. Never hand-edit the
generated files; and `tailwind.config.js` holds no design value: it only wires `theme/tokens`.

```js
// tailwind.config.js (only needed for the gluestack / reusables providers, which use NativeWind classes)
const tokens = require('./theme/tokens');
module.exports = { presets: [require('nativewind/preset')], theme: { extend: tokens.theme } };
```

The flipova, Paper and Tamagui providers read `theme/design-theme.ts` directly; the gluestack and reusables
providers build their CSS variables at runtime from the same theme you pass to `<FlipovaProvider>`.

## How "identical" is tested

Parity is on the resolved style values, not on pixels. `npm test` runs the toolchain tests (including a real
adopt, a real GUI server driven over HTTP, and the XML edits), the boundary check, and the component tests:
Reusables classes resolved back to numbers and colours and compared with the recipes; the props handed to
Paper; the Tamagui configuration; every recipe on every theme (no undefined or NaN value); the 57 flipova
components rendered through react-native-web (interaction, accessibility attributes, the app's own theme
applied, no colour literal in their source); the six shared components of the four libraries rendered in
light and dark; and the natives each library gained rendered through its adapter. Not covered: rendering on a device, and the internals Paper imposes on its own Button and
Switch (ripple, switch geometry): what is guaranteed there is what is passed to them.

## Boundary with the frontend

Foundation is the bottom of the stack: primitives and the design. Layouts, sections, auth screens, mockups
and effects live in the frontend package, and foundation depends on no other `@flipova/*` package.
`npm run boundary` (run by `npm test` and CI) reads the imports and fails on: another `@flipova/*` import; a
frontend folder under `components/`; a layer importing one above it (`theme` < `contract` < `providers` <
`ui`, where `ui` reaches only the flipova provider); a provider importing another; an optional peer imported
outside its own provider; the flipova provider importing anything but `react` and `react-native`.

## Migrating from 2.x

- `@flipova/foundation` and `/ui` now export the **unified** components (`Button`, `Card`, ...). The gluestack
  catalogue (`Box`, `VStack`, `Accordion`, ...) moved to `@flipova/foundation/providers/gluestack/ui`.
- `createGluestackUIProvider` and `GluestackUIProvider` are there too; `<FlipovaProvider adapter={gluestack}>`
  replaces them for new code.
- The package no longer ships the `spring` theme; add your own with the GUI.
- `@flipova/foundation/tokens` is unchanged.

## Documentation

- [DOCS.md](DOCS.md): the maintainer guide (setup, architecture, tests, releasing, conformity).
- [COMPONENTS.md](COMPONENTS.md): the generated coverage table of the five providers.
- Public documentation: `documentation/v1.0/` (French, written from the public templates of `flipova.assets` with
  `corral docs`) published as a Docusaurus site from `website/` (`corral docs docusaurus --repo foundation`).
- `npm run docs:check` keeps all of the above consistent with the code (see [DOCS.md](DOCS.md#11-public-documentation)).

## License

MIT © Flipova. Participation is governed by
[the Code of Conduct](.github/CODE_OF_CONDUCT.md).
