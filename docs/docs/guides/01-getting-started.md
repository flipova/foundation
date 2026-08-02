---
title: Quickstart Guide
sidebar_label: 01. Getting Started
slug: /guides/getting-started
---

# Quickstart Guide

Welcome to **Flipova Foundation**. Flipova Foundation is a unified, platform-agnostic design system and UI foundation for building identical experiences across **React Native** (iOS, Android) and **React Web**.

---

## 1. Installation

Flipova Foundation adapts its dependency graph depending on your target environment.

### For React Web Projects (Next.js, Vite, Remix)

The web entry point (`@flipova/foundation/web`) is lightweight and DOM-native, completely bypassing React Native runtime overhead for fast bundling and SSR compatibility.

```bash
npm install @flipova/foundation
```

### For React Native & Expo Projects

For mobile environments, install the package along with its recommended Expo / React Native peer dependencies:

```bash
npm install @flipova/foundation

# Install peer dependencies for Expo
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated expo-linear-gradient expo-haptics @expo/vector-icons lucide-react-native
```

---

## 2. Configuration File (`flipova.config.ts`)

`flipova.config.ts` is the **central configuration file** for your project. It defines your theme preferences, target platforms, custom token paths, and CLI behavior.

### Generating the Configuration File

Run the scaffolding CLI to interactively create `flipova.config.ts` at your project root:

```bash
npx flipova
```

### Structure of `flipova.config.ts`

```ts
import { defineConfig } from '@flipova/foundation/config';

export default defineConfig({
  // Default active theme ('light' | 'dark' | custom theme name)
  defaultTheme: 'dark',
  
  // Custom theme overrides
  themes: {
    dark: {
      primary: '#000091',
    },
  },

  // CLI & Documentation generator options
  docs: {
    outDir: './docs/docs',
  },
});
```

---

## 3. Module Entry Points

Importing from specific entry points ensures tree-shaking and platform compatibility:

| Module Entry Point | Description | Platform |
| :--- | :--- | :--- |
| **`@flipova/foundation`** | Native UI components, interactive controls & layout primitives. | React Native |
| **`@flipova/foundation/web`** | DOM-optimized web implementations of components & primitives. | React Web |
| **`@flipova/foundation/layout`**| Layout hooks (`useBreakpoint`, `useSafeArea`) and responsive utilities. | Native & Web |
| **`@flipova/foundation/tokens`**| Design tokens (spacing, radii, colors, typography scales). | Universal |
| **`@flipova/foundation/theme`** | Theme system, `ThemeProvider` context, and `ColorScheme` utilities. | Universal |
| **`@flipova/foundation/config`**| Configuration engine (`defineConfig`, `FoundationProvider`). | Universal |

---

## 4. Provider Setup & Usage

### React Native Setup (`App.tsx`)

Pass your `flipova.config.ts` directly to `FoundationProvider`:

```tsx
import React from 'react';
import config from './flipova.config';
import { FoundationProvider } from '@flipova/foundation/config';
import { Box, Button, Text } from '@flipova/foundation';

export default function App() {
  return (
    <FoundationProvider config={config}>
      <Box padding="xl" backgroundColor="background">
        <Text variant="heading" size="xl">
          Welcome to Flipova Foundation
        </Text>
        <Button
          label="Get Started"
          variant="primary"
          size="md"
          onPress={() => console.log('Action executed')}
        />
      </Box>
    </FoundationProvider>
  );
}
```

### React Web Setup (`App.tsx`)

```tsx
import React from 'react';
import { ThemeProvider } from '@flipova/foundation/theme';
import { Box, Button } from '@flipova/foundation/web';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Box padding="xl" backgroundColor="background">
        <h1>React Web Experience</h1>
        <Button label="Web Primary Action" variant="primary" />
      </Box>
    </ThemeProvider>
  );
}
```

---

## 5. Next Steps

- [Themes & Tokens Guide](/docs/guides/theming-guide)
- [Architecture & Layout Primitives Guide](/docs/guides/architecture-guide)
- [CLI & Tooling Guide](/docs/guides/cli-guide)
