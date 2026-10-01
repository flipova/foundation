# Changelog

## 2.0.1

### Patch Changes

- 3d86305: Fix the design tooling installation in CI. The workflows resolved
  `python-version: '3.x'` to the newest CPython, for which no `lxml < 6` wheel
  exists, so pip fell back to building from source and failed on the missing
  libxml2/libxslt development headers.

  The interpreter is now pinned and the install requires wheels, so the tooling
  installs deterministically and a missing wheel fails immediately with a short,
  actionable error instead of a long compile failure.

- 74e42d3: Set up proper project hygiene on GitHub so every change is traceable from an
  issue to a changelog entry.

  - Issue forms (bug report, feature request) replace the templates that still
    described the removed layout/block/studio architecture. They ask for the
    version and the affected layer - for this repository, the registry entry
    involved - which is what makes a design-system report actionable.
  - The pull request template requires a linked issue (`Closes #n`), a declared
    release decision, and the design-system checks (change lives in the XML
    registries, generated files regenerated, roles added to every theme, no design
    value in `tailwind.config.js`).
  - The labeler is repointed at the current structure. It referenced the deleted
    `foundation/` tree, so it had stopped labelling anything; it now maps
    `registry`, `tokens`, `theme`, `components`, `config`, `ci` and `docs`.
  - Blank issues are disabled, and questions are routed to Discussions.
  - The soft `changeset status` check is removed from `pr-checks.yml`: the hard
    gate already lives in the `Design registry` CI job, which scopes it to the
    published surface.

- 8fc4001: Harden the release process so a version and its publish always go through the
  expected path, and fail early with an actionable message instead of a bare
  `E404 Not Found` from the registry.

  - `package.json` is now the single source of the version: the design registries
    store no copy of it, so `changeset version` can no longer leave the pipeline
    describing a different version than the one being published.
  - The release workflow decides the path before touching the registry and refuses
    anything unexpected: a commit on `main` that is neither a pending changeset nor
    the `chore: version packages` commit cannot publish, and a version already
    present on the registry is not re-published.
  - The preflight authenticates against the registry and checks write access on
    the package, naming the likely cause (missing, expired, classic, or
    wrong-registry token) when it fails.
  - A `hotfix` dispatch with a mandatory `reason` is the only way to skip the
    version pull request; the quality gates still run.
  - CI now runs a design registry gate on every pull request and on every push to
    `main`, and requires a changeset for any change to the published surface.

- 0cf5b22: Make the design tooling satisfy the POSIX executable-bit rule that CI enforces.

  `ruff` reports `EXE001` (shebang present but file not executable) on Linux for
  the Python entry points, which failed the design gate on every pull request.
  The five real entry points are now marked executable in git, and the shebangs
  were removed from the `.docgen` modules, which are imported rather than
  executed. The `ruff` minimum version is also raised so a Windows developer runs
  the same linter as CI.

## 2.0.0

### Major Changes

- 387bd75: The design system is now a **single registry-driven pipeline**: the XML registries
  are the only source of truth, and they generate the entire gluestack/nativewind
  theme.

  ```
  design/tokens.xml  ┐
                     ├─> components/ui/gluestack-ui-provider/config.ts   (colour vars, light/dark)
  design/themes.xml  ┘   components/ui/gluestack-ui-provider/tokens.js   (the whole Tailwind theme)
  ```

  Role ids in `themes.xml` are now the gluestack CSS variable names
  (`primary-foreground`, `card-foreground`, ...), emitted as space-separated RGB
  triplets so Tailwind opacity modifiers (`bg-primary/50`) keep working.

  ## Breaking changes

  - **The XML element generator is gone.** `uiElement` / `uiHook` definitions, the
    5-files-per-element output, the generated `foundation/**` tree, the showroom
    pages and the generated vitest suites are removed. The component source under
    `components/ui` is now edited directly. `design/schema.xsd` only declares
    `foundationRegistry`, `documentation`, `tokens` and `themes`.
  - **`tailwind.config.js` no longer contains design values.** Consumers must wire
    the generated theme themselves:
    ```js
    const tokens = require("@flipova/foundation/tokens");
    module.exports = {
      presets: [require("nativewind/preset")],
      theme: { extend: tokens.theme },
    };
    ```
    `tailwind.config.js`, `globals.css` and `postcss.config.js` are app-level files
    and are not published; see the Installation page for the three-file setup.
  - **Removed Tailwind aliases** (all unused in `components/`): colours
    `chart-1..5`, `sidebar-*`, `typography-*`; font families `inter`, `georgia`,
    `melno`, `andika`, `outfit`; font weight `extrablack`.
  - **`font-mono` / `font-serif` now resolve from the registry** (literal stacks)
    instead of `var(--font-mono)` / `var(--font-serif)`.
  - Apps must define `--font-sans` (used by `font-sans` / `font-body`) and
    `--font-heading` if those families are used; otherwise the text falls back to
    the inherited font. `font-system`, `font-mono` and `font-serif` need no
    variable.

  ## Added

  - New `@flipova/foundation/tokens` export (typed) exposing the generated Tailwind
    theme, so the design tokens are reachable by package name.
  - Semantic colours `success`, `warning`, `error`, `info` and every
    `*-foreground` counterpart are now available as utilities
    (`bg-success`, `text-error-foreground`, ...) - the variables existed but were
    not mapped in Tailwind.
  - `font-roboto` now resolves (it was previously absent from the Tailwind config
    and silently produced nothing).
  - Scale tokens are exposed as utilities: `spacing`, `borderRadius`, `screens`
    (`xs:` `md:` `lg:` `2xl:`), `fontSize` (including `text-2xs`), `fontWeight`,
    `lineHeight`, `letterSpacing`, `boxShadow` (including `shadow-hard-*` /
    `shadow-soft-*`), `zIndex` (`z-modal`, `z-toast`, ...), `opacity`,
    `transitionDuration` and `transitionTimingFunction`.

## 1.14.0

### Minor Changes

- 33523d8: Add comprehensive guide and documentation for integrating Flipova Foundation design tokens and theming system with external React Web component libraries (shadcn/ui, Radix UI, Material UI, Tailwind CSS).

## 1.13.0

### Minor Changes

- 7b2dc77: Redesign documentation portal with Apple-style aesthetic, translate codebase comments to English, reorganize sidebar, and add comprehensive guides.

## 1.12.0

### Minor Changes

- 7682c7f: Refactor: Remove Flipova Studio, finalize English translations, and fix Docusaurus build issues.

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
