---
title: "Top Drawer"
description: "Animated top drawer with swipe gesture."
type: "layout"
category: "navigation"
slug: "/ui/components/layouts/TopDrawerLayout/TopDrawerLayout"
---

# Top Drawer

> **Type:** `layout`  |  **Category:** `navigation`  |  **Tags:** `drawer` · `top-sheet` · `swipe` · `notification`

Animated top drawer with swipe gesture.



## Accessibility

- The overlay acts as a Pressable to close the drawer and includes an accessibilityRole and label.
- Drawer content can be read by screen readers when active.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, TopDrawerLayout, Card, Text, Stack } from '@flipova/foundation';

export default function TopDrawerLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <TopDrawerLayout
          drawerHeight={600}
          scrollable={true}
          drawerBorderRadius="3xl"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Top Drawer Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Top Drawer Section 2</Text>
        </Card>
      </TopDrawerLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `drawerHeight` | `number` | `600` | `layout` | Drawer Height |
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
| `closeButtonBackground` | `color` | – | `style` | Close Button Background |
| `closeButtonSize` | `number` | `36` | `layout` | Close Button Size |
| `closeButtonBorderColor` | `color` | – | `style` | Close Button Border |
| `closeButtonTextColor` | `color` | – | `style` | Close Button Text |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `drawer` | `theme.background` |
| `border` | `theme.border` |
| `muted` | `theme.muted` |


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

### Interface: `TopDrawerLayoutProps`

Props for the TopDrawerLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `drawer` *(optional)* | `React.ReactNode` | – | The content to display inside the drawer panel when it is open. |
| `children` *(optional)* | `React.ReactNode` | – | The primary screen content behind the drawer. |
| `isOpen` *(optional)* | `boolean` | – | Controls whether the top drawer is currently visible. |
| `onClose` *(optional)* | `() =&gt; void` | – | Callback fired when the user taps the background overlay to dismiss the drawer. |
| `key` | `string]: any` | – | – |

### Function: `useTopDrawerLayoutLogic`

```ts
useTopDrawerLayoutLogic(props: TopDrawerLayoutProps)
```

### Function: `useTopDrawerLayoutStyle`

```ts
useTopDrawerLayoutStyle(logic: any)
```

