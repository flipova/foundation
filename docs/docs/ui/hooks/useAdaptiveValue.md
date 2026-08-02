---
title: "useAdaptiveValue"
sidebar_label: "useAdaptiveValue"
description: "useAdaptiveValue — Utility Hook

Selects a value based on the active responsive breakpoint.
Eliminates repeating if(isMobile)/if(isTablet)/if(isDesktop) logic blocks."
source: "ui/hooks/useAdaptiveValue.ts"
slug: "/ui/hooks/useAdaptiveValue"
---

# useAdaptiveValue

useAdaptiveValue — Utility Hook

Selects a value based on the active responsive breakpoint.
Eliminates repeating if(isMobile)/if(isTablet)/if(isDesktop) logic blocks.

## Example

```tsx
const spacing = useAdaptiveValue({ mobile: 2, tablet: 4, desktop: 8 }, 4);
```

## Interfaces & Types

### `AdaptiveConfig`
useAdaptiveValue — Utility Hook

Selects a value based on the active responsive breakpoint.
Eliminates repeating if(isMobile)/if(isTablet)/if(isDesktop) logic blocks.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `mobile` *(optional)* | `T` | – | – |
| `tablet` *(optional)* | `T` | – | – |
| `desktop` *(optional)* | `T` | – | – |

