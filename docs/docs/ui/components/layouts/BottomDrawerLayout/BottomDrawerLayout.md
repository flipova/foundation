---
title: "Bottom Drawer"
description: "Animated bottom drawer with swipe gesture."
type: "layout"
category: "navigation"
slug: "/ui/components/layouts/BottomDrawerLayout/BottomDrawerLayout"
---

# Bottom Drawer

> **Type:** `layout`  |  **Category:** `navigation`  |  **Tags:** `drawer` · `bottom-sheet` · `swipe` · `modal`

Animated bottom drawer with swipe gesture.

## Use Cases

- Displaying secondary contextual actions or menus.
- Presenting supplementary information without navigating away from the main screen.

## Structure

- A main content container (flex: 1).
- A semi-transparent overlay covering the screen when the drawer is open (captures taps to close).
- A bottom-anchored drawer container holding the drawer content.

## Accessibility

- The overlay acts as a dismiss button. It should properly describe its "close" action to screen readers.
- When open, focus should ideally be trapped within the drawer or immediately directed to it.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, BottomDrawerLayout, Card, Text, Stack } from '@flipova/foundation';

export default function BottomDrawerLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <BottomDrawerLayout
          drawerHeight={400}
          scrollable={true}
          drawerBorderRadius="3xl"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Bottom Drawer Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Bottom Drawer Section 2</Text>
        </Card>
      </BottomDrawerLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `drawerHeight` | `number` | `400` | `layout` | Drawer Height |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `drawerBackground` | `color` | – | `style` | Drawer Background |
| `drawerBorderRadius` | `radius` | `3xl` | `style` | Drawer Radius |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `defaultOpen` | `boolean` | `false` | `behavior` | Open by Default |
| `handleColor` | `color` | – | `style` | Handle Color |
| `backdropOpacity` | `ratio` | `0.4` | `style` | Backdrop Opacity |
| `contentScaleWhenOpen` | `ratio` | `0.95` | `behavior` | Open Content Scale |
| `handleBarColor` | `color` | – | `style` | Handle Bar Color |
| `handleButtonSize` | `number` | `56` | `layout` | Handle Button Size |



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
| `content` | Yes | `named` | Main content |
| `drawerContent` | Yes | `named` | Drawer content |

## Dependencies

- `react-native-reanimated`
- `react-native-gesture-handler`
- `expo-haptics`

## TypeScript Logic & Hook Specifications

### Interface: `BottomDrawerLayoutProps`

Props for the BottomDrawerLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `drawer` *(optional)* | `React.ReactNode` | – | The content to display inside the bottom drawer when it is open. |
| `children` *(optional)* | `React.ReactNode` | – | The primary screen content displayed behind the drawer. |
| `isOpen` *(optional)* | `boolean` | – | Determines whether the drawer is currently visible (true) or hidden (false). |
| `onClose` *(optional)* | `() =&gt; void` | – | Callback invoked when the user taps the background overlay to dismiss the drawer. |
| `key` | `string]: any` | – | – |

### Function: `useBottomDrawerLayoutLogic`

```ts
useBottomDrawerLayoutLogic(props: BottomDrawerLayoutProps)
```

### Function: `useBottomDrawerLayoutStyle`

```ts
useBottomDrawerLayoutStyle(logic: any)
```

