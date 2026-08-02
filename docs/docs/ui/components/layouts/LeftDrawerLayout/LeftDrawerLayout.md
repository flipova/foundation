---
title: "Left Drawer"
description: "Animated left lateral drawer with swipe gesture."
type: "layout"
category: "navigation"
slug: "/ui/components/layouts/LeftDrawerLayout/LeftDrawerLayout"
---

# Left Drawer

> **Type:** `layout`  |  **Category:** `navigation`  |  **Tags:** `drawer` · `side-menu` · `swipe` · `navigation`

Animated left lateral drawer with swipe gesture.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, LeftDrawerLayout, Card, Text, Stack } from '@flipova/foundation';

export default function LeftDrawerLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <LeftDrawerLayout
          drawerWidth={280}
          scrollable={true}
          drawerBorderRadius="none"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Left Drawer Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Left Drawer Section 2</Text>
        </Card>
      </LeftDrawerLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `drawerWidth` | `number` | `280` | `layout` | Drawer Width |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `drawerBackground` | `color` | – | `style` | Drawer Background |
| `drawerBorderRadius` | `radius` | `none` | `style` | Drawer Radius |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `defaultOpen` | `boolean` | `false` | `behavior` | Open by Default |
| `handleColor` | `color` | – | `style` | Handle Color |
| `backdropOpacity` | `ratio` | `0.4` | `style` | Backdrop Opacity |
| `contentScaleWhenOpen` | `ratio` | `0.98` | `behavior` | Open Content Scale |
| `handleBarColor` | `color` | – | `style` | Handle Bar Color |
| `handleBarWidth` | `number` | `40` | `layout` | Gesture Zone Width |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `drawer` | `theme.background` |
| `accent` | `theme.primary` |
| `border` | `theme.border` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `content` | Yes | `named` | Main Content |
| `drawerContent` | Yes | `named` | Drawer Content |

## Dependencies

- `react-native-reanimated`
- `react-native-gesture-handler`
- `expo-haptics`

## TypeScript Logic & Hook Specifications

### Interface: `LeftDrawerLayoutProps`

Props for the LeftDrawerLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `drawer` *(optional)* | `React.ReactNode` | – | The React elements to display inside the drawer panel when it is open. |
| `children` *(optional)* | `React.ReactNode` | – | The main screen content to display beneath the drawer. |
| `isOpen` *(optional)* | `boolean` | – | A boolean indicating whether the drawer is currently open and visible. |
| `onClose` *(optional)* | `() =&gt; void` | – | A callback function invoked when the overlay backdrop is pressed to close the drawer. |
| `key` | `string]: any` | – | – |

### Function: `useLeftDrawerLayoutLogic`

```ts
useLeftDrawerLayoutLogic(props: LeftDrawerLayoutProps)
```

### Function: `useLeftDrawerLayoutStyle`

Styles for the LeftDrawerLayout component.

Structural choices:
- 'container' acts as the main wrapper, filling available space with flex: 1.
- 'overlay' covers the entire screen absolutely using top/bottom/left/right: 0, with a semi-transparent black background. It sits above the main content (zIndex: 10).
- 'drawer' is absolutely positioned on the left side, with a fixed width, and sits above the overlay (zIndex: 20).


```ts
useLeftDrawerLayoutStyle(logic: any)
```

