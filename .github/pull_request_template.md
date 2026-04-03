## What

Brief description of the change.

## Why

Why is this change needed?

## Type

- [ ] New feature (layout, component, block)
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] CI/tooling

## Checklist

- [ ] Registry entry added/updated (if new component/layout/block)
- [ ] `applyDefaults(rawProps, META, theme)` used (no hardcoded defaults)
- [ ] No raw `View`/`ScrollView`/`StyleSheet` (primitives only)
- [ ] No inline comments (only top JSDoc)
- [ ] Exported from the appropriate `index.ts`
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Changeset added (`npx changeset`)
