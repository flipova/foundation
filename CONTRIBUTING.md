# Contributing to @flipova/foundation

## Getting started

```bash
git clone https://github.com/flipova/foundation.git
cd foundation
npm install
```

### Verify the setup

```bash
npm run typecheck   # TypeScript type checking (no emit)
npm run build       # Build with tsup → dist/
```

## Project structure

```
foundation/          Source code (published as @flipova/foundation)
├── tokens/          Static design tokens
├── theme/           Theme system
├── config/          User configuration (defineConfig, FoundationProvider)
└── layout/
     ├── types/       Shared TypeScript types
     ├── registry/    Declarative registries (layouts, components, blocks)
     ├── hooks/       React hooks
     ├── utils/       Pure utility functions
     └── ui/
          ├── primitives/   Level 0-1: Box, Stack, Inline, Center, Scroll, Divider
          ├── [layouts]     Level 2: 23 layout components
          ├── components/   Base UI components (Button, TextInput, etc.)
          └── blocks/       Functional blocks (AuthFormBlock, HeaderBlock, etc.)

studio/              Visual builder (separate package, not published yet)
.kiro/steering/      Kiro steering rules for AI-assisted development
```

## Adding a new layout

1. Create `foundation/layout/ui/MyLayout.tsx`
2. Add the registry entry in `foundation/layout/registry/layouts.ts`
3. Export from `foundation/layout/ui/index.ts`
4. Follow the conventions below

### Layout file structure

```tsx
/**
 * MyLayout
 *
 * One-line description of what this layout does.
 */

import React from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";

const META = getLayoutMeta("MyLayout")!;

export interface MyLayoutProps {
  children: React.ReactNode;
  background?: string;
  // ... other props matching the registry entry
}

const MyLayout: React.FC<MyLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, background } = applyDefaults(rawProps, META, theme) as Required<MyLayoutProps>;

  return (
    <Box flex={1} bg={background}>
      {children}
    </Box>
  );
};

export default MyLayout;
```

### Registry entry structure

```ts
{
  id: "MyLayout",
  label: "My Layout",
  description: "What it does.",
  category: "page",                    // page | content | navigation | card | scroll | special
  themeMapping: { root: "background" },
  slots: [{ name: "children", label: "Content", required: true }],
  responsive: false,
  animated: false,
  tags: ["my", "layout"],
  props: [
    { name: "background", label: "Background", type: "color", group: "style", themeDefault: "background" },
  ],
}
```

## Adding a new component

1. Create `foundation/layout/ui/components/MyComponent.tsx`
2. Add the registry entry in `foundation/layout/registry/components.ts`
3. Export from `foundation/layout/ui/components/index.ts`

Components must support:
- **Variants** (e.g. primary/secondary/outline) defined in the registry
- **Sizes** (e.g. sm/md/lg) defined in the registry
- **Theme colors** via `themeDefault` on color props

## Adding a new block

1. Create `foundation/layout/ui/blocks/MyBlock.tsx`
2. Add the registry entry in `foundation/layout/registry/blocks.ts`
3. Export from `foundation/layout/ui/blocks/index.ts`

Blocks must declare:
- **components**: which base components they use (e.g. `["Button", "TextInput"]`)
- **slots**: named content areas for composition

## Rules

### Primitives only
Layouts, components, and blocks must be built on primitives (Box, Stack, Inline, Center, Scroll).
Do not use raw `<View>`, `<ScrollView>`, or `StyleSheet.create()`.
Exception: `Animated.View` / `Animated.ScrollView` for Reanimated animations.

### Responsive via useBreakpoint()
```ts
const { isMobile, isTablet, isDesktop } = useBreakpoint();
```
Never derive `isMobile` manually from the raw breakpoint value.

### Defaults from registry
All prop defaults must be declared in the registry, not hardcoded in the component.
Use `applyDefaults(rawProps, META, theme)` to resolve them.

### Theme colors via themeDefault
Color props that fall back to a theme color must declare `themeDefault` in the registry:
```ts
{ name: "background", type: "color", themeDefault: "background" }
```

### Constants from registry
Animation constants (spring configs, thresholds, durations) must be declared in the registry `constants` field and consumed via `getConstants(META)`.

### No inline comments
Only the top-level JSDoc describing the component is allowed. No section separators, no inline comments, no JSX comments.

### English only
All code, comments, types, and documentation must be in English.

## Tokens and themes

### Overriding tokens
Users override tokens via `defineConfig()` in their `flipova.config.ts`. The overrides are merged with built-in defaults at startup via `resolveConfig()`.

### Adding a built-in theme
1. Create `foundation/theme/config/definitions/mytheme.theme.ts`
2. Use `createTheme({ ... })` with color overrides
3. Export from `foundation/theme/config/index.ts`
4. Add to the registry in `foundation/theme/providers/ThemeProvider.tsx`

## Build and publish

```bash
npm run typecheck   # Must pass with zero errors
npm run build       # Generates dist/ with CJS, ESM, and .d.ts

npm publish         # Publishes to GitHub Packages
```

## Code review checklist

- [ ] Registry entry added with all props, defaults, themeDefault, themeMapping
- [ ] Component uses `applyDefaults(rawProps, META, theme)`
- [ ] No hardcoded defaults in the component
- [ ] No raw View/ScrollView/StyleSheet usage
- [ ] No inline comments (only top JSDoc)
- [ ] Exported from the appropriate index.ts
- [ ] TypeScript compiles with zero errors
