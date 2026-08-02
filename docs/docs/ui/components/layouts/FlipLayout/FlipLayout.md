---
title: "Flip"
description: "Carousel with front/back flip and horizontal swipe."
type: "layout"
category: "card"
slug: "/ui/components/layouts/FlipLayout/FlipLayout"
---

# Flip

> **Type:** `layout`  |  **Category:** `card`  |  **Tags:** `flip` · `card` · `recto-verso` · `flashcard`

Carousel with front/back flip and horizontal swipe.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, FlipLayout, Card, Text, Stack } from '@flipova/foundation';

export default function FlipLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <FlipLayout
          borderRadius="none"
          flipPerspective={1200}
          swipeThreshold={40}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Flip Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Flip Section 2</Text>
        </Card>
      </FlipLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `maxWidth` | `number` | – | `layout` | Max Width |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `cardBackground` | `color` | – | `style` | Card Background |
| `flipPerspective` | `number` | `1200` | `layout` | Flip Perspective |
| `swipeThreshold` | `number` | `40` | `behavior` | Swipe Threshold |
| `padding` | `padding` | – | `layout` | Padding |
| `cardBorderRadius` | `radius` | `20` | `style` | Card Radius |
| `cardAspectRatio` | `number` | `0.5625` | `layout` | Width/height ratio on web - omitted = adaptive |
| `cardMaxHeight` | `number` | – | `layout` | Max height in px - omitted = no limit |
| `dezoomDuration` | `number` | `120` | `behavior` | Zoom Out Duration |
| `flipDuration` | `number` | `320` | `behavior` | Flip Duration |
| `slideOutDuration` | `number` | `140` | `behavior` | Slide Out Duration |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Front Faces |
| `backContent` | No | `named-array` | Back Faces |

## Dependencies

- `react-native-reanimated`
- `react-native-gesture-handler`

## TypeScript Logic & Hook Specifications

### Interface: `FlipLayoutProps`

Props for the FlipLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `front` *(optional)* | `React.ReactNode` | – | The React node to render on the front side of the layout. |
| `back` *(optional)* | `React.ReactNode` | – | The React node to render on the back side of the layout. |
| `key` | `string]: any` | – | – |

### Function: `useFlipLayoutLogic`

```ts
useFlipLayoutLogic(props: FlipLayoutProps)
```

### Function: `useFlipLayoutStyle`

Styles for the FlipLayout component.

Structural choices:
- The container centers its children content.
- 'card' styling defines full width/height taking advantage of absolute positioning from logic.
- 'backfaceVisibility: hidden' ensures that the reversed views do not show their mirrored content during rotation.


```ts
useFlipLayoutStyle(logic: any)
```

