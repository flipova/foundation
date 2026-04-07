# Contributing to Flipova Foundation & Studio

## Architecture Overview

```
foundation/           # Design system library (published as @flipova/foundation)
├── config/           # defineConfig, FoundationProvider, resolveConfig
├── layout/
│   ├── hooks/        # useBreakpoint, usePlatformInfo, PlatformOverride
│   ├── registry/     # layouts.ts, components.ts, blocks.ts, primitives.ts, defaults.ts
│   ├── types/        # LayoutMeta, ComponentMeta, BlockMeta, shared types
│   ├── ui/
│   │   ├── primitives/  # Box, Stack, Inline, Center, Scroll, Divider
│   │   ├── components/  # Button, TextInput, Badge, Avatar, Image, Video...
│   │   ├── blocks/      # AuthFormBlock, CardBlock, FormBlock, ModalBlock...
│   │   └── *.tsx        # Layout components (RootLayout, AuthLayout, DashboardLayout...)
│   └── utils/        # responsive, platform, spacing resolution
├── theme/            # ThemeProvider, theme definitions (light, dark, neon...)
└── tokens/           # spacing, colors, radii, typography, shadows, motion...

studio/               # Visual app builder
├── app/              # Expo Router app (the studio UI)
│   ├── app/          # Routes (_layout.tsx, index.tsx)
│   └── src/
│       ├── renderer/ # NodeRenderer, componentMap, slotConfig, PlatformSimulator
│       ├── store/    # StudioProvider (state), tokens (resolution)
│       └── ui/       # Topbar, LibraryPanel, LayersPanel, DeviceCanvas,
│                     # PropertiesPanel, DesignPanel, CodePanel, Statusbar,
│                     # shared/SmartInput, modals/...
├── cli/              # npx flipova-studio
├── engine/
│   ├── codegen/      # generator.ts (page→TSX), project.ts (full project)
│   └── tree/         # types.ts (TreeNode, ProjectDocument), operations.ts
└── server/           # Express + WebSocket server, REST API
```

## Adding a New Foundation Component

### 1. Define in Registry

Add to `foundation/layout/registry/components.ts`:

```ts
{
  id: "MyComponent",
  label: "My Component",
  description: "What it does.",
  category: "display",  // input | action | display | feedback | media | navigation
  tags: ["my", "component"],
  themeMapping: { bg: "card", text: "foreground" },
  sizes: ["sm", "md", "lg"],
  variants: [
    { name: "default", label: "Default", overrides: {} },
  ],
  props: [
    { name: "label",       label: "Label",        type: "string",  group: "content",  default: "Hello" },
    { name: "variant",     label: "Variant",      type: "enum",    group: "style",    default: "default", options: ["default"] },
    { name: "size",        label: "Size",         type: "enum",    group: "style",    default: "md", options: ["sm", "md", "lg"] },
    { name: "disabled",    label: "Disabled",     type: "boolean", group: "behavior", default: false },
    { name: "background",  label: "Background",   type: "color",   group: "style",    themeDefault: "card" },
    { name: "borderRadius",label: "Border radius",type: "radius",  group: "style",    default: "md" },
  ],
}
```

**Prop types:** `string`, `number`, `boolean`, `enum`, `color`, `radius`, `shadow`, `spacing`, `padding`, `ratio`, `background`

**Groups:** `content`, `style`, `layout`, `behavior`

### 2. Implement the Component

Create `foundation/layout/ui/components/MyComponent.tsx`:

```tsx
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";

const META = getComponentMeta("MyComponent")!;

export interface MyComponentProps {
  label?: string;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  background?: string;
  borderRadius?: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = (rawProps) => {
  const { theme } = useTheme();
  const { label, size, disabled, background, borderRadius } =
    applyDefaults(rawProps, META, theme) as Required<MyComponentProps>;

  return (
    <Box bg={background || theme.card} borderRadius={borderRadius as any}
      style={disabled ? { opacity: 0.5 } : {}}>
      <Text style={{ color: theme.foreground }}>{label}</Text>
    </Box>
  );
};

export default MyComponent;
```

**Rules:**
- Use primitives only (Box, Stack, Inline, Center, Scroll) — no raw View/ScrollView
- Get defaults from registry via `applyDefaults(rawProps, META, theme)`
- Use `useTheme()` for colors
- Style conditionals: `condition ? {...} : {}` (never `undefined`)
- Cast spacing props: `p={padding as any}` when value comes from registry

### 3. Export from Barrel

Add to `foundation/layout/ui/components/index.ts`:
```ts
export { default as MyComponent } from "./MyComponent";
export type { MyComponentProps } from "./MyComponent";
```

### 4. Map in Studio

Add to `studio/app/src/renderer/componentMap.ts`:
```ts
import MyComponent from '../../../../foundation/layout/ui/components/MyComponent';
// ...
MyComponent: safe(MyComponent),
```

### 5. Build & Test

```bash
npm run build          # Build foundation + studio
npx flipova-studio     # Start studio, component appears in Library > Components
```

## Adding a New Block

Same process but use `foundation/layout/registry/blocks.ts` and `foundation/layout/ui/blocks/`.
Blocks have `slots` and `components` arrays in their registry entry.

## Adding a New Layout

Same process but use `foundation/layout/registry/layouts.ts` and `foundation/layout/ui/`.
Layouts have `slots`, `responsive`, `animated`, `dependencies`, and `constants`.

## SmartInput Linking

All linkable data is available in the SmartInput linker:
- `$` Tokens, `T` Theme, `S` State, `G` Global, `Q` Queries
- `N` Nav, `C` Config, `D` Device, `@` Vars, `#` Nodes

States from `setState` actions in triggers are auto-discovered.

## Code Generation

The codegen in `studio/engine/codegen/` transforms the tree into:
- Page TSX files with imports, hooks, JSX
- Project scaffold (app.json, package.json, tsconfig, eas.json)
- Service clients, query hooks, auth provider, global state
- StyleSheet.create for optimized styles
- Screen groups with route guards
