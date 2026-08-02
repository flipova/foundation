---
title: "Types - Overview"
sidebar_label: "Types (Overview)"
description: "Shared types for layout system, component registry, and block registry.
Serves as the schema contract for visual UI builders and design tools."
source: "types/index.ts"
slug: "/types/index"
---

# Types - Overview

Shared types for layout system, component registry, and block registry.
Serves as the schema contract for visual UI builders and design tools.

## Interfaces & Types

### `LayoutPadding`
Shared types for layout system, component registry, and block registry.
Serves as the schema contract for visual UI builders and design tools.
/

import &#123; SpacingToken &#125; from '../tokens';

/**
Defines padding spacing around a layout element.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `top` *(optional)* | `SpacingToken` | – | – |
| `bottom` *(optional)* | `SpacingToken` | – | – |
| `left` *(optional)* | `SpacingToken` | – | – |
| `right` *(optional)* | `SpacingToken` | – | – |
| `horizontal` *(optional)* | `SpacingToken` | – | – |
| `vertical` *(optional)* | `SpacingToken` | – | – |

### `SlotDescriptor`
Background property type for layouts (solid color hex or gradient array).
/
export type LayoutBackground = string | [string, string, ...string[]];

/**
Color roles extracted from the active theme ColorScheme.
/
export type ThemeColorRole = Exclude&lt;
  &#123;
    [K in keyof import("../theme/types").ColorScheme]: import("../theme/types").ColorScheme[K] extends string ? K : never;
  &#125;[keyof import("../theme/types").ColorScheme],
  undefined
&gt;;

/**
Descriptor for a layout or component slot that accepts child elements.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `string` | – | – |
| `label` | `string` | – | – |
| `required` | `boolean` | – | – |
| `kind` *(optional)* | `"children" | "items" | "named" | "named-array"` | – | – |
| `array` *(optional)* | `boolean` | – | – |

### `PropDescriptor`
Property types supported by the design system metadata.
/
export type PropType =
  | "string"
  | "number"
  | "integer"
  | "url"
  | "icon"
  | "boolean"
  | "spacing"
  | "radius"
  | "shadow"
  | "color"
  | "background"
  | "padding"
  | "enum"
  | "ratio"
  | "json";

/**
Property descriptor for a component, layout, or block.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `string` | – | – |
| `label` | `string` | – | – |
| `type` | `PropType` | – | – |
| `default` *(optional)* | `T` | – | – |
| `themeDefault` *(optional)* | `ThemeColorRole` | – | – |
| `description` *(optional)* | `string` | – | – |
| `required` *(optional)* | `boolean` | – | – |
| `options` *(optional)* | `readonly string[]` | – | – |
| `min` *(optional)* | `number` | – | – |
| `max` *(optional)* | `number` | – | – |
| `step` *(optional)* | `number` | – | – |
| `platform` *(optional)* | `"native" | "web" | "both"` | – | – |
| `group` *(optional)* | `"style" | "layout" | "behavior" | "content"` | – | – |

### `SpringConfig`
Layout categories.
/
export type LayoutCategory = "page" | "content" | "navigation" | "card" | "scroll" | "special";
/**
Component categories.
/
export type ComponentCategory = "input" | "action" | "display" | "feedback" | "overlay" | "media" | "navigation";
/**
Block categories.
/
export type BlockCategory = "auth" | "profile" | "navigation" | "content" | "data" | "feedback" | "form" | "overlay" | "social" | "ecommerce" | "finance" | "onboarding" | "messaging" | "calendar" | "files" | "location" | "media";

/**
Configuration for spring animations.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `damping` | `number` | – | – |
| `stiffness` | `number` | – | – |
| `mass` *(optional)* | `number` | – | – |
| `overshootClamping` *(optional)* | `boolean` | – | – |

### `LayoutConstants`
Constants specific to a layout animation or gesture threshold.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `springConfig` *(optional)* | `SpringConfig` | – | – |
| `springSnap` *(optional)* | `SpringConfig` | – | – |
| `springNoBounce` *(optional)* | `SpringConfig` | – | – |
| `swipeThreshold` *(optional)* | `number` | – | – |
| `flipThreshold` *(optional)* | `number` | – | – |
| `exitDistance` *(optional)* | `number` | – | – |
| `scaleFactor` *(optional)* | `number` | – | – |
| `flipScaleFactor` *(optional)* | `number` | – | – |
| `dezoomDuration` *(optional)* | `number` | – | – |
| `flipDuration` *(optional)* | `number` | – | – |
| `slideOutDuration` *(optional)* | `number` | – | – |
| `exitLeft` *(optional)* | `number` | – | – |
| `exitRight` *(optional)* | `number` | – | – |

### `ComponentSizeConfig`
Standardized size configuration for components.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `height` *(optional)* | `number` | – | – |
| `width` *(optional)* | `number` | – | – |
| `px` *(optional)* | `number` | – | – |
| `py` *(optional)* | `number` | – | – |
| `fontSize` *(optional)* | `number` | – | – |
| `iconSize` *(optional)* | `number` | – | – |
| `borderRadius` *(optional)* | `string | number` | – | – |
| `key` | `string]: unknown` | – | – |

### `ComponentColorConfig`
Standardized color configuration for components.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `bg` *(optional)* | `ThemeColorRole | "transparent" | string` | – | – |
| `text` *(optional)* | `ThemeColorRole | string` | – | – |
| `border` *(optional)* | `ThemeColorRole | "transparent" | string` | – | – |
| `subtle` *(optional)* | `ThemeColorRole | string | readonly [string, string]` | – | – |
| `active` *(optional)* | `ThemeColorRole | string` | – | – |
| `solid` *(optional)* | `readonly [string, string]` | – | – |
| `key` | `string]: unknown` | – | – |

### `LayoutMeta`
Descriptor for a component variant with override properties.
/
export interface VariantDescriptor&lt;Props = Record&lt;string, unknown&gt;&gt; &#123;
  readonly name: string;
  readonly label: string;
  readonly description?: string;
  readonly overrides: Partial&lt;Props&gt;;
&#125;

interface BaseMeta &#123;
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly props: readonly PropDescriptor&lt;any&gt;[];
  readonly themeMapping?: Record&lt;string, ThemeColorRole&gt;;
  readonly tags: readonly string[];
  readonly customConfig?: Record&lt;string, any&gt;;
  readonly enumMap?: Record&lt;string, readonly string[]&gt;;
  readonly example?: string;
  readonly examples?: readonly string[];
&#125;

/**
Layout-specific metadata interface.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | `LayoutCategory` | – | – |
| `slots` | `readonly SlotDescriptor[]` | – | – |
| `constants` *(optional)* | `LayoutConstants` | – | – |
| `responsive` | `boolean` | – | – |
| `animated` | `boolean` | – | – |
| `platforms` *(optional)* | `readonly ("native" | "web")[]` | – | – |
| `previewItemCount` *(optional)* | `number` | – | – |
| `architecture` *(optional)* | `&#123;` | – | – |
| `dependencies` *(optional)* | `readonly string[]` | – | – |

### `ComponentMeta`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | `ComponentCategory` | – | – |
| `variants` | `readonly VariantDescriptor&lt;Props&gt;[]` | – | – |
| `sizes` *(optional)* | `readonly string[]` | – | – |
| `sizeMap` *(optional)* | `Record&lt;string, ComponentSizeConfig&gt;` | – | – |
| `colorMap` *(optional)* | `Record&lt;string, ComponentColorConfig&gt;` | – | – |
| `platforms` *(optional)* | `readonly ("native" | "web")[]` | – | – |
| `capabilities` *(optional)* | `&#123;` | – | – |
| `platforms` *(optional)* | `readonly ("native" | "web")[]` | – | – |

### `BlockMeta`
Block-specific metadata interface.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | `BlockCategory` | – | – |
| `slots` | `readonly SlotDescriptor[]` | – | – |
| `components` | `readonly string[]` | – | – |

### `PrimitiveMeta`
Primitive-specific metadata interface.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | `string` | – | – |
| `slots` *(optional)* | `readonly SlotDescriptor[]` | – | – |

