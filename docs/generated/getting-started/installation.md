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

`npx flipova-design init` creates the project-local `design/` workspace and the
gluestack source tree.

## Wire the theme into your Tailwind config

`tailwind.config.js`, `globals.css` and `postcss.config.js` are app-level files,
so the package does not ship them: create yours and pull the generated theme in.
The whole design system is one generated Tailwind theme, published as
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

```bash
python3 -m venv design/tools/.venv
design/tools/.venv/bin/pip install -r design/tools/requirements.txt   # Linux/macOS
design/tools/.venv/Scripts/python -m pip install -r design/tools/requirements.txt   # Windows
```

## Verify the install

```bash
npx flipova-design lint
```

A clean clone reports zero errors. Continue with **Quick Start**.
