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

studio/
├── cli/           CLI entry point (npx flipova-studio)
├── server/        Express + WebSocket server with REST API
└── engine/
     ├── tree/      Document tree (types + immutable operations)
     └── codegen/   Code generation (page → .tsx, project → full app)
```

## Modules

| Import path | Content |
|---|---|
| `@flipova/foundation` | Everything |
| `@flipova/foundation/tokens` | Design tokens only |
| `@flipova/foundation/theme` | Theme system only |
| `@flipova/foundation/layout` | Layouts, components, blocks, hooks, registry |
| `@flipova/foundation/config` | defineConfig, FoundationProvider |
| `@flipova/foundation/studio` | Studio engine (tree, codegen, server) |

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

## License

MIT
