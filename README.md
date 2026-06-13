# 🌌 @flipova/foundation

[![npm version](https://img.shields.io/npm/v/@flipova/foundation.svg)](https://www.npmjs.com/package/@flipova/foundation)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A unified, platform-agnostic design system and UI foundation for building identical experiences across **React Native** (iOS, Android) and **React Web**. 

Flipova Foundation provides design tokens, a declarative theming engine, layout primitives, and beautifully crafted UI components from a single shared codebase.

---

## ✨ Features

- **Write Once, Run Anywhere**: Isomorphic components that map to native primitives on mobile and highly-optimized HTML on the web.
- **Zero-Config Web Support**: The web entry point (`@flipova/foundation/web`) is completely free of heavy native dependencies. 
- **Declarative Layouts**: Build complex UI using simple layout primitives (`Box`, `Stack`, `Inline`, `Center`).
- **Dynamic Theming**: First-class support for dark/light modes and dynamic color schemes.
- **Built-in Studio Builder**: Comes with a powerful visual UI builder (`flipova-studio`) to drag & drop layouts.

---

## 📦 Installation

Flipova Foundation is published on both the **npm public registry** and **GitHub Packages**.

### For React Web Projects

The web version is extremely lightweight. It installs only what is necessary for web environments.

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

## 🚀 Quick Start

### React Web

Import components from the `/web` entry point. No native modules are evaluated, ensuring your web bundle remains small and fast.

```tsx
import { ThemeProvider } from "@flipova/foundation/theme";
import { DashboardLayout, Button, TextInput } from "@flipova/foundation/web";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <DashboardLayout
        header={<nav>My App</nav>}
        sidebar={<aside>Navigation</aside>}
      >
        <Button label="Get started" variant="primary" />
        <TextInput label="Email" placeholder="you@example.com" />
      </DashboardLayout>
    </ThemeProvider>
  );
}
```

### React Native / Expo

Import components from the root or `/layout` entry points for fully native experiences.

```tsx
import { FoundationProvider, defineConfig } from "@flipova/foundation/config";
import { Box, Button } from "@flipova/foundation";

const config = defineConfig({
  defaultTheme: "light",
});

export default function App() {
  return (
    <FoundationProvider config={config}>
      <Box padding="md">
        <Button label="Get started" variant="primary" />
      </Box>
    </FoundationProvider>
  );
}
```

---

## 🏗️ Architecture & Modules

The package is deeply modularized so you only import what you need.

| Module Entry Point | Description | Supported Platforms |
| :--- | :--- | :--- |
| **`@flipova/foundation`** | Core UI components and layout blocks (React Native). | 📱 Native |
| **`@flipova/foundation/web`** | DOM-based implementations of primitives, components, and layouts. | 🌍 Web |
| **`@flipova/foundation/layout`**| Layout hooks (`useBreakpoint`, `useSafeArea`), and declarative registries. | 📱 Native |
| **`@flipova/foundation/tokens`**| Core design tokens (spacing, radii, colors, typography). | 📱 Native & 🌍 Web |
| **`@flipova/foundation/theme`** | Theme system, ThemeProvider context, and ColorScheme utilities. | 📱 Native & 🌍 Web |
| **`@flipova/foundation/config`**| Configuration engine (`defineConfig`, `FoundationProvider`). | 📱 Native & 🌍 Web |

---

## 🎨 Flipova Studio (Visual Builder)

The foundation library comes bundled with **Flipova Studio**, a local visual builder that generates React Native code.

```bash
npx flipova-studio
```
*This starts the builder locally at http://localhost:4200.*

### Studio Commands

| Command | Description |
| :--- | :--- |
| `npx flipova-studio` | Start the studio server and web interface. |
| `npx flipova-studio --port 3000` | Start on a custom port. |
| `npx flipova-studio --dev` | Start in development mode (Vite HMR). |
| `npx flipova-studio generate` | Execute the code generator against your saved tree. |

---

## 🐳 Docker Support

For isolated environments, Flipova Studio can be run via Docker. It supports persistence and exposes your generated code to your host machine.

**Using Docker Compose:**
```bash
docker-compose up -d
```

**Using Pre-built Images:**
```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/flipova/foundation:latest

# Run the container
docker run -d \
  -p 4200:4200 \
  -v studio-data:/app/.flipova-studio \
  -v ./generated:/app/generated \
  --name flipova-studio \
  ghcr.io/flipova/foundation:latest
```

---

## 📜 License

MIT © Flipova
