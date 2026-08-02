---
title: "Masonry"
description: "Multi-column masonry grid."
type: "layout"
category: "content"
slug: "/ui/components/layouts/MasonryLayout/MasonryLayout"
---

# Masonry

> **Type:** `layout`  |  **Category:** `content`  |  **Tags:** `masonry` · `pinterest` · `waterfall`

Multi-column masonry grid.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, MasonryLayout, Card, Text, Stack } from '@flipova/foundation';

export default function MasonryLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <MasonryLayout
          columns={2}
          spacing={1}
          scrollable={true}
          background="transparent"
          borderRadius="none"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Masonry Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Masonry Section 2</Text>
        </Card>
      </MasonryLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `columns` | `number` | `2` | `layout` | Columns |
| `spacing` | `spacing` | `1` | `layout` | Spacing |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `background` | `color` | `transparent` | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `itemBackground` | `color` | – | `style` | Item Background |
| `itemBorderRadius` | `radius` | `none` | `style` | Item Radius |
| `padding` | `padding` | – | `layout` | Padding |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Items |


## TypeScript Logic & Hook Specifications

### Interface: `MasonryLayoutProps`

Props for the MasonryLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The React elements to render within the masonry layout. |
| `columns` *(optional)* | `number` | – | The total number of columns to divide the content into. |
| `gap` *(optional)* | `number` | – | The spacing between both columns and rows of items. |
| `key` | `string]: any` | – | – |

### Function: `useMasonryLayoutLogic`

```ts
useMasonryLayoutLogic(props: MasonryLayoutProps)
```

### Function: `useMasonryLayoutStyle`

Styles for the MasonryLayout component.

Structural choices:
- 'container' uses flex direction 'row' to arrange columns horizontally.
- 'column' uses flex direction 'column' to arrange its assigned items vertically.
- gap is applied to both container (for column spacing) and column (for item vertical spacing).


```ts
useMasonryLayoutStyle(logic: any)
```

