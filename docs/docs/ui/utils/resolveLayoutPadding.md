---
title: "resolveLayoutPadding"
sidebar_label: "resolveLayoutPadding"
description: "Resolves a LayoutPadding configuration object into individual pt/pb/pl/pr spacing props.
Eliminates duplicate padding calculation across layouts."
source: "ui/utils/resolveLayoutPadding.ts"
slug: "/ui/utils/resolveLayoutPadding"
---

# resolveLayoutPadding

Resolves a LayoutPadding configuration object into individual pt/pb/pl/pr spacing props.
Eliminates duplicate padding calculation across layouts.

## Interfaces & Types

### `ResolvedPadding`
Resolves a LayoutPadding configuration object into individual pt/pb/pl/pr spacing props.
Eliminates duplicate padding calculation across layouts.
/

import type &#123; SpacingToken &#125; from '../../tokens';
import type &#123; LayoutPadding &#125; from "../../types";

/**
Interface representing resolved padding values for top, bottom, left, and right.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `pt` *(optional)* | `SpacingToken` | – | – |
| `pb` *(optional)* | `SpacingToken` | – | – |
| `pl` *(optional)* | `SpacingToken` | – | – |
| `pr` *(optional)* | `SpacingToken` | – | – |

## Exported Functions & Hooks

### `resolveLayoutPadding`
Resolves a LayoutPadding configuration object into individual pt/pb/pl/pr spacing props.
Eliminates duplicate padding calculation across layouts.
/

import type { SpacingToken } from '../../tokens';
import type { LayoutPadding } from "../../types";

/**
Interface representing resolved padding values for top, bottom, left, and right.
/
export interface ResolvedPadding {
  pt?: SpacingToken;
  pb?: SpacingToken;
  pl?: SpacingToken;
  pr?: SpacingToken;
}

/**
Resolves a layout padding definition (vertical/horizontal or top/bottom/left/right)
into an object containing individual directional padding tokens.

```ts
resolveLayoutPadding(padding?: LayoutPadding): ResolvedPadding
```

**Parameters:**
- `padding`: Layout padding configuration object.

**Returns:** Object containing pt, pb, pl, and pr values.

