# Changelog

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
