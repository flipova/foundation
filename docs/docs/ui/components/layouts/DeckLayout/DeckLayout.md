---
title: "Deck"
description: "Swipeable card stack with depth effect."
type: "layout"
category: "card"
slug: "/ui/components/layouts/DeckLayout/DeckLayout"
---

# Deck

> **Type:** `layout`  |  **Category:** `card`  |  **Tags:** `deck` · `cards` · `swipe` · `tinder` · `stack`

Swipeable card stack with depth effect.

## Use Cases

- Discovery interfaces (matching apps, product discovery).
- Flashcards or bite-sized educational content.

## Structure

- Cards are stacked absolutely on top of each other in the center of the screen.
- Uses Reanimated and Gesture Handler to track pans and animate standard deck interactions.
- Z-index is dynamically assigned to keep the active card on top and scaled correctly.

## Accessibility

- Swiping actions should have accessible alternative buttons for users with motor impairments.
- The active card must clearly announce its contents. Hidden cards should ideally have `importantForAccessibility="no"`.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, DeckLayout, Card, Text, Stack } from '@flipova/foundation';

export default function DeckLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <DeckLayout
          peekOffset={12}
          peekScale={0.05}
          cycle={false}
          cardShadow={true}
          cardBorderRadius={24}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Deck Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Deck Section 2</Text>
        </Card>
      </DeckLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `peekOffset` | `number` | `12` | `layout` | Peek Offset |
| `peekScale` | `ratio` | `0.05` | `layout` | Peek Scale |
| `cycle` | `boolean` | `false` | `behavior` | Loop |
| `cardShadow` | `boolean` | `true` | `style` | Card Shadows |
| `cardBackground` | `color` | – | `style` | Card Background |
| `cardBorderRadius` | `radius` | `24` | `style` | Card Radius |
| `containerWidth` | `string` | `90%` | `layout` | Container Width |
| `containerHeight` | `string` | `75%` | `layout` | Container Height |
| `peekCount` | `number` | `2` | `layout` | Background Cards |
| `peekRotation` | `number` | `0` | `layout` | Peek Rotation |
| `direction` | `enum` | `horizontal` | `behavior` | Direction |
| `background` | `color` | – | `style` | Background |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Cards |

## Dependencies

- `react-native-reanimated`
- `react-native-gesture-handler`
- `expo-haptics`

## TypeScript Logic & Hook Specifications

### Interface: `DeckLayoutProps`

Props for the DeckLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The individual cards to be rendered within the deck stack. Each child represents a swipable card. |
| `key` | `string]: any` | – | – |

### Function: `useDeckLayoutLogic`

```ts
useDeckLayoutLogic(props: DeckLayoutProps)
```

### Function: `useDeckLayoutStyle`

```ts
useDeckLayoutStyle(logic: any)
```

