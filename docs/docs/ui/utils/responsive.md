---
title: "responsive"
sidebar_label: "responsive"
description: "Returns the breakpoint token corresponding to a given or current viewport width."
source: "ui/utils/responsive.ts"
slug: "/ui/utils/responsive"
---

# responsive

Returns the breakpoint token corresponding to a given or current viewport width.

## Exported Functions & Hooks

### `getBreakpoint`
Returns the breakpoint token corresponding to a given or current viewport width.

```ts
getBreakpoint(innerWidth?: number): Breakpoint
```

**Parameters:**
- `innerWidth`: Optional viewport width (defaults to window/screen width).

**Returns:** The active breakpoint token ('xs', 'sm', 'md', 'lg', 'xl', '2xl').

