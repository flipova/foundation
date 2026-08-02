---
title: "resolveBackground"
sidebar_label: "resolveBackground"
description: "Resolves a LayoutBackground (string | [string, string, ...]) into bg and gradient properties.
Eliminates duplicate resolution logic across AuthLayout, SidebarLayout, etc."
source: "ui/utils/resolveBackground.ts"
slug: "/ui/utils/resolveBackground"
---

# resolveBackground

Resolves a LayoutBackground (string | [string, string, ...]) into bg and gradient properties.
Eliminates duplicate resolution logic across AuthLayout, SidebarLayout, etc.

## Interfaces & Types

### `ResolvedBackground`
Resolves a LayoutBackground (string | [string, string, ...]) into bg and gradient properties.
Eliminates duplicate resolution logic across AuthLayout, SidebarLayout, etc.
/

import type &#123; LayoutBackground &#125; from "../../types";

/**
Interface representing resolved background properties (solid color hex or gradient array).

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `bg` *(optional)* | `string` | – | – |
| `gradient` *(optional)* | `[string, string]` | – | – |

## Exported Functions & Hooks

### `resolveBackground`
Resolves a LayoutBackground (string | [string, string, ...]) into bg and gradient properties.
Eliminates duplicate resolution logic across AuthLayout, SidebarLayout, etc.
/

import type { LayoutBackground } from "../../types";

/**
Interface representing resolved background properties (solid color hex or gradient array).
/
export interface ResolvedBackground {
  bg?: string;
  gradient?: [string, string];
}

/**
Resolves a layout background definition into a ResolvedBackground object.

```ts
resolveBackground(background?: LayoutBackground): ResolvedBackground
```

**Parameters:**
- `background`: Background configuration (color string or gradient array).

**Returns:** A ResolvedBackground object containing bg or gradient properties.

