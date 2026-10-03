# @flipova/foundation

[![npm version](https://img.shields.io/npm/v/@flipova/foundation.svg)](https://www.npmjs.com/package/@flipova/foundation)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

gluestack-ui components for React Native (iOS, Android) and Web, plus a
registry-driven theming pipeline.

## Design pipeline

The design pipeline has a single function:

> **`design/tokens.xml` + `design/themes.xml`**
> * -> `components/ui/gluestack-ui-provider/config.ts` (gluestack / nativewind colour vars)
> * -> `components/ui/gluestack-ui-provider/tokens.js` (Tailwind/nativewind token theme)

Role ids in `themes.xml` are the gluestack CSS variable names (dash-prefixed at
generation time), so the design registry and the runtime theme config always
speak the same language. Every colour is emitted as a space-separated RGB
triplet, enabling Tailwind opacity modifiers such as `bg-primary/50`.

The scale tokens (spacing, radii, breakpoints, typography, shadow, z-index,
opacity, motion) are emitted as a Tailwind `theme` fragment, and the semantic
colours are derived from the `themes.xml` roles. `tailwind.config.js` contains
**no design value**: it just does `extend: tokens.theme`. The XML registries are
therefore the single source of truth for both the gluestack runtime vars and
the Tailwind/nativewind theme.

```bash
npm run design:pipeline   # gen + check + verify + lint + doc
```

| Script | What it does |
| :--- | :--- |
| `npm run design:gen` | compile tokens/themes into `config.ts` + `tokens.js` |
| `npm run design:gen:check` | verify regeneration is a no-op (drift check) |
| `npm run design:check` | determinism rules + XSD pass + ruff |
| `npm run design:verify` | verify the committed canonical index |
| `npm run design:canonical` | re-emit `design/canonical.index.txt` |
| `npm run design:lint` | XSD-validate every design XML |
| `npm run design:doc` | regenerate the docs site (`docs/generated`) |
| `npm run design:edit` | open the XSD-driven XML editor |

Never hand-edit the generated `config.ts`, `tokens.js` or `docs/generated/**` -
the next run overwrites them. And never add a design value to
`tailwind.config.js`: it only wires the generated theme.

## Install

```bash
npm install @flipova/foundation
npm install gluestack-ui
npx flipova-design init
```

`init` **does not copy the registries into your project**. The XML registries and
the whole toolchain stay in `node_modules/@flipova/foundation/design`, and the
command only injects the app-level wiring that the package cannot own:

- `tailwind.config.js`, `postcss.config.js`, `globals.css` - created only when
  missing (never overwritten unless `--force`);
- the `design:*` npm scripts in your `package.json` (`design:gen`, `design:lint`,
  `design:check`, `design:verify`, `design:canonical`, `design:doc`,
  `design:pipeline`).

| Command | What it does |
| :--- | :--- |
| `npx flipova-design where` | print the resolved registries/artifacts paths |
| `npx flipova-design inject` | re-run the injection only |
| `npx flipova-design gen [--check]` | compile the registries into `config.ts` + `tokens.js` |
| `npx flipova-design lint` | XSD-validate the registries |

`gen` writes into the resolved output root, i.e. straight into the installed
package (`node_modules/@flipova/foundation/components/ui/gluestack-ui-provider`),
so the artifacts consumed by `@flipova/foundation/tokens` and
`@flipova/foundation/ui` are always the ones the pipeline produced. Add your own
`design/manifest.xml` in the project only when you deliberately want to fork the
registries: it then takes over as the source and the outputs land in the project.

The generated theme is wired into your Tailwind config (app-level files are not
shipped by the package):

```js
// tailwind.config.js
const tokens = require('@flipova/foundation/tokens');
module.exports = {
  presets: [require('nativewind/preset')],
  theme: { extend: tokens.theme },
};
```

and the provider is mounted once at the root:

```tsx
import { GluestackUIProvider } from '@flipova/foundation/ui';
// <GluestackUIProvider mode="system"> ... </GluestackUIProvider>
```

The design tooling needs Python 3.8+ with `lxml` (`design/tools/requirements.txt`).
Resolution order: `$FOUNDATION_PYTHON`, then `$FOUNDATION_VENV`, then
`design/tools/.venv`, then any `python3`/`python` on `PATH` that can import
`lxml`.

## Documentation

The full guide (installation, theming, tokens, the gluestack config, tools,
contributing) is generated from `design/documentation.xml` into the Docusaurus
site under `docs/`:

```bash
cd docs && npm start
```

## License

MIT © Flipova. Participation is governed by
[the Code of Conduct](CODE_OF_CONDUCT.md).
