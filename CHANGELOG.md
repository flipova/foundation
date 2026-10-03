# Changelog

## 2.3.0

### Minor Changes

- f614759: Themes can be declared as light/dark variant pairs in design/themes.xml, and the provider takes a variant prop that is resolved against mode at runtime.

## 2.2.1

### Patch Changes

- cce3ac0: the provider publishes its theme colours in a context and useGluestackColors reads the mounted theme first, so an app that adopted the registries reads its own branding and not the package palette

## 2.2.0

### Minor Changes

- cce3ac0: flipova-design adopt: an app copies the design registries into design/ (and only the registries), the manifest outputs are rewritten to theme/config.ts and theme/tokens.js, and theme/provider.tsx is created
  createGluestackUIProvider(theme) is exported from @flipova/foundation/ui, so an app mounts a provider built from its own generated theme; GluestackUIProvider remains the package theme
  design.js resolves the Python sources from the package instead of the registry directory, so an adopted copy without tools/ has a working generator

## 2.1.1

### Patch Changes

- 39083f9: align the optional expo-glass-effect peer with the expo peer: >=55.0.0 instead of >=57.0.0, so an Expo SDK 55 app can resolve the tree

## 2.1.0

### Minor Changes

- 39083f9: flipova-design no longer copies the registries into the consumer project: it drives the toolchain already installed in node_modules/@flipova/foundation/design
  init/inject inject only the app-level files (tailwind.config.js, postcss.config.js, globals.css) plus the design:\* npm scripts, and never overwrite what exists unless --force
  new where prints the resolved registries and artifacts, inject replays the wiring without the toolchain
  a project design/manifest.xml stays supported as an explicit fork, and gen then writes into the project
  design.js honours FOUNDATION_VENV and FOUNDATION_DOCS_OUT, and probes the project venv or any python on PATH that can import lxml

## 2.0.5

### Patch Changes

- 6b211df: release chain observability: flow status and flow release status report npm, the Release run announces its decision, flow merge names the next step, and flow is a menu in a terminal

## 2.0.4

### Patch Changes

- 7e14947: Gate the release on the changelog entry instead of a commit subject.

## 2.0.3

### Patch Changes

- 592f9a1: Check the OIDC capability where id-token: write actually is.

## 2.0.2

### Patch Changes

- 6e4b031: Fix the release path, which could not complete a release at all.

  Merging the 2.0.1 version pull request failed twice, for two unrelated reasons.

  - The version pull request was red: `flow release check` wanted
    `.changeset/release.md`, which `changeset version` had already consumed.
    Deleting the changeset is what that command does, so a declaration still
    saying `patch` made the invariant "a real bump implies the file exists" false
    on the version pull request and on `main`. `flow release reset`, wired into
    `npm run version:bump`, returns the declaration to `none` in the same step
    that consumes the changeset, so the state is consistent everywhere with no
    special case in the check.
  - `main` refused to publish. The preflight read `git log -1 --pretty=%s` and
    required a `chore: version packages` subject; on a repository that merges
    pull requests the tip is always `Merge pull request #N from ...`, so the
    check could never succeed. It now asks which commit **wrote the current
    version** into `package.json`, with `git log -S`, and treats a version
    already on the registry as nothing-to-do rather than as a failure.

  Also here:

  - `flow verify` runs the gate a contributor would otherwise forget: changeset
    drift, generated files against the registries, registry validation, types.
    It is a gate and not a formatter, so a failure always means "look at this".
  - CONTRIBUTING is now organised around `npm run flow`: the cycle, the four
    decisions you actually make, and what the tool handles for you.
  - `flow issue new` writes the body as a literal YAML block. A Markdown body
    dumped as a folded scalar doubles every blank line in it.
  - the generated "How to Contribute" page had drifted from CONTRIBUTING: it is
    generated from `design/documentation.xml`, not from the Markdown file, so it
    still described the manual procedure. Both are now organised around
    `npm run flow`.

## 2.0.1

### Patch Changes

- 47775ca: Make the contribution flow enforceable rather than advisory, and give the
  repository one entry point for the whole cycle: issue, changeset, branch,
  commit, pull request.

  ### A single changeset, declared once

  `.github/flow/release.yml` declares the bump and the summary for the cycle,
  and `.changeset/release.md` is generated from it. `.changeset/` holds exactly
  one file, and `flow release check` reports any drift between the declaration
  and what `changeset version` actually reads. The version decision is one
  reviewable file instead of a dozen that individually mean very little.

  A changeset with malformed frontmatter used to stop the whole release with an
  error naming neither the file nor the line. `flow release consolidate` folds
  every existing changeset into the single one, and names the files it cannot
  read instead of failing later.

  ### The cycle, end to end

  `node .github/scripts/flow.mjs` walks the cycle in order and skips whatever is
  already done: declare or adopt an issue, declare the release, branch, commit
  with the `Issues:` trailer, push, open the pull request, link the issue. Every
  step is also usable on its own, and a non-interactive run falls back to the
  documented defaults instead of blocking on a prompt.

  ### Issues declared in the repository

  `.github/issues/<id>.yml` declares one issue per file - id, title, labels,
  body - and syncs it to GitHub, so a tracker entry is reviewable like any other
  source file. `flow issue link <n>` adopts an issue that already exists on the
  tracker. `flow link` resolves the local ids and writes `Closes #n` into the
  pull request, refusing to reference a pull request, because GitHub shares one
  numbering between issues and pull requests.

  ### Labels

  `.github/labels.yml` declares every automation label with its colour, its
  description and the paths that trigger it; `.github/labeler.yml` is generated
  from it and checked for drift. The five labels left over from the removed
  architecture (`blocks`, `hooks`, `layout`, `primitives`, `studio`) are gone.

  ### Release path

  `package.json` is the single source of the version. The release workflow
  refuses anything unexpected, authenticates against the registry before
  uploading, and names the likely cause of a failure - missing, expired,
  classic, or wrong-registry token - instead of failing with a bare `E404`. A
  `hotfix` dispatch with a mandatory reason is the only way to skip the version
  pull request.

  ### CI

  - the issue-linkage failure now names the pull request and the two ways out:
    link an issue, or label the pull request `no-issue`;
  - labelling a pull request `changeset:major|minor|patch|none` makes the guard
    write the changeset, commit it to the branch and explain itself;
  - the design registry gate runs on every pull request and on `main`;
  - line endings are normalised (`.gitattributes`), so a generated file can no
    longer look out of date only on Windows.

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
