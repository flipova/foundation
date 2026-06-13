# @flipova/foundation

Design tokens, theming, layout primitives, and UI components for **React Native** (iOS, Android) and **React web** apps — from a single shared codebase.

## Install

```bash
npm install @flipova/foundation
```

One install — no extra deps needed. Works out of the box for **React web** projects.

For **React Native / Expo** projects, install the optional native peer dependencies you use:

```bash
npx expo install expo-linear-gradient expo-haptics react-native-gesture-handler react-native-reanimated react-native-safe-area-context lucide-react-native
```

### Other Installation Methods

FlipovaFoundation is available in multiple formats for different use cases:

- **npm (public)**: `npm install @flipova/foundation` ← default
- **GitHub Packages**: `npm install @flipova/foundation --registry https://npm.pkg.github.com`
- **Docker Image**: `docker pull ghcr.io/flipova/foundation:latest` or `docker pull flipova/foundation:latest`
- **Standalone CLI Binary**: Download from GitHub Releases for Linux, macOS, or Windows
- **Archive**: Download tar.gz archive from GitHub Releases for offline installation

## Quick start

### React Native / Expo

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

### React Web

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

## Architecture

```
foundation/
├── tokens/       Static design tokens (spacing, colors, radii, shadows, typography, motion)
├── theme/        Theme system (ColorScheme, ThemeProvider, 9 built-in themes)
├── config/       Configuration (defineConfig, FoundationProvider, token overrides)
├── web/          ← NEW: React web components (no React Native dependency)
│    ├── primitives/   Box, Stack, Inline, Center, Scroll, Divider
│    ├── components/   Button, TextInput, Badge, Avatar, Icon, Select, Tabs…
│    └── layouts/      RootLayout, DashboardLayout, AuthLayout, SidebarLayout…
└── layout/
     ├── types/       Shared types (LayoutMeta, ComponentMeta, BlockMeta)
     ├── registry/    Declarative registries (layouts, components, blocks) — platform-agnostic
     ├── hooks/       useBreakpoint, useAdaptiveValue, usePlatformInfo, useSafeArea
     ├── utils/       resolveLayoutPadding, resolveBackground, responsive
     └── ui/
          ├── primitives/   Box, Stack, Inline, Center, Scroll, Divider (React Native)
          ├── [layouts]     23 layout components (React Native)
          ├── components/   Button, TextInput… (React Native)
          └── blocks/       AuthFormBlock, HeaderBlock (React Native)

studio/
├── cli/           CLI entry point (npx flipova-studio)
├── server/        Express + WebSocket server with REST API
└── engine/
     ├── tree/      Document tree (types + immutable operations)
     └── codegen/   Code generation (page → .tsx, project → full app)
```

## Modules

| Import path | Content | Platform |
|---|---|---|
| `@flipova/foundation` | Everything (RN) | React Native |
| `@flipova/foundation/web` | Web primitives, components & layouts | React Web |
| `@flipova/foundation/tokens` | Design tokens only | Both |
| `@flipova/foundation/theme` | Theme system only | Both |
| `@flipova/foundation/layout` | Layouts, components, blocks, hooks, registry | React Native |
| `@flipova/foundation/config` | defineConfig, FoundationProvider | Both |
| `@flipova/foundation/studio` | Studio engine (tree, codegen, server) | Node.js |

## Studio (visual builder)

```bash
npx flipova-studio
```

Starts the builder at http://localhost:4200. This single command auto-builds the web UI if needed, starts the server, and serves the React app.

| Command | Description |
|---------|-------------|
| `npx flipova-studio` | Start the builder |
| `npx flipova-studio --port 3000` | Custom port |
| `npx flipova-studio --dev` | Dev mode with Vite HMR |
| `npx flipova-studio generate` | Generate React Native code |

See [studio/README.md](studio/README.md) for the full API documentation.

## Docker

You can run Flipova Studio using Docker for an isolated environment with automatic builds and persistence.

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will:
- Build the Docker image with Foundation and Studio
- Start the Studio server on port 4200
- Persist project data in a Docker volume
- Mount generated code to a volume for easy access

Access the Studio at http://localhost:4200

### Using Docker directly

```bash
# Build the image
docker build -t flipova-studio .

# Run the container
docker run -d \
  -p 4200:4200 \
  -v studio-data:/app/.flipova-studio \
  -v generated-code:/app/generated \
  --name flipova-studio \
  flipova-studio
```

### Using Pre-built Docker Images

Pre-built Docker images are available from GitHub Container Registry and Docker Hub:

```bash
# From GitHub Container Registry
docker pull ghcr.io/flipova/foundation:latest

# From Docker Hub
docker pull flipova/foundation:latest

# Run with pre-built image
docker run -d \
  -p 4200:4200 \
  -v studio-data:/app/.flipova-studio \
  -v generated-code:/app/generated \
  --name flipova-studio \
  ghcr.io/flipova/foundation:latest
```

### Docker Volumes

- `studio-data`: Persists your Studio project data (layouts, pages, components)
- `generated-code`: Contains the generated React Native code

### Accessing Generated Code

The generated code is available in the `generated-code` volume. To access it:

```bash
# Copy generated code to host
docker cp flipova-studio:/app/generated ./generated
```

Or mount the volume directly to a host directory by modifying docker-compose.yml:

```yaml
volumes:
  - ./generated:/app/generated
```

## Release Formats

Flipova Foundation is distributed in multiple formats for different use cases:

### npm Package

For use in React Native projects via npm:

```bash
npm install @flipova/foundation
```

Published to: https://npm.pkg.github.com/@flipova/foundation

### Docker Image

For containerized deployment of Flipova Studio:

```bash
docker pull ghcr.io/flipova/foundation:latest
# or
docker pull flipova/foundation:latest
```

Published to:
- GitHub Container Registry: https://github.com/flipova/foundation/pkgs/container/foundation
- Docker Hub: https://hub.docker.com/r/flipova/foundation

### Standalone CLI Binary

For running Flipova Studio without npm:

Download from GitHub Releases:
- Linux: `flipova-studio-linux-x64`
- macOS: `flipova-studio-macos-x64`
- Windows: `flipova-studio-windows-x64.exe`

```bash
# Make executable (Linux/macOS)
chmod +x flipova-studio-linux-x64

# Run
./flipova-studio-linux-x64
```

### Archive

For offline installation or custom deployment:

Download `flipova-foundation-VERSION.tar.gz` from GitHub Releases.

```bash
# Extract
tar -xzf flipova-foundation-VERSION.tar.gz

# The archive contains:
# - dist/ (built foundation library)
# - studio/app/dist/ (built studio web UI)
# - studio/server/ (Express server)
# - studio/engine/ (tree operations and codegen)
# - studio/cli/ (CLI entry point)
```

## License

MIT
