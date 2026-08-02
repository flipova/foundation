---
title: "Collapsible Header"
description: "Header that shrinks on scroll with main content."
type: "layout"
category: "scroll"
slug: "/ui/components/layouts/HeaderContentLayout/HeaderContentLayout"
---

# Collapsible Header

> **Type:** `layout`  |  **Category:** `scroll`  |  **Tags:** `header` · `collapsible` · `scroll` · `parallax`

Header that shrinks on scroll with main content.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, HeaderContentLayout, Card, Text, Stack } from '@flipova/foundation';

export default function HeaderContentLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <HeaderContentLayout
          headerHeight={150}
          headerCollapsedHeight={60}
          spacing={0}
          headerBorderRadius="none"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Collapsible Header Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Collapsible Header Section 2</Text>
        </Card>
      </HeaderContentLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `headerHeight` | `number` | `150` | `layout` | Header Height |
| `headerCollapsedHeight` | `number` | `60` | `layout` | Collapsed Header Height |
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `headerBackground` | `color` | – | `style` | Header Background |
| `headerBorderRadius` | `radius` | `none` | `style` | Header Radius |
| `contentBackground` | `color` | – | `style` | Content Background |
| `contentBorderRadius` | `radius` | `none` | `style` | Content Radius |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `padding` | `spacing` | `5` | `layout` | Content Padding |
| `headerPadding` | `spacing` | `5` | `layout` | Header Padding |
| `scrollEventThrottle` | `number` | `16` | `behavior` | Scroll Throttle event |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `header` | `theme.card` |
| `content` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `header` | Yes | `named` | Header |
| `content` | Yes | `named` | Content |

## Dependencies

- `react-native-reanimated`

## TypeScript Logic & Hook Specifications

### Interface: `HeaderContentLayoutProps`

Props for the HeaderContentLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `header` *(optional)* | `React.ReactNode` | – | The React element to display in the fixed header area at the top. |
| `children` *(optional)* | `React.ReactNode` | – | The main React elements to display in the flexible content area below the header. |
| `key` | `string]: any` | – | – |

### Function: `useHeaderContentLayoutLogic`

```ts
useHeaderContentLayoutLogic(props: HeaderContentLayoutProps)
```

### Function: `useHeaderContentLayoutStyle`

Styles for the HeaderContentLayout component.

Structural choices:
- 'container' uses column flex direction to naturally stack the header above the content.
- 'header' uses zIndex: 5 so that shadows or overlays from the header appear above the content.
- 'content' uses flex: 1 to consume all vertical space remaining after the header is rendered.


```ts
useHeaderContentLayoutStyle(logic: any)
```

