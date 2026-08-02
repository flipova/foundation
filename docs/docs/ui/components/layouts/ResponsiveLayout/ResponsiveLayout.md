---
title: "Responsive"
description: "Adaptive layout header/sidebar/content/footer with 3 modes."
type: "layout"
category: "page"
slug: "/ui/components/layouts/ResponsiveLayout/ResponsiveLayout"
---

# Responsive

> **Type:** `layout`  |  **Category:** `page`  |  **Tags:** `responsive` · `adaptive` · `header` · `sidebar` · `footer`

Adaptive layout header/sidebar/content/footer with 3 modes.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, ResponsiveLayout, Card, Text, Stack } from '@flipova/foundation';

export default function ResponsiveLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <ResponsiveLayout
          spacing={0}
          headerHeight={60}
          sidebarWidth={260}
          footerHeight={60}
          adaptiveMode="basic"
          hideHeader={false}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Responsive Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Responsive Section 2</Text>
        </Card>
      </ResponsiveLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `headerHeight` | `number` | `60` | `layout` | Header Height |
| `sidebarWidth` | `number` | `260` | `layout` | Sidebar Width |
| `footerHeight` | `number` | `60` | `layout` | Footer Height |
| `adaptiveMode` | `enum` | `basic` | `behavior` | Adaptive Mode |
| `hideHeader` | `boolean` | `false` | `behavior` | Hide Header |
| `hideFooter` | `boolean` | `false` | `behavior` | Hide Footer |
| `collapseFooterOnTablet` | `boolean` | `false` | `behavior` | Compact Footer on Tablet |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `headerBackground` | `color` | – | `style` | Header Background |
| `sidebarBackground` | `color` | – | `style` | Sidebar Background |
| `footerBackground` | `color` | – | `style` | Footer Background |
| `contentBackground` | `color` | – | `style` | Content Background |
| `padding` | `padding` | – | `layout` | Padding |
| `contentPadding` | `padding` | – | `layout` | Content Padding |
| `mobileHeaderHeight` | `number` | `56` | `layout` | Mobile Header Height |
| `tabletFooterHeight` | `number` | `48` | `layout` | Tablet Footer Height |
| `sidebarMaxWidth` | `number` | `320` | `layout` | Sidebar Max Width |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `content` | Yes | `named` | Content |
| `header` | No | `named` | Header |
| `sidebar` | No | `named` | Sidebar |
| `footer` | No | `named` | Footer |


## TypeScript Logic & Hook Specifications

### Interface: `ResponsiveLayoutProps`

Properties for the ResponsiveLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The React nodes to be rendered inside this layout. |
| `breakpoint` *(optional)* | `number` | – | The width threshold in logical pixels above which the layout switches to desktop mode (row direction). Defaults to 768. |
| `key` | `string]: any` | – | – |

### Function: `useResponsiveLayoutLogic`

```ts
useResponsiveLayoutLogic(props: ResponsiveLayoutProps)
```

### Function: `useResponsiveLayoutStyle`

```ts
useResponsiveLayoutStyle(logic: any)
```

