---
title: "responsiveStyle"
sidebar_label: "responsiveStyle"
description: "On web: generates CSS classes with media queries to show/hide
elements per breakpoint without JavaScript overhead.
On native: returns empty styles (JS logic applies)."
source: "ui/utils/responsiveStyle.ts"
slug: "/ui/utils/responsiveStyle"
---

# responsiveStyle

On web: generates CSS classes with media queries to show/hide
elements per breakpoint without JavaScript overhead.
On native: returns empty styles (JS logic applies).

## Example

```tsx
// Visible exclusively on mobile
<Box style={showOnly(["xs", "sm"])} />

// Visible exclusively on desktop
<Box style={showOnly(["md", "lg", "xl", "2xl"])} />
```

## Exported Functions & Hooks

### `showOnly`
On web: generates CSS classes with media queries to show/hide
elements per breakpoint without JavaScript overhead.
On native: returns empty styles (JS logic applies).
/

const breakpointValues: Record<Breakpoint, number> = breakpoints;

const orderedBreakpoints: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

/**
Returns a style object that makes the element visible exclusively
for the provided breakpoints via CSS media queries on web.
On native, returns an empty style object.

```ts
showOnly(visibleAt: Breakpoint[]): any
```

**Parameters:**
- `visibleAt`: Array of breakpoints where the element should be displayed.

**Returns:** Style object applicable to a component to control visibility.

### `hideAt`
Inverse of showOnly: hides the element at specified breakpoints.

```ts
hideAt(hiddenAt: Breakpoint[]): any
```

**Parameters:**
- `hiddenAt`: Array of breakpoints where the element should be hidden.

**Returns:** Style object applicable to a component to manage visibility.

