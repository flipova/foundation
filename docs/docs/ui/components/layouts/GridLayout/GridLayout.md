---
title: "Grid"
description: "Responsive grid with adaptive columns."
type: "layout"
category: "content"
slug: "/ui/components/layouts/GridLayout/GridLayout"
---

# Grid

> **Type:** `layout`  |  **Category:** `content`  |  **Tags:** `grid` · `columns` · `responsive`

Responsive grid with adaptive columns.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, GridLayout, Card, Text, Stack } from '@flipova/foundation';

export default function GridLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <GridLayout
          spacing={0}
          scrollable={false}
          padding={0}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Grid Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Grid Section 2</Text>
        </Card>
      </GridLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `columns` | `number` | – | `layout` | Number of columns (auto if omitted) |
| `cellHeight` | `number` | – | `layout` | Fixed height in px - omitted = content adaptive |
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `scrollable` | `boolean` | `false` | `behavior` | Scrollable |
| `padding` | `spacing` | `0` | `layout` | Padding |
| `itemBackground` | `color` | – | `style` | Item Background |
| `itemBorderRadius` | `radius` | `none` | `style` | Item Radius |
| `background` | `color` | `transparent` | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `compact` | `boolean` | `false` | `behavior` | Compact Mode |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Cells |


## TypeScript Logic & Hook Specifications

### Interface: `GridLayoutProps`

Props for the GridLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The React elements to render as items in the grid. |
| `columns` *(optional)* | `number` | – | The number of columns to display in the grid. Defaults to 2. |
| `gap` *(optional)* | `number` | – | The gap (spacing) between items in the grid. Defaults to 16. |
| `key` | `string]: any` | – | – |

### Function: `useGridLayoutLogic`

```ts
useGridLayoutLogic(props: GridLayoutProps)
```

### Function: `useGridLayoutStyle`

Styles for the GridLayout component.

Structural choices:
- flexWrap: 'wrap' allows children to flow onto the next row once a row is full.
- flexDirection: 'row' builds the grid from left to right.
- flexBasis dynamically calculates item width to fit `logic.columns` items per row.
- padding mimics the grid gap on individual items (native gap behavior may vary depending on React Native version and setup).


```ts
useGridLayoutStyle(logic: any)
```

