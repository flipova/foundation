---
title: "Swipe to Screen"
description: "Presentation layout with swipe to a projected screen and QR code."
type: "layout"
category: "special"
slug: "/ui/components/layouts/Swipe2ScreenLayout/Swipe2ScreenLayout"
---

# Swipe to Screen

> **Type:** `layout`  |  **Category:** `special`  |  **Tags:** `swipe` · `projection` · `qr` · `slides`

Presentation layout with swipe to a projected screen and QR code.



## Accessibility

- Includes standard horizontal ScrollView accessibility.
- Screen content should dictate their own accessibility roles.
- Paging enabled for easy traversal between the two sections.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Swipe2ScreenLayout, Card, Text, Stack } from '@flipova/foundation';

export default function Swipe2ScreenLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Swipe2ScreenLayout
          containerBackground="#000"
          screenBackground="#fff"
          swipeThreshold={100}
          projectedScale={0.8}
          animationDuration={300}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Swipe to Screen Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Swipe to Screen Section 2</Text>
        </Card>
      </Swipe2ScreenLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `containerBackground` | `color` | `#000` | `style` | Container Background |
| `screenBackground` | `color` | `#fff` | `style` | Screen Background |
| `swipeThreshold` | `number` | `100` | `behavior` | Swipe Threshold |
| `projectedScale` | `ratio` | `0.8` | `behavior` | Projected Scale |
| `animationDuration` | `number` | `300` | `behavior` | Animation Duration |
| `slides` | `json` | `[]` | `content` | Slides |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `items` | Yes | `items` | Slides |

## Dependencies

- `react-native-gesture-handler`
- `expo-camera`
- `expo-haptics`

## TypeScript Logic & Hook Specifications

### Interface: `Swipe2ScreenLayoutProps`

Props for the Swipe2ScreenLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `screen1` *(optional)* | `React.ReactNode` | – | The React node representing the content of the first screen (left side). |
| `screen2` *(optional)* | `React.ReactNode` | – | The React node representing the content of the second screen (right side). |
| `key` | `string]: any` | – | – |

### Function: `useSwipe2ScreenLayoutLogic`

```ts
useSwipe2ScreenLayoutLogic(props: Swipe2ScreenLayoutProps)
```

### Function: `useSwipe2ScreenLayoutStyle`

```ts
useSwipe2ScreenLayoutStyle(logic: any)
```

