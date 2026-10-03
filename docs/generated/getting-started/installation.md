# Installation

Flipova Foundation ships an editable gluestack-ui component source plus **two
generated design artifacts**, both compiled from the design registries
(`design/tokens.xml` + `design/themes.xml`) and never edited by hand:

- `components/ui/gluestack-ui-provider/config.ts` - the gluestack/nativewind
  colour variables, for the light and dark modes;
- `components/ui/gluestack-ui-provider/tokens.js` - the whole Tailwind theme.

## Requirements

- **Python 3.8+** for the design tooling.
- **`lxml`** (and, for `design:check`, **`ruff`**) - the only third-party
  dependencies, pinned in `design/tools/requirements.txt`.
- Your own Node/TypeScript tooling to consume the gluestack components.

## Install and initialize

```bash
npm install @flipova/foundation
npm install gluestack-ui
npx flipova-design init
```

The registries are **not** copied into your project. They live in the installed
package (`node_modules/@flipova/foundation/design`) together with the whole
toolchain, and the CLI drives them from there. `init` only injects what a package
cannot own:

- `tailwind.config.js`, `postcss.config.js` and `globals.css`, created only when
  missing (an existing file is never overwritten unless you pass `--force`);
- the `design:*` npm scripts in your `package.json`, so the pipeline is
  reachable as `npm run design:gen`, `design:lint`, `design:check`, ... ;
- a short recap of what to do next.

Use `npx flipova-design where` at any time to print the resolved paths, and
`npx flipova-design inject` to re-run only the injection.

If you deliberately want to fork the registries, create your own
`design/manifest.xml`: it then becomes the source of truth for that project and
the generated artifacts land in the project instead of in `node_modules`.

## Wire the theme into your Tailwind config

`tailwind.config.js`, `globals.css` and `postcss.config.js` are app-level files,
so the package does not ship them: `init` injects them, and the whole design
system is one generated Tailwind theme, published as
`@flipova/foundation/tokens`.

```js
// tailwind.config.js
const tokens = require('@flipova/foundation/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{tsx,ts,jsx,js}'],
  presets: [require('nativewind/preset')],
  important: 'html',
  theme: { extend: tokens.theme },
};
```

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```js
// postcss.config.js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

Every registry value is then available as an utility: `bg-primary/50`, `p-4`,
`rounded-md`, `text-2xs`, `shadow-hard-1`, `z-modal`, `ease-standard`, and the
`xs:`/`md:`/`lg:`/`2xl:` breakpoints.

Mount the provider once at the root so the colour variables actually exist:

```tsx
import { GluestackUIProvider } from '@flipova/foundation/ui';

export default function App() {
  return <GluestackUIProvider mode="system">{/* ... */}</GluestackUIProvider>;
}
```

### Font variables

Some `family` entries delegate to *your* app fonts through CSS variables. Define
them once (or through your font loader):

```css
:root {
  --font-sans: Inter, system-ui, sans-serif;
  --font-heading: Inter, system-ui, sans-serif;
}
```

If one is missing, `font-family: var(--font-sans)` is invalid and the text falls
back to the inherited font - it does not break, but it is not what you expect.
`font-system`, `font-mono` and `font-serif` are self-contained stacks that need
no variable.

## Optional virtual environment

A `python3` (or `python`) that can import `lxml` is enough; the tooling probes
`PATH` for one. To pin the dependencies instead, create a venv anywhere and point
`FOUNDATION_VENV` at it:

```bash
python3 -m venv design/tools/.venv
design/tools/.venv/bin/pip install -r node_modules/@flipova/foundation/design/tools/requirements.txt   # Linux/macOS
design/tools/.venv/Scripts/python -m pip install -r node_modules/@flipova/foundation/design/tools/requirements.txt   # Windows
```

Resolution order: `$FOUNDATION_PYTHON`, then `$FOUNDATION_VENV`, then
`design/tools/.venv`, then the first `python3`/`python` on `PATH` able to import
`lxml`.

## Verify the install

```bash
npx flipova-design lint
```

A clean install reports zero errors. Continue with **Quick Start**.
