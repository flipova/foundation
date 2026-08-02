---
title: "Divider"
description: "Horizontal or vertical divider line."
type: "primitive"
category: "primitive"
slug: "/ui/components/base/Divider/Divider"
---

# Divider

> **Type:** `primitive`  |  **Category:** `primitive`  |  **Tags:** `divider` · `separator` · `line` · `hr`

Horizontal or vertical divider line.

## Use Cases

- Separating items in a list or menu.
- Dividing the header from the main body content.
- Creating clear visual boundaries in dense data displays.

## Structure

- Wraps a simple styled `View` that manages its dimensions based on orientation and thickness.

## Accessibility

- Dividers are typically decorative. Consider applying `accessible={false}` and `importantForAccessibility="no"`
- so they are ignored by screen readers, unless they signify a semantic break that should be announced.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Divider, Card, Stack, Text } from '@flipova/foundation';

export default function DividerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Divider Example</Text>
          <Divider
          vertical={false}
          thickness={1}
        />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `vertical` | `boolean` | `false` | `layout` | Vertical |
| `color` | `color` | – | `style` | Color |
| `thickness` | `number` | `1` | `style` | Thickness |
| `spacing` | `spacing` | – | `layout` | Spacing |







## TypeScript Logic & Hook Specifications

### Interface: `DividerProps`

Properties for the Divider component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `orientation` *(optional)* | `'horizontal' &#124; 'vertical'` | `'horizontal'` | The axis along which the divider should render. |
| `thickness` *(optional)* | `number` | `1` | The thickness (height for horizontal, width for vertical) of the divider in points/pixels. |
| `color` *(optional)* | `string` | – | An optional custom color for the divider. Can be a theme token or a literal color string. If omitted, falls back to the theme's border color. |
| `key` | `string]: any` | – | – |

### Function: `useDividerLogic`

```ts
useDividerLogic(props: DividerProps)
```

### Function: `useDividerStyle`

```ts
useDividerStyle(logic: any)
```

