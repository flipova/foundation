# Contributing to Flipova Foundation & Studio

## Git Workflow & Release Management

This project follows a streamlined Git workflow with automated versioning using Changesets. The entire process from development to publication is designed to be efficient and error-proof.

### Complete Development Lifecycle

```
1. Developer creates branch
        |
        v
2. Develop + add changeset
        |
        v
3. Open PR against main
        |
        v
4. CI checks (Node 20 & 22)
        |
        v
5. PR merged to main
        |
        v
6. Release workflow creates "Version Packages" PR
        |
        v
7. Version PR merged
        |
        v
8. Automatic publish to GitHub Packages
```

### Branch Strategy

```
main (protected, auto-published)
  |
  |-- feature/description
  |-- fix/description
  |-- docs/description
  |-- refactor/description
  |-- hotfix/description (emergency)
```

### Branch Naming & Creation

#### Naming Conventions
Use descriptive, lowercase names with hyphens:

```bash
# Features
feature/add-new-button-component
feature/studio-dark-mode
feature/code-generator-enhancement

# Bug fixes
fix/memory-leak-in-renderer
fix/cli-port-conflict
fix/typescript-errors

# Documentation
docs/update-contributing-guide
docs/api-documentation

# Refactoring
refactor/extract-utility-functions
refactor/improve-performance

# Hotfixes (emergency)
hotfix/security-patch
hotfix/critical-bug-fix
```

#### Branch Creation Workflow
```bash
# 1. Start from fresh main
git checkout main
git pull origin main

# 2. Create your feature branch
git checkout -b feature/your-description

# 3. Work on your branch
git add .
git commit -m "feat: add new button component"

# 4. Keep branch updated with main
git fetch origin
git rebase origin/main

# 5. Create Pull Request
git push origin feature/your-description
# Open PR against main + add changeset
```

### Version Management with Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for automated version management and publishing.

#### Adding a Changeset (Required for every release)

After making any change that should be released:

```bash
npx changeset
```

This prompts you to:
1. **Select affected packages** (usually just `@flipova/foundation`)
2. **Choose semver bump type**:
   - `patch` - Bug fixes, small improvements
   - `minor` - New features, backward-compatible changes  
   - `major` - Breaking changes
3. **Write a clear summary** of what changed

The changeset file is created in `.changeset/` and must be committed with your PR.

#### Automated Release Process

When changesets are processed automatically:

1. **Version Bumping**: Package versions bumped automatically (patch/minor/major)
2. **Changelog Update**: `CHANGELOG.md` updated with all changes
3. **Git Tags**: Created for each release
4. **GitHub Release**: Created automatically
5. **Package Publishing**: To GitHub Packages (`https://npm.pkg.github.com`)

#### Manual Version Commands (if needed)

```bash
# Update versions and changelog (creates version PR)
npm run version

# Full release process (build + typecheck + publish)
npm run release
```

### Commit Message Convention

Follow conventional commits format (integrates with Changesets):

```bash
feat: add new button component
fix: resolve memory leak in renderer
docs: update API documentation
refactor: extract utility functions
test: add unit tests for codegen
chore: update dependencies
```

**Types:**
- `feat`: New features (triggers minor version)
- `fix`: Bug fixes (triggers patch version)
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Branch Protection & CI/CD

#### Branch Protection Rules (`.github/BRANCH_PROTECTION.md`)

**Required settings:**
- **Pull request required** before merging
- **1 approval required** from maintainers
- **Status checks required**: CI must pass on Node 20 & 22
- **Linear history enforced** (squash or rebase, no merge commits)
- **Conversation resolution required** (all discussions must be resolved)

**Recommended settings:**
- **Restricted pushes** (maintainers only)
- **No force pushes** allowed
- **No deletions** allowed

#### CI/CD Pipeline

**CI Workflow** (`.github/workflows/ci.yml`):
- Runs on every push/PR to `main`
- Tests on Node.js 20 and 22
- Executes `npm ci`, `npm run typecheck`, `npm run build`
- Fails fast if any check fails

**Release Workflow** (`.github/workflows/release.yml`):
- Triggered on push to `main`
- Uses `changesets/action@v1` to process changesets
- Creates "Version Packages" PR or publishes directly
- Updates changelog and versions automatically

**Publish Workflow** (`.github/workflows/publish.yml`):
- Runs on releases and tags
- Builds and typechecks again
- Publishes to GitHub Packages
- Uses restricted access (private package)

### Pull Requirements & Best Practices

#### Before Opening PR
1. **Sync with main**: `git rebase origin/main`
2. **Run tests locally**: `npm run typecheck && npm run build`
3. **Add changeset**: `npx changeset` (for user-facing changes)
4. **Clean history**: Use interactive rebase if needed

#### PR Requirements Checklist
- [x] Clear title following commit convention
- [x] Detailed description of changes
- [x] All checklist items completed in PR template
- [x] Changeset added for user-facing changes
- [x] Tests pass (CI green on both Node versions)
- [x] No merge conflicts
- [x] Code follows project conventions

#### During Review
1. **Address feedback promptly**
2. **Keep PR updated** with latest main
3. **Maintainers handle commit squashing**
4. **Delete branch** after merge

### Common Development Workflows

#### Feature Development (Standard)
```bash
# Start
git checkout main && git pull
git checkout -b feature/new-layout

# Work
# ...make changes...
git add .
git commit -m "feat: add responsive grid layout"

# Add changeset
npx changeset
git add .changeset/*.md
git commit -m "chore: add changeset for new layout"

# Update with main
git fetch origin
git rebase origin/main

# Submit
git push origin feature/new-layout
# Open PR, ensure CI passes
```

#### Bug Fix
```bash
# Start
git checkout main && git pull
git checkout -b fix/cli-startup-error

# Work
# ...fix bug...
git add .
git commit -m "fix: resolve CLI startup error on Windows"

# Add changeset
npx changeset
git add .changeset/*.md
git commit -m "chore: add changeset for CLI fix"

# Test
npm run typecheck
npm run build

# Submit
git push origin fix/cli-startup-error
# Open PR, ensure CI passes
```

#### Hotfix (Emergency Only)
For critical issues requiring immediate deployment:

```bash
# Create from main
git checkout main && git pull
git checkout -b hotfix/security-patch

# Fix and test quickly
# ...minimal fix...
git add .
git commit -m "fix: critical security vulnerability"

# Skip changeset for true emergencies
# Fast-track PR
git push origin hotfix/security-patch
# Request urgent review, maintainers handle release
```

### What NOT to Do

- **Never push directly to `main`**
- **Never merge without PR approval**
- **Never commit directly to `main`**
- **Never force push to shared branches**
- **Never leave stale branches** (delete after merge)
- **Never include sensitive data** (check .gitignore)
- **Never skip changeset** for user-facing changes (except true emergencies)

### Git Configuration

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase false  # Or true based on preference
```

### Troubleshooting

#### Merge Conflicts
```bash
# During rebase
git rebase --continue  # After resolving conflicts
git rebase --abort     # To cancel rebase

# During merge
git merge --continue   # After resolving conflicts
git merge --abort      # To cancel merge
```

#### Force Push (Last Resort)
```bash
# ONLY on your feature branch, NEVER on main
git push --force-with-lease origin feature/your-branch
```

### Publishing Destination

- **Registry**: GitHub Packages (`https://npm.pkg.github.com`)
- **Package**: `@flipova/foundation`
- **Access**: Private (requires authentication)
- **CLI**: `npx flipova-studio` works after installation

The entire workflow is automated and ensures every published version is properly built, tested, documented, and versioned correctly!

## Architecture Overview

```
foundation/           # Design system library (published as @flipova/foundation)
├── config/           # defineConfig, FoundationProvider, resolveConfig
├── layout/
│   ├── hooks/        # useBreakpoint, usePlatformInfo, PlatformOverride
│   ├── registry/     # layouts.ts, components.ts, blocks.ts, primitives.ts, defaults.ts
│   ├── types/        # LayoutMeta, ComponentMeta, BlockMeta, shared types
│   ├── ui/
│   │   ├── primitives/  # Box, Stack, Inline, Center, Scroll, Divider
│   │   ├── components/  # Button, TextInput, Badge, Avatar, Image, Video...
│   │   ├── blocks/      # AuthFormBlock, CardBlock, FormBlock, ModalBlock...
│   │   └── *.tsx        # Layout components (RootLayout, AuthLayout, DashboardLayout...)
│   └── utils/        # responsive, platform, spacing resolution
├── theme/            # ThemeProvider, theme definitions (light, dark, neon...)
└── tokens/           # spacing, colors, radii, typography, shadows, motion...

studio/               # Visual app builder
├── app/              # Expo Router app (the studio UI)
│   ├── app/          # Routes (_layout.tsx, index.tsx)
│   └── src/
│       ├── renderer/ # NodeRenderer, componentMap, slotConfig, PlatformSimulator
│       ├── store/    # StudioProvider (state), tokens (resolution)
│       └── ui/       # Topbar, LibraryPanel, LayersPanel, DeviceCanvas,
│                     # PropertiesPanel, DesignPanel, CodePanel, Statusbar,
│                     # shared/SmartInput, modals/...
├── cli/              # npx flipova-studio
├── engine/
│   ├── codegen/      # generator.ts (page→TSX), project.ts (full project)
│   └── tree/         # types.ts (TreeNode, ProjectDocument), operations.ts
└── server/           # Express + WebSocket server, REST API
```

## Adding a New Foundation Component

### 1. Define in Registry

Add to `foundation/layout/registry/components.ts`:

```ts
{
  id: "MyComponent",
  label: "My Component",
  description: "What it does.",
  category: "display",  // input | action | display | feedback | media | navigation
  tags: ["my", "component"],
  themeMapping: { bg: "card", text: "foreground" },
  sizes: ["sm", "md", "lg"],
  variants: [
    { name: "default", label: "Default", overrides: {} },
  ],
  props: [
    { name: "label",       label: "Label",        type: "string",  group: "content",  default: "Hello" },
    { name: "variant",     label: "Variant",      type: "enum",    group: "style",    default: "default", options: ["default"] },
    { name: "size",        label: "Size",         type: "enum",    group: "style",    default: "md", options: ["sm", "md", "lg"] },
    { name: "disabled",    label: "Disabled",     type: "boolean", group: "behavior", default: false },
    { name: "background",  label: "Background",   type: "color",   group: "style",    themeDefault: "card" },
    { name: "borderRadius",label: "Border radius",type: "radius",  group: "style",    default: "md" },
  ],
}
```

**Prop types:** `string`, `number`, `boolean`, `enum`, `color`, `radius`, `shadow`, `spacing`, `padding`, `ratio`, `background`

**Groups:** `content`, `style`, `layout`, `behavior`

### 2. Implement the Component

Create `foundation/layout/ui/components/MyComponent.tsx`:

```tsx
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import Box from "../primitives/Box";

const META = getComponentMeta("MyComponent")!;

export interface MyComponentProps {
  label?: string;
  variant?: "default";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  background?: string;
  borderRadius?: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = (rawProps) => {
  const { theme } = useTheme();
  const { label, size, disabled, background, borderRadius } =
    applyDefaults(rawProps, META, theme) as Required<MyComponentProps>;

  return (
    <Box bg={background || theme.card} borderRadius={borderRadius as any}
      style={disabled ? { opacity: 0.5 } : {}}>
      <Text style={{ color: theme.foreground }}>{label}</Text>
    </Box>
  );
};

export default MyComponent;
```

**Rules:**
- Use primitives only (Box, Stack, Inline, Center, Scroll) — no raw View/ScrollView
- Get defaults from registry via `applyDefaults(rawProps, META, theme)`
- Use `useTheme()` for colors
- Style conditionals: `condition ? {...} : {}` (never `undefined`)
- Cast spacing props: `p={padding as any}` when value comes from registry

### 3. Export from Barrel

Add to `foundation/layout/ui/components/index.ts`:
```ts
export { default as MyComponent } from "./MyComponent";
export type { MyComponentProps } from "./MyComponent";
```

### 4. Map in Studio

Add to `studio/app/src/renderer/componentMap.ts`:
```ts
import MyComponent from '../../../../foundation/layout/ui/components/MyComponent';
// ...
MyComponent: safe(MyComponent),
```

### 5. Build & Test

```bash
npm run build          # Build foundation + studio
npx flipova-studio     # Start studio, component appears in Library > Components
```

## Adding a New Block

Same process but use `foundation/layout/registry/blocks.ts` and `foundation/layout/ui/blocks/`.
Blocks have `slots` and `components` arrays in their registry entry.

## Adding a New Layout

Same process but use `foundation/layout/registry/layouts.ts` and `foundation/layout/ui/`.
Layouts have `slots`, `responsive`, `animated`, `dependencies`, and `constants`.

## SmartInput Linking

All linkable data is available in the SmartInput linker:
- `$` Tokens, `T` Theme, `S` State, `G` Global, `Q` Queries
- `N` Nav, `C` Config, `D` Device, `@` Vars, `#` Nodes

States from `setState` actions in triggers are auto-discovered.

## Code Generation

The codegen in `studio/engine/codegen/` transforms the tree into:
- Page TSX files with imports, hooks, JSX
- Project scaffold (app.json, package.json, tsconfig, eas.json)
- Service clients, query hooks, auth provider, global state
- StyleSheet.create for optimized styles
- Screen groups with route guards

## Versioning & Publishing with Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for automated version management and publishing.

### Workflow Overview

```
Developer adds changeset
        |
        v
PR merged to main
        |
        v
CI runs (typecheck + build on Node 20 & 22)
        |
        v
Release workflow creates "Version Packages" PR
        |
        v
Version PR merged
        |
        v
Automatic publish to GitHub Packages
```

### Step-by-Step Process

#### 1. Add a Changeset (Required for every change)

After making any change that should be released:

```bash
npx changeset
```

This will prompt you to:
1. **Select affected packages** (usually just `@flipova/foundation`)
2. **Choose semver bump type**:
   - `patch` - Bug fixes, small improvements
   - `minor` - New features, backward-compatible changes
   - `major` - Breaking changes
3. **Write a clear summary** of what changed

The changeset file is created in `.changeset/` and should be committed with your PR.

#### 2. Pull Request Requirements

Every PR must include:
- [x] `npm run typecheck` passes
- [x] `npm run build` passes  
- [x] Changeset added (`npx changeset`)
- [x] Code follows project conventions

#### 3. Automated CI/CD Process

**CI Workflow** (`.github/workflows/ci.yml`):
- Runs on every push/PR to `main`
- Tests on Node.js 20 and 22
- Executes `npm ci`, `npm run typecheck`, `npm run build`
- Fails fast if any check fails

**Release Workflow** (`.github/workflows/release.yml`):
- Triggered on push to `main`
- Uses `changesets/action@v1` to:
  - Collect all pending changesets
  - Create "Version Packages" PR with bumped versions
  - Update `CHANGELOG.md` automatically
  - Or publish directly if no version PR needed

**Publish Workflow** (`.github/workflows/publish.yml`):
- Runs on releases and tags
- Builds and typechecks again
- Publishes to GitHub Packages (`https://npm.pkg.github.com`)
- Uses restricted access (private package)

#### 4. Version Bumping & Changelog

When changesets are processed:
- Package versions are bumped automatically (patch/minor/major)
- `CHANGELOG.md` is updated with all changes
- Git tags are created for releases
- GitHub Release is created automatically

#### 5. Manual Version Commands

If needed, you can manually trigger versioning:

```bash
# Update versions and changelog (creates version PR)
npm run version

# Full release process (build + typecheck + publish)
npm run release
```

### Configuration Details

**Changeset Config** (`.changeset/config.json`):
- Private package (`access: "restricted"`)
- Publishes to GitHub Packages
- Updates internal dependencies as patches
- Base branch: `main`

**Package Scripts**:
```json
{
  "version": "changeset version",
  "release": "npm run build && npm run typecheck && changeset publish",
  "prepublishOnly": "npm run build && npm run typecheck"
}
```

### Best Practices

1. **Always add a changeset** for any user-facing change
2. **Write clear summaries** - they become the changelog
3. **Choose correct semver level**:
   - `patch` for fixes and small improvements
   - `minor` for new features
   - `major` for breaking changes
4. **Test locally** before pushing:
   ```bash
   npm run typecheck
   npm run build
   ```
5. **Monitor the "Version Packages" PR** to ensure correct version bumps

### Publishing Destination

- **Registry**: GitHub Packages (`https://npm.pkg.github.com`)
- **Package**: `@flipova/foundation`
- **Access**: Private (requires authentication)
- **CLI**: `npx flipova-studio` works after installation

The entire process is automated and ensures that every published version is properly built, tested, and documented!
