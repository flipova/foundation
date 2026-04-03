# @flipova/foundation

Design tokens, theming, layout primitives, and UI components for React Native (iOS, Android, Web).

## Install

```bash
npm install @flipova/foundation
```

### Peer dependencies

Install the ones you need:

```bash
npx expo install expo-linear-gradient expo-haptics react-native-gesture-handler react-native-reanimated react-native-safe-area-context lucide-react-native
```

## Quick start

```tsx
import { FoundationProvider, defineConfig } from "@flipova/foundation/config";

const config = defineConfig({
  defaultTheme: "light",
});

export default function App() {
  return (
    <FoundationProvider config={config}>
      <MyApp />
    </FoundationProvider>
  );
}
```

## Custom tokens and themes

Create a `flipova.config.ts` at your project root:

```ts
import { defineConfig } from "@flipova/foundation/config";

export default defineConfig({
  tokens: {
    spacing: { 0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 20, 8: 32 },
    radii: { none: 0, sm: 4, md: 8, lg: 16, xl: 24, full: 9999 },
  },
  themes: {
    brand: {
      colors: {
        primary: "#FF6B00",
        primaryForeground: "#FFFFFF",
        background: "#FAFAFA",
        foreground: "#1A1A2E",
      },
    },
  },
  defaultTheme: "brand",
});
```

## Architecture

```
foundation/
├── tokens/       Static design tokens (spacing, colors, radii, shadows, typography, motion)
├── theme/        Theme system (ColorScheme, ThemeProvider, 9 built-in themes)
├── config/       Configuration (defineConfig, FoundationProvider, token overrides)
└── layout/
     ├── types/       Shared types (LayoutMeta, ComponentMeta, BlockMeta)
     ├── registry/    Declarative registries (layouts, components, blocks)
     ├── hooks/       useBreakpoint, useAdaptiveValue, usePlatformInfo, useSafeArea
     ├── utils/       resolveLayoutPadding, resolveBackground, responsive
     └── ui/
          ├── primitives/   Box, Stack, Inline, Center, Scroll, Divider
          ├── [layouts]     23 layout components
          ├── components/   Button, TextInput
          └── blocks/       AuthFormBlock, HeaderBlock
```

## Modules

| Import path | Content |
|---|---|
| `@flipova/foundation` | Everything |
| `@flipova/foundation/tokens` | Design tokens only |
| `@flipova/foundation/theme` | Theme system only |
| `@flipova/foundation/layout` | Layouts, components, blocks, hooks, registry |
| `@flipova/foundation/config` | defineConfig, FoundationProvider |

## License

MIT
