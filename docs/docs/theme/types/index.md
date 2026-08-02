---
title: "Types - Overview"
sidebar_label: "Types (Overview)"
description: "Type representing built-in and generated theme modes."
source: "theme/types/index.ts"
slug: "/theme/types/index"
---

# Types - Overview

Type representing built-in and generated theme modes.

## Interfaces & Types

### `ThemeGradients`
Type representing built-in and generated theme modes.
/
export type ThemeMode = ThemeName | 'light' | 'dark';

/**
Type representing a custom theme mode as a string.
/
export type CustomThemeMode = string;

/**
Theme gradient color definitions.
Each gradient is an array of 2+ color strings.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `primary` | `string[]` | – | – |
| `secondary` | `string[]` | – | – |
| `success` | `string[]` | – | – |
| `warning` | `string[]` | – | – |
| `error` | `string[]` | – | – |
| `info` | `string[]` | – | – |
| `subtle` | `string[]` | – | – |
| `vibrant` | `string[]` | – | – |

### `ColorScheme`
Theme color scheme specification.

Contains color and gradient tokens — static tokens
(spacing, radii, shadows, typography) are imported directly
from `foundation/tokens` as they remain constant across themes.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `background` | `string` | – | – |
| `foreground` | `string` | – | – |
| `card` | `string` | – | – |
| `cardForeground` | `string` | – | – |
| `primary` | `string` | – | – |
| `primaryForeground` | `string` | – | – |
| `secondary` | `string` | – | – |
| `secondaryForeground` | `string` | – | – |
| `muted` | `string` | – | – |
| `mutedForeground` | `string` | – | – |
| `accent` | `string` | – | – |
| `accentForeground` | `string` | – | – |
| `destructive` | `string` | – | – |
| `destructiveForeground` | `string` | – | – |
| `border` | `string` | – | – |
| `input` | `string` | – | – |
| `ring` | `string` | – | – |
| `success` | `string` | – | – |
| `warning` | `string` | – | – |
| `error` | `string` | – | – |
| `info` | `string` | – | – |
| `transparent` | `string` | – | – |
| `gradients` | `ThemeGradients` | – | – |

### `ThemeRegistry`
Registry of available application themes.
Contains light and dark themes, plus any registered custom themes.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `light` | `ColorScheme` | – | – |
| `dark` | `ColorScheme` | – | – |
| `key` | `string]: ColorScheme` | – | – |

