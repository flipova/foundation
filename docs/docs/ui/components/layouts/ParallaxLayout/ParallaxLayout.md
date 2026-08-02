---
title: "Parallax"
description: "Horizontal scrollable rows with parallax synchronization. Items are automatically distributed into rows based on itemsPerRow."
type: "layout"
category: "scroll"
slug: "/ui/components/layouts/ParallaxLayout/ParallaxLayout"
---

# Parallax

> **Type:** `layout`  |  **Category:** `scroll`  |  **Tags:** `parallax` · `horizontal` · `sync` · `showcase`

Horizontal scrollable rows with parallax synchronization. Items are automatically distributed into rows based on itemsPerRow.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, ParallaxLayout, Card, Text, Stack } from '@flipova/foundation';

export default function ParallaxLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <ParallaxLayout
          rowCount={3}
          itemWidth={200}
          spacing={4}
          itemSpacing={12}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Parallax Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Parallax Section 2</Text>
        </Card>
      </ParallaxLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `rowCount` | `number` | `3` | `layout` | Number of Rows |
| `itemWidth` | `number` | `200` | `layout` | Item Width |
| `spacing` | `spacing` | `4` | `layout` | Vertical Spacing |
| `itemSpacing` | `number` | `12` | `layout` | Item Spacing |
| `background` | `color` | – | `style` | Background |
| `rowBackground` | `color` | – | `style` | Row Background |
| `itemBackground` | `color` | – | `style` | Item Background |
| `itemBorderRadius` | `radius` | `none` | `style` | Item Radius |
| `rowBorderRadius` | `radius` | `none` | `style` | Row Radius |
| `alternateDirection` | `boolean` | `true` | `behavior` | Alternate Direction |
| `bounces` | `boolean` | `false` | `behavior` | Scroll Bounce |
| `showScrollIndicator` | `boolean` | `false` | `behavior` | Scroll Indicator |
| `scrollEventThrottle` | `number` | `16` | `behavior` | Scroll Throttle |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Items |

## Dependencies

- `react-native-reanimated`

## TypeScript Logic & Hook Specifications

### Interface: `ParallaxLayoutProps`

Properties for the ParallaxLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `headerImage` *(optional)* | `React.ReactNode` | – | The React Node representing the header content (often an image) to display with a parallax effect. |
| `children` *(optional)* | `React.ReactNode` | – | The main content to display below the parallax header inside a scrollable area. |
| `headerHeight` *(optional)* | `number` | – | The height of the header image area in logical pixels. Defaults to 250. |
| `key` | `string]: any` | – | – |

### Function: `useParallaxLayoutLogic`

```ts
useParallaxLayoutLogic(props: ParallaxLayoutProps)
```

### Function: `useParallaxLayoutStyle`

```ts
useParallaxLayoutStyle(logic: any)
```

