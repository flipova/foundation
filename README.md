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
- **Built-in Studio Builder**: Comes with a powerful visual UI builder (`flipova-studio`) to drag, drop, and construct layouts visually, outputting production-ready React code.

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

### 1. Initialization and Theming

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

### 2. Layout Primitives

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

---

## Flipova Studio (Visual Builder)

The foundation library comes bundled with **Flipova Studio**, a local visual builder designed to accelerate UI development. It allows you to drag, drop, and configure Foundation components in a web interface, and instantly outputs clean React Native or React Web code.

To start the studio, run:

```bash
npx flipova-studio
```
*This starts the builder locally at http://localhost:4200.*

### Studio CLI Commands

| Command | Description |
| :--- | :--- |
| `npx flipova-studio` | Start the studio server and visual interface. |
| `npx flipova-studio --port 3000` | Start the studio on a custom port. |
| `npx flipova-studio --dev` | Start the studio in development mode with Vite HMR enabled. |
| `npx flipova-studio generate` | Execute the code generator engine against your saved project tree without starting the UI. |

---

## Docker Support

For continuous integration, isolated environments, or team collaboration, Flipova Studio can be run via Docker. It supports data persistence and exposes your generated code to your host machine via volume mapping.

### Using Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  flipova-studio:
    image: ghcr.io/flipova/foundation:latest
    ports:
      - "4200:4200"
    volumes:
      - studio-data:/app/.flipova-studio
      - ./generated:/app/generated
volumes:
  studio-data:
```

Then run:
```bash
docker-compose up -d
```

### Using Pre-built Images via Docker CLI

```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/flipova/foundation:latest

# Run the container with volume mapping
docker run -d \
  -p 4200:4200 \
  -v studio-data:/app/.flipova-studio \
  -v ./generated:/app/generated \
  --name flipova-studio \
  ghcr.io/flipova/foundation:latest
```

---

## Contributing

We welcome contributions to the Flipova Foundation! Please refer to the `CONTRIBUTING.md` file in the root of the repository for detailed instructions on the development workflow, branching strategies, and instructions for adding new components.

## License

MIT © Flipova
