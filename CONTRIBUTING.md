# Contributing to @flipova/foundation

## Quick reference: commit flow

### Tooling / CI / docs (no published code change)

```bash
npx changeset add --empty
git add -A
git commit -m "chore: description"
git push
```

### Published code (new component, fix, feature)

```bash
npx changeset              # choose patch/minor/major + write summary
git add -A
git commit -m "feat: description"
git push
```

### What happens after push

1. CI runs typecheck + build on Node 20 and 22
2. The `release.yml` workflow detects pending changesets on `main`
3. It opens a PR titled "chore: version packages" that bumps version + updates CHANGELOG
4. When a maintainer merges that PR, the package is published to GitHub Packages automatically

---

## Getting started

```bash
git clone https://github.com/flipova/foundation.git
cd foundation
npm install
npm run typecheck   # Must pass with zero errors
npm run build       # Generates dist/
```

## Branching strategy

We follow a trunk-based workflow with short-lived feature branches.

```
main (protected, always deployable)
 ├── feat/my-new-layout
 ├── fix/button-border-radius
 ├── docs/update-readme
 └── chore/upgrade-deps
```

### Branch naming

| Prefix | Use |
|--------|-----|
| `feat/` | New feature (layout, component, block, hook) |
| `fix/` | Bug fix |
| `refactor/` | Code improvement without behavior change |
| `docs/` | Documentation only |
| `chore/` | Dependencies, CI, tooling |

### Workflow

1. Fork the repo (external) or create a branch (maintainer)
2. Make your changes
3. Add a changeset: `npx changeset`
4. Push and open a PR against `main`
5. CI runs typecheck + build on Node 20 and 22
6. Get a review, address feedback
7. Squash-merge into `main`
8. The release workflow collects changesets and opens a "Version Packages" PR
9. When that PR is merged, the package is published automatically

## Versioning with Changesets

We use [Changesets](https://github.com/changesets/changesets) for automatic versioning and changelog generation.

### Adding a changeset

Every PR that changes published code must include a changeset:

```bash
npx changeset

# Or if no release to create
npx changeset add --empty`

```

This prompts you to:
1. Select `@flipova/foundation`
2. Choose bump type:
   - `patch` — bug fixes, internal refactors
   - `minor` — new components, layouts, blocks, hooks, non-breaking features
   - `major` — breaking changes (removed props, renamed exports, changed defaults)
3. Write a summary (appears in CHANGELOG.md)

The changeset file (`.changeset/random-name.md`) is committed with your PR.

### What happens on merge

1. The `release.yml` workflow detects pending changesets
2. It opens a PR titled "chore: version packages" that:
   - Bumps the version in `package.json`
   - Updates `CHANGELOG.md`
   - Removes consumed changeset files
3. When a maintainer merges that PR, the package is published to GitHub Packages

## Adding a new layout

1. Create `foundation/layout/ui/MyLayout.tsx`
2. Add the registry entry in `foundation/layout/registry/layouts.ts`
3. Export from `foundation/layout/ui/index.ts`

### Layout file structure

```tsx
/**
 * MyLayout
 *
 * One-line description.
 */

import React from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";

const META = getLayoutMeta("MyLayout")!;

export interface MyLayoutProps {
  children: React.ReactNode;
  background?: string;
}

const MyLayout: React.FC<MyLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, background } = applyDefaults(rawProps, META, theme) as Required<MyLayoutProps>;

  return <Box flex={1} bg={background}>{children}</Box>;
};

export default MyLayout;
```

### Registry entry

```ts
{
  id: "MyLayout",
  label: "My Layout",
  description: "What it does.",
  category: "page",
  themeMapping: { root: "background" },
  slots: [{ name: "children", label: "Content", required: true }],
  responsive: false,
  animated: false,
  tags: ["my", "layout"],
  props: [
    { name: "background", label: "Background", type: "color", group: "style", themeDefault: "background" },
  ],
}
```

## Adding a new component

1. Create `foundation/layout/ui/components/MyComponent.tsx`
2. Add registry entry in `foundation/layout/registry/components.ts`
3. Export from `foundation/layout/ui/components/index.ts`

Components must support variants and sizes defined in the registry.

## Adding a new block

1. Create `foundation/layout/ui/blocks/MyBlock.tsx`
2. Add registry entry in `foundation/layout/registry/blocks.ts`
3. Export from `foundation/layout/ui/blocks/index.ts`

Blocks must declare their `components` dependencies and `slots`.

## Code rules

- Build on primitives only (Box, Stack, Inline, Center, Scroll). No raw View/ScrollView/StyleSheet.
- All defaults from registry via `applyDefaults(rawProps, META, theme)`. No hardcoded defaults.
- Color fallbacks via `themeDefault` in registry. No `|| theme.background` in components.
- Animation constants via `getConstants(META)`. No hardcoded spring configs.
- Only a top-level JSDoc comment. No inline comments, no section separators.
- English only.
- `useBreakpoint()` for responsive. Never derive `isMobile` manually.

## PR checklist

- [ ] Registry entry added/updated
- [ ] `applyDefaults(rawProps, META, theme)` used
- [ ] No hardcoded defaults
- [ ] No raw View/ScrollView/StyleSheet
- [ ] No inline comments
- [ ] Exported from index.ts
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Changeset added (`npx changeset`)

## Releases

Maintainers only:

```bash
# Manual release (if not using the automated workflow)
npx changeset version   # Bumps versions, updates CHANGELOG
npm run release          # Builds, typechecks, publishes
git push --follow-tags
```

## Code of conduct

Be respectful. We're building something together.
