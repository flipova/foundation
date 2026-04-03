# Changelog

## 1.1.0

### Minor Changes

- 9599f87: Add Flipova Studio — visual app builder integrated into foundation.

  - Studio server (Express + WebSocket) with REST API for project, pages, registry, and code generation
  - Document tree engine with immutable operations (create, insert, remove, move, update)
  - Code generator that produces clean React Native .tsx files importing from @flipova/foundation
  - Project generator that scaffolds screens, navigation, theme config, services, and App.tsx
  - Web UI with device frame preview, drag & drop from registry, props panel, layers panel, and Expo Snack integration
  - CLI: `npx flipova-studio` to start, `npx flipova-studio generate` for headless codegen
  - Component registry with 10 base components (Button, TextInput, TextArea, Checkbox, Switch, Badge, Avatar, IconButton, Chip, Spinner)
  - Block registry with 7 functional blocks (AuthFormBlock, AvatarBlock, HeaderBlock, SearchBarBlock, StatCardBlock, EmptyStateBlock, ListItemBlock)
  - Foundation config system with defineConfig(), FoundationProvider, and token/theme overrides

## 1.0.0 (2025-04-03)

### Features

- Design tokens: spacing, breakpoints, radii, shadows, colors, typography, motion, opacity, z-index
- Theme system: 9 built-in themes (light, dark, neon, spring, summer, autumn, winter, halloween, christmas)
- `createTheme()` helper for custom themes
- `FoundationProvider` with `defineConfig()` for project-level token and theme overrides
- Layout primitives: Box, Stack, Inline, Center, Scroll, Divider
- 23 layout components with centralized registry (props, defaults, variants, constants, theme mapping)
- Base UI components: Button, TextInput (with variant and size support)
- Functional blocks: AuthFormBlock, HeaderBlock
- Component and block registries for UI builder integration
- `useBreakpoint()` hook with derived helpers (isMobile, isTablet, isDesktop)
- `useAdaptiveValue()` hook for responsive prop selection
- `usePlatformInfo()` hook for platform detection
- Utility functions: resolveLayoutPadding, resolveBackground
