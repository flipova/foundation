---
title: "Swiper"
description: "Multi-directional swipeable carousel with preloading."
type: "layout"
category: "card"
slug: "/ui/components/layouts/SwiperLayout/SwiperLayout"
---

# Swiper

> **Type:** `layout`  |  **Category:** `card`  |  **Tags:** `swiper` · `carousel` · `slides` · `stories`

Multi-directional swipeable carousel with preloading.



## Accessibility

- ScrollView is inherently accessible, exposing the content as a single scrollable container.
- Paging enabled allows screen readers to navigate smoothly across pages.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SwiperLayout, Card, Text, Stack } from '@flipova/foundation';

export default function SwiperLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <SwiperLayout
          enableSwipeUp={false}
          enableSwipeDown={false}
          borderRadius="none"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Swiper Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Swiper Section 2</Text>
        </Card>
      </SwiperLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `enableSwipeUp` | `boolean` | `false` | `behavior` | Swipe Up |
| `enableSwipeDown` | `boolean` | `false` | `behavior` | Swipe Down |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `cardBackground` | `color` | – | `style` | Card Background |
| `cardBorderRadius` | `radius` | `none` | `style` | Card Radius |
| `showCardCount` | `boolean` | `false` | `behavior` | Card Counter |
| `preloadRange` | `number` | `2` | `behavior` | Preloading |
| `swipeThreshold` | `number` | `40` | `behavior` | Swipe Threshold |
| `padding` | `padding` | – | `layout` | Padding |
| `springDamping` | `number` | `12` | `behavior` | Spring Damping |
| `springStiffness` | `number` | `160` | `behavior` | Spring Stiffness |
| `cardCountBackground` | `color` | `rgba(0,0,0,0.6)` | `style` | Counter Background |
| `cardCountTextColor` | `color` | `#fff` | `style` | Counter Text |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Slides |

## Dependencies

- `react-native-reanimated`
- `react-native-gesture-handler`

## TypeScript Logic & Hook Specifications

### Interface: `SwiperLayoutProps`

Props for the SwiperLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The child nodes to be rendered as distinct swipable pages. |
| `key` | `string]: any` | – | – |

### Function: `useSwiperLayoutLogic`

```ts
useSwiperLayoutLogic(props: SwiperLayoutProps)
```

### Function: `useSwiperLayoutStyle`

```ts
useSwiperLayoutStyle(logic: any)
```

