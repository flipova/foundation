---
title: "PlatformOverride"
sidebar_label: "PlatformOverride"
description: "PlatformOverride — Context to override platform detection in preview mode.
When provided, useBreakpoint and usePlatformInfo will use these values instead of real ones."
source: "ui/hooks/PlatformOverride.tsx"
slug: "/ui/hooks/PlatformOverride"
---

# PlatformOverride

PlatformOverride — Context to override platform detection in preview mode.
When provided, useBreakpoint and usePlatformInfo will use these values instead of real ones.

## Interfaces & Types

### `PlatformOverrideValue`
PlatformOverride — Context to override platform detection in preview mode.
When provided, useBreakpoint and usePlatformInfo will use these values instead of real ones.
/
import React, &#123; createContext, useContext &#125; from 'react';
import type &#123; BreakpointInfo &#125; from './useBreakpoint';
import type &#123; PlatformInfo &#125; from './usePlatformInfo';

/**
Override value for platform detection and responsive breakpoints.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `breakpoint` *(optional)* | `BreakpointInfo` | – | – |
| `platform` *(optional)* | `PlatformInfo` | – | – |

## Exported Functions & Hooks

### `usePlatformOverride`
PlatformOverride — Context to override platform detection in preview mode.
When provided, useBreakpoint and usePlatformInfo will use these values instead of real ones.
/
import React, { createContext, useContext } from 'react';
import type { BreakpointInfo } from './useBreakpoint';
import type { PlatformInfo } from './usePlatformInfo';

/**
Override value for platform detection and responsive breakpoints.
/
export interface PlatformOverrideValue {
  breakpoint?: BreakpointInfo;
  platform?: PlatformInfo;
}

const Ctx = createContext<PlatformOverrideValue | null>(null);

/**
Hook to access the platform override context value.

```ts
usePlatformOverride() => useContext(Ctx)
```

**Returns:** Current override context value or null.

