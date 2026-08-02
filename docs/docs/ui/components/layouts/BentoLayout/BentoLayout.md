---
title: "Bento"
description: "Bento box grid with varied cell sizes."
type: "layout"
category: "content"
slug: "/ui/components/layouts/BentoLayout/BentoLayout"
---

# Bento

> **Type:** `layout`  |  **Category:** `content`  |  **Tags:** `bento` · `grid` · `mosaic` · `dashboard`

Bento box grid with varied cell sizes.

## Use Cases

- Dashboards displaying varying widgets (charts, stats, lists).
- Portfolios or media galleries requiring dynamic grid weighting.

## Structure

- Employs a flex-wrap row container to flow items continuously.
- Wraps each child in a container that simulates bento sizing (large, medium, or small)
- based on its positional index.

## Accessibility

- The semantic ordering matches the visual DOM flow.
- Content should be naturally understandable in sequential order.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, BentoLayout, Card, Text, Stack } from '@flipova/foundation';

export default function BentoLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <BentoLayout
          spacing={2}
          itemBorderRadius="none"
          scrollable={true}
          maxWidth={1200}
          baseHeight={200}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Bento Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Bento Section 2</Text>
        </Card>
      </BentoLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `spacing` | `spacing` | `2` | `layout` | Spacing |
| `itemBackground` | `color` | – | `style` | Item Background |
| `itemBorderRadius` | `radius` | `none` | `style` | Item Radius |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `maxWidth` | `number` | `1200` | `layout` | Max Width |
| `baseHeight` | `number` | `200` | `layout` | Base Height |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `cellConfig` | `json` | `[]` | `content` | Cell Config |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Items |


## TypeScript Logic & Hook Specifications

### Interface: `BentoLayoutProps`

Props for the BentoLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The grid items to be displayed in the bento layout. |
| `gap` *(optional)* | `number` | – | The spacing gap between bento items, measured in pixels. Controls both the row and column gaps equivalently. |
| `key` | `string]: any` | – | – |

### Function: `useBentoLayoutLogic`

```ts
useBentoLayoutLogic(props: BentoLayoutProps)
```

### Function: `useBentoLayoutStyle`

```ts
useBentoLayoutStyle(logic: any)
```

