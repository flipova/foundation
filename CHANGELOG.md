# Changelog

## 1.6.0

### Minor Changes

- 3b33f1c: Unified release workflow in release.yml with clear steps for npm, Docker, archive, and CLI releases. Removed publish.yml

## 1.5.0

### Minor Changes

- 30fce61: Reorganize GitHub workflows with structured pipeline, concurrency handling, and workflow_run triggers. Remove duplicate npm publish from publish workflow (handled by release workflow)

## 1.4.1

### Patch Changes

- 8ae1798: Create new branch for multi-format releases

  Design Docker image build workflow

  Design additional release formats (e.g., standalone binaries, archives)

  Create GitHub workflow for Docker releases

  Create GitHub workflow for other release formats

  Update documentation for new release formats

  Add changeset for multi-format releases

## 1.4.0

### Minor Changes

- 751d13e: Added Dockerfile

## 1.3.2

### Patch Changes

- 0e0f75f: Restyling of documentation interface

## 1.3.1

### Patch Changes

- c1377f2: documentation updates

## 1.3.0

### Minor Changes

- 8922e28: Add comprehensive documentation including Getting Started, Theming, Components, Layouts, Design Tokens, and Studio guides. Complete user documentation with examples, best practices, and API references.

## 1.2.0

### Minor Changes

- 6fb7929: Fix TypeScript errors in TriggerBlock.tsx and LogicPanel.items.test.tsx. Improve CONTRIBUTING.md with comprehensive Git workflow and version management documentation.

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
