# @flipova/foundation

[![npm version](https://img.shields.io/npm/v/@flipova/foundation.svg)](https://www.npmjs.com/package/@flipova/foundation)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A unified, platform-agnostic design system and UI foundation for building identical experiences across **React Native** (iOS, Android) and **React Web**. 

Flipova Foundation provides design tokens, a declarative theming engine, layout primitives, and beautifully crafted UI components from a single shared codebase. By abstracting the platform dependencies, Flipova ensures that web and mobile projects can seamlessly share 100% of their UI layer.

---

## Features

- **Write Once, Run Anywhere**: Isomorphic components that map to native primitives on mobile (`View`, `Text`, `ScrollView`) and highly-optimized HTML semantics on the web.
- **Zero-Config Web Support**: The web entry point (`@flipova/foundation/web`) is completely free of heavy native dependencies, enabling rapid bundling for SSR and SSG environments like Next.js and Vite.
- **Declarative Layouts**: Build complex UI using intuitive layout primitives (`Box`, `Stack`, `Inline`, `Center`).
- **Dynamic Theming**: First-class support for dark/light modes, dynamic color schemes, and custom design tokens.
- **Interactive CLI Tools**: Includes `flipova` and `flipova-ds` to instantly scaffold projects, manage design system registries, and handle themes natively from the terminal.

---

## Installation

Flipova Foundation is published on both the **npm public registry** and **GitHub Packages**. It is designed to adapt its dependency graph depending on your target environment.

### For React Web Projects

The web version is extremely lightweight. It installs only what is necessary for DOM-based environments, completely bypassing React Native abstractions.

```bash
npm install @flipova/foundation
```

### For React Native / Expo Projects

For native environments, Flipova leverages your existing Expo and React Native ecosystem. Install the package alongside its optional native peer dependencies:

```bash
npm install @flipova/foundation

# Install required native peer dependencies
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated expo-linear-gradient expo-haptics @expo/vector-icons lucide-react-native
```

---

## Architecture & Modules

The package is deeply modularized so you only import what you need. Importing from specific sub-modules guarantees that bundlers will tree-shake platform-incompatible code.

| Module Entry Point | Description | Supported Platforms |
| :--- | :--- | :--- |
| **`@flipova/foundation`** | Core UI components, interactive controls, and layout blocks. | Native |
| **`@flipova/foundation/web`** | DOM-based implementations of primitives, components, and layouts. | Web |
| **`@flipova/foundation/layout`**| Layout hooks (`useBreakpoint`, `useSafeArea`), and declarative registries. | Native |
| **`@flipova/foundation/tokens`**| Core design tokens (spacing, radii, colors, typography). | Native & Web |
| **`@flipova/foundation/theme`** | Theme system, ThemeProvider context, and ColorScheme utilities. | Native & Web |
| **`@flipova/foundation/config`**| Configuration engine (`defineConfig`, `FoundationProvider`). | Native & Web |

---

## Core Concepts & Usage

### 1. Project Initialization

To initialize Flipova Foundation in a new or existing project, run the scaffolding CLI. This command interactively sets up `flipova.config.ts`, creates required directories, and installs peer dependencies if necessary.

```bash
npx flipova
```

### 2. Initialization and Theming

Whether you are on the Web or Native, initializing the design system requires a Provider.

**React Native (App.tsx):**
```tsx
import { FoundationProvider, defineConfig } from "@flipova/foundation/config";
import { Box, Button } from "@flipova/foundation";

const config = defineConfig({
  defaultTheme: "light",
});

export default function App() {
  return (
    <FoundationProvider config={config}>
      <Box padding="xl" backgroundColor="background">
        <Button label="Welcome to Flipova" variant="primary" />
      </Box>
    </FoundationProvider>
  );
}
```

**React Web (App.tsx):**
```tsx
import { ThemeProvider } from "@flipova/foundation/theme";
import { Box } from "@flipova/foundation/web";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Box padding="xl" backgroundColor="background">
        <h1>Web Experience</h1>
      </Box>
    </ThemeProvider>
  );
}
```

### 3. Advanced Theming

The `ThemeProvider` allows you to customize the default tokens and color schemes. You can override specific variables or introduce completely new themes (e.g., "neon" or "high-contrast").

```tsx
import { ThemeProvider, ColorScheme } from "@flipova/foundation/theme";

const customNeonTheme: ColorScheme = {
  background: "#000000",
  foreground: "#39ff14",
  card: "#111111",
  border: "#333333",
  primary: "#ff00ff",
  muted: "#555555",
  success: "#00ff00",
  error: "#ff0000",
  // ... (other required tokens)
};

export default function App() {
  return (
    <ThemeProvider 
      defaultTheme="neon"
      customThemes={{ neon: customNeonTheme }}
    >
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### 4. Layout Primitives

Flipova strongly discourages inline styling. Instead, all structural layouts should be composed using foundational primitives. This guarantees identical spacing and alignment across web and mobile.

- **`Box`**: The lowest-level building block. Supports padding, margins, borders, and background tokens.
- **`Stack`**: A vertical flex container with configurable `gap` spacing.
- **`Inline`**: A horizontal flex container with configurable `gap` spacing and wrapping capabilities.
- **`Center`**: Utility primitive to vertically and horizontally align its children.

**Example: Building a User Card**
```tsx
import { Box, Inline, Stack } from "@flipova/foundation/web";
import { Avatar, Text, Button } from "@flipova/foundation/web";

export function UserCard() {
  return (
    <Box padding="lg" borderRadius="md" backgroundColor="surface">
      <Inline gap="md" align="center">
        <Avatar src="https://example.com/avatar.png" size="lg" />
        <Stack gap="xs" flex={1}>
          <Text variant="heading">John Doe</Text>
          <Text variant="body" color="muted">Software Engineer</Text>
        </Stack>
        <Button label="Follow" variant="secondary" />
      </Inline>
    </Box>
  );
}
```


### 5. Managing the Design System

Flipova Foundation provides a powerful interactive CLI to manage your design system directly from the terminal.

```bash
npx flipova-ds
```

The interactive menu allows you to:
- **Manage Themes**: Add or remove custom themes. It automatically registers them.
- **Manage the Registry**: Browse, add, or remove UI primitives, components, or layout definitions.
- **Generate Tokens**: Recompile TypeScript definitions from your `tokens.yaml` and `themes.yaml` sources.

Whenever you make manual changes to `themes.yaml`, `tokens.yaml`, or registry metadata files, running `npx flipova-ds` allows you to rapidly regenerate the type definitions (`generated.ts`).

---

## Contributing

We welcome contributions to the Flipova Foundation! Please refer to the `CONTRIBUTING.md` file in the root of the repository for detailed instructions on the development workflow, branching strategies, and instructions for adding new components.

## License

MIT © Flipova
