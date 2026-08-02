---
title: "Scroll"
description: "Scrollable structure with sticky or inline header/footer."
type: "layout"
category: "scroll"
slug: "/ui/components/layouts/ScrollLayout/ScrollLayout"
---

# Scroll

> **Type:** `layout`  |  **Category:** `scroll`  |  **Tags:** `scroll` · `sticky` · `header` · `footer` · `safe-area`

Scrollable structure with sticky or inline header/footer.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, ScrollLayout, Card, Text, Stack } from '@flipova/foundation';

export default function ScrollLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <ScrollLayout
          spacing={4}
          useSafeAreaInsets={true}
          headerHeight={80}
          footerHeight={60}
          scrollDirection="vertical"
          showScrollIndicator={false}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Scroll Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Scroll Section 2</Text>
        </Card>
      </ScrollLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `spacing` | `spacing` | `4` | `layout` | Spacing |
| `useSafeAreaInsets` | `boolean` | `true` | `behavior` | Safe area |
| `headerHeight` | `number` | `80` | `layout` | Header Height |
| `footerHeight` | `number` | `60` | `layout` | Footer Height |
| `scrollDirection` | `enum` | `vertical` | `behavior` | Scroll Direction |
| `showScrollIndicator` | `boolean` | `false` | `behavior` | Scroll Indicator |
| `enableBounces` | `boolean` | `true` | `behavior` | Bounce |
| `stickyHeader` | `boolean` | `false` | `behavior` | Sticky Header |
| `stickyFooter` | `boolean` | `false` | `behavior` | Sticky Footer |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `headerBackground` | `color` | – | `style` | Header Background |
| `footerBackground` | `color` | – | `style` | Footer Background |
| `contentBackground` | `color` | – | `style` | Content Background |
| `headerPadding` | `spacing` | `4` | `layout` | Header Padding |
| `footerPadding` | `spacing` | `4` | `layout` | Footer Padding |
| `mobileHeaderHeight` | `number` | `60` | `layout` | Mobile Header Height |
| `mobileFooterHeight` | `number` | `50` | `layout` | Mobile Footer Height |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `content` | Yes | `named` | Content |
| `header` | No | `named` | Header |
| `footer` | No | `named` | Footer |


## TypeScript Logic & Hook Specifications

### Interface: `ScrollLayoutProps`

Properties for the ScrollLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The elements to be rendered inside the scroll view. |
| `horizontal` *(optional)* | `boolean` | – | If true, the layout scrolls horizontally instead of vertically. Defaults to false. |
| `key` | `string]: any` | – | – |

### Function: `useScrollLayoutLogic`

```ts
useScrollLayoutLogic(props: ScrollLayoutProps)
```

### Function: `useScrollLayoutStyle`

```ts
useScrollLayoutStyle(logic: any)
```

