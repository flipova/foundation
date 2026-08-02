---
title: "Config - Overview"
sidebar_label: "Config (Overview)"
description: "Config - Overview"
source: "config/index.ts"
slug: "/config/index"
---

# Config - Overview

## Interfaces & Types

### `TokenOverrides`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `spacing` *(optional)* | `Record&lt;number, number&gt;` | – | – |
| `breakpoints` *(optional)* | `Record&lt;string, number&gt;` | – | – |
| `radii` *(optional)* | `Record&lt;string, number&gt;` | – | – |
| `fontSizes` *(optional)* | `Record&lt;string, number&gt;` | – | – |
| `fontWeights` *(optional)* | `Record&lt;string, string&gt;` | – | – |
| `lineHeights` *(optional)* | `Record&lt;string, number&gt;` | – | – |
| `colors` *(optional)* | `Record&lt;string, string | Record&lt;string, string&gt;&gt;` | – | – |
| `shadows` *(optional)* | `Record&lt;string, &#123;` | – | – |
| `shadowColor` | `string` | – | – |
| `shadowOffset` | `&#123; width: number` | – | – |
| `height` | `number` | – | – |

### `ThemeDefinition`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `colors` | `Partial&lt;Omit&lt;ColorScheme, "gradients"&gt;&gt;` | – | – |
| `gradients` *(optional)* | `Partial&lt;ThemeGradients&gt;` | – | – |

### `FoundationConfig`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `tokens` *(optional)* | `TokenOverrides` | – | – |
| `themes` *(optional)* | `Record&lt;string, ThemeDefinition&gt;` | – | – |
| `defaultTheme` *(optional)* | `string` | – | – |
| `typescript` *(optional)* | `boolean` | – | – |

### `ResolvedTokens`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `spacing` | `Record&lt;number, number&gt;` | – | – |
| `breakpoints` | `Record&lt;string, number&gt;` | – | – |
| `radii` | `Record&lt;string, number&gt;` | – | – |
| `shadows` | `Record&lt;string, unknown&gt;` | – | – |
| `colors` | `Record&lt;string, unknown&gt;` | – | – |
| `fontSizes` | `Record&lt;string, number&gt;` | – | – |
| `fontWeights` | `Record&lt;string, string&gt;` | – | – |
| `lineHeights` | `Record&lt;string, number&gt;` | – | – |
| `durations` | `Record&lt;string, number&gt;` | – | – |
| `opacity` | `Record&lt;number, number&gt;` | – | – |
| `zIndices` | `Record&lt;string, number&gt;` | – | – |

### `ResolvedConfig`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `tokens` | `ResolvedTokens` | – | – |
| `themes` | `Record&lt;string, ColorScheme&gt;` | – | – |
| `defaultTheme` | `string` | – | – |

## Exported Functions & Hooks

### `defineConfig`
```ts
defineConfig(config: FoundationConfig): FoundationConfig
```

### `resolveConfig`
```ts
resolveConfig(userConfig?: FoundationConfig): ResolvedConfig
```

