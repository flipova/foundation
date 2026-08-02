---
title: "Box"
description: "Flexible container with spacing, background, and border support."
type: "primitive"
category: "primitive"
slug: "/ui/components/base/01-primitives/Box/Box"
---

# Box

> **Type:** `primitive`  |  **Category:** `primitive`  |  **Tags:** `box` · `container` · `view` · `div`

Flexible container with spacing, background, and border support.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Box, Card, Stack, Text } from '@flipova/foundation';

export default function BoxExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Box Example</Text>
          <Box />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `flex` | `number` | – | `layout` | Flex |
| `bg` | `color` | – | `style` | Background |
| `p` | `spacing` | – | `layout` | Padding |
| `px` | `spacing` | – | `layout` | Padding X |
| `py` | `spacing` | – | `layout` | Padding Y |
| `m` | `spacing` | – | `layout` | Margin |
| `mx` | `spacing` | – | `layout` | Margin X |
| `my` | `spacing` | – | `layout` | Margin Y |
| `width` | `number` | – | `layout` | Width |
| `height` | `number` | – | `layout` | Height |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `minHeight` | `number` | – | `layout` | Min Height |
| `borderRadius` | `radius` | – | `style` | Border Radius |
| `overflow` | `enum` | – | `style` | Overflow |
| `justifyContent` | `enum` | – | `layout` | Justify |
| `alignItems` | `enum` | – | `layout` | Align Items |
| `alignSelf` | `enum` | – | `layout` | Align Self |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | No | `node` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `BoxProps`

Properties for the Box component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The content to be rendered inside the Box. |
| `flex` *(optional)* | `number` | – | Defines how the Box grows or shrinks to fill available space within a flex container. |
| `bg` *(optional)* | `string` | – | Background color of the Box. Can be a theme token or a literal color value. |
| `p` *(optional)* | `number &#124; string` | – | Padding applied uniformly to all sides. |
| `px` *(optional)* | `number &#124; string` | – | Padding applied to the horizontal sides (left and right). |
| `py` *(optional)* | `number &#124; string` | – | Padding applied to the vertical sides (top and bottom). |
| `m` *(optional)* | `number &#124; string` | – | Margin applied uniformly to all sides. |
| `mx` *(optional)* | `number &#124; string` | – | Margin applied to the horizontal sides (left and right). |
| `my` *(optional)* | `number &#124; string` | – | Margin applied to the vertical sides (top and bottom). |
| `width` *(optional)* | `number &#124; string` | – | Fixed width of the Box. |
| `height` *(optional)* | `number &#124; string` | – | Fixed height of the Box. |
| `maxWidth` *(optional)* | `number &#124; string` | – | Maximum width the Box can grow to. |
| `minHeight` *(optional)* | `number &#124; string` | – | Minimum height the Box must have. |
| `borderRadius` *(optional)* | `number &#124; string` | – | Border radius for rounding the corners of the Box. |
| `overflow` *(optional)* | `'visible' &#124; 'hidden' &#124; 'scroll'` | – | Determines how to handle content that overflows the Box's bounds. |
| `justifyContent` *(optional)* | `'flex-start' &#124; 'flex-end' &#124; 'center' &#124; 'space-between' &#124; 'space-around' &#124; 'space-evenly'` | – | Flexbox property to align children along the main axis. |
| `alignItems` *(optional)* | `'stretch' &#124; 'flex-start' &#124; 'flex-end' &#124; 'center' &#124; 'baseline'` | – | Flexbox property to align children along the cross axis. |
| `alignSelf` *(optional)* | `'auto' &#124; 'flex-start' &#124; 'center' &#124; 'flex-end' &#124; 'stretch'` | – | Overrides the alignItems value for this specific Box within its parent flex container. |
| `key` | `string]: any` | – | – |

### Function: `useBoxLogic`

```ts
useBoxLogic(props: BoxProps)
```

### Function: `useBoxStyle`

```ts
useBoxStyle(logic: any)
```

