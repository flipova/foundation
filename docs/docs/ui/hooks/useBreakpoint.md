---
title: "useBreakpoint"
sidebar_label: "useBreakpoint"
description: "useBreakpoint — Core Layout Hook

Detects the current responsive breakpoint and exposes derived flags
to avoid repeating 'breakpoint === 'xs' || breakpoint === 'sm'' check blocks."
source: "ui/hooks/useBreakpoint.ts"
slug: "/ui/hooks/useBreakpoint"
---

# useBreakpoint

useBreakpoint — Core Layout Hook

Detects the current responsive breakpoint and exposes derived flags
to avoid repeating `breakpoint === "xs" || breakpoint === "sm"` check blocks.

## Example

```tsx
const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();
```

## Interfaces & Types

### `BreakpointInfo`
useBreakpoint — Core Layout Hook

Detects the current responsive breakpoint and exposes derived flags
to avoid repeating `breakpoint === "xs" || breakpoint === "sm"` check blocks.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `breakpoint` | `Breakpoint | null` | – | Raw breakpoint token ('xs', 'sm', 'md', 'lg', 'xl', '2xl'). Null on SSR before hydration. |
| `isMobile` | `boolean` | – | True for xs or sm |
| `isTablet` | `boolean` | – | True for md |
| `isDesktop` | `boolean` | – | True for lg, xl, or 2xl |
| `isAtLeastTablet` | `boolean` | – | True for md or larger |
| `isAtLeastDesktop` | `boolean` | – | True for lg or larger |

## Exported Functions & Hooks

### `useBreakpoint`
useBreakpoint — Core Layout Hook

Detects the current responsive breakpoint and exposes derived flags
to avoid repeating `breakpoint === "xs" || breakpoint === "sm"` check blocks.

```ts
useBreakpoint(): BreakpointInfo
```

**Returns:** BreakpointInfo object containing screen state flags (isMobile, isTablet, isDesktop).

