# Changelog

## 1.11.0

### Minor Changes

- eddf500: **feat(sso): add `@flipova/foundation/sso` SDK**

  New sub-package providing a lightweight, framework-agnostic OAuth2 PKCE SSO SDK for React web applications.

  - `SSOProvider` — React context provider (handles login callback, token persistence, auto-refresh)
  - `useSSOAuth()` — Hook exposing `user`, `tokens`, `login`, `logout`, `refreshToken`, `isLoading`, `isAuthenticated`
  - `withSSO(Component)` — HOC to protect pages/routes
  - `createSSOClient(config)` — Low-level client for custom flows
  - Built-in support for **Flipova Accounts** and **Google OAuth** with PKCE
  - Fully extensible with `provider: "custom"` + arbitrary endpoints

  **fix(build): eliminate native dependency leaks from web bundles**

  Extracted all native/Expo package references into a dedicated `nativeExternal` list and ensured they are marked `external` in ALL tsup build targets (including `layout/index`). The problematic `chunk-32VWREEH.mjs` (which imported `@expo/vector-icons`, `react-native-gesture-handler`, `react-native-reanimated`, `expo-camera`) no longer leaks into consumer web bundles.

  Web projects importing `@flipova/foundation/layout` no longer need to provide shims for native packages.

  **fix(cli): remove broken `flipova-studio` bin entry**

  The `bin` field pointed to `./dist/studio-v2/cli/index.js` which did not exist (studio-v2 CLI not yet implemented). The entry has been removed to prevent `npx flipova-studio` from crashing with `MODULE_NOT_FOUND`.

  **chore(studio-v1): remove studio v1 directory**

  Studio v1 (`studio/`) has been superseded by studio-v2 and is no longer maintained or referenced. Removed from the repository.

  **chore(build): clean up tsup.config.ts and package.json scripts**

  - Removed studio-v1 and studio-v2 build/dev scripts that no longer apply
  - Removed broken `studio-v2/cli/index` tsup entry
  - Added `sso/index` build entry (browser platform, pure ESM+CJS)

## 1.10.1

### Patch Changes

- ccd4d90: Fix: react-native no longer imported in web bundle

  Split tsup build into two configs: platform-agnostic entries (index, tokens, theme, layout, config) and a browser-platform web entry. With `platform:"browser"`, esbuild resolves `useColorScheme.web.ts` (window.matchMedia) instead of the React Native version, so `react-native` is never bundled into web consumers.

## 1.10.0

### Minor Changes

- a7083e6: Complete Docusaurus documentation rewrite for v1.10

  - New homepage with hero, features grid, and module cards
  - Improved CSS design: dark mode, typography, code blocks, tables, admonitions
  - Getting Started: separate RN and Web quick-start paths
  - Theming: ColorScheme keys reference, custom theme example, system color scheme
  - Design Tokens: full token reference with all values (spacing, radii, colors, shadows, typography, motion, z-index)
  - Components: accurate props tables for every exported component
  - Layouts: full primitive API (Box props table) + all layout components
  - Web: new dedicated guide for the /web entry point (Vite, Next.js, Tailwind, dark mode, SSR)
  - Studio: updated architecture diagram, WebSocket events table, project file format
  - API Reference: complete export reference for all sub-modules and types
  - Sidebar updated to include the new Web guide

## 1.9.0

### Minor Changes

- 6e5e021: Refactor Flipova Studio UI to use unified Foundation primitives for elegant, centralized design.

## 1.8.0

### Minor Changes

- 909f5aa: Add isomorphic React Web support directly via the `@flipova/foundation/web` entry point without requiring native dependencies. Added GitHub Packages dual-publishing support.

## 1.7.0

### Minor Changes

- 9771d1d: Add multi-platform Docker support (linux/amd64, linux/arm64) to release workflow

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
