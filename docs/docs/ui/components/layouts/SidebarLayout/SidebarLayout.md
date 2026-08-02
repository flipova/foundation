---
title: "Sidebar"
description: "Content with lateral sidebar, collapsible on mobile."
type: "layout"
category: "navigation"
slug: "/ui/components/layouts/SidebarLayout/SidebarLayout"
---

# Sidebar

> **Type:** `layout`  |  **Category:** `navigation`  |  **Tags:** `sidebar` · `navigation` · `drawer` · `layout`

Content with lateral sidebar, collapsible on mobile.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SidebarLayout, Card, Text, Stack } from '@flipova/foundation';

export default function SidebarLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <SidebarLayout
          sidebarWidth={280}
          position="left"
          collapsible={true}
          spacing={4}
          scrollable={true}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Sidebar Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Sidebar Section 2</Text>
        </Card>
      </SidebarLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `sidebarWidth` | `number` | `280` | `layout` | Sidebar Width |
| `position` | `enum` | `left` | `layout` | Sidebar Position |
| `collapsible` | `boolean` | `true` | `behavior` | Collapsible on Mobile |
| `spacing` | `spacing` | `4` | `layout` | Spacing |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `background` | `background` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `sidebarBackground` | `background` | – | `style` | Sidebar Background |
| `sidebarBorderRadius` | `radius` | `none` | `style` | Sidebar Radius |
| `padding` | `padding` | – | `layout` | Padding |
| `resizable` | `boolean` | `false` | `behavior` | Resizable |
| `sidebarMinWidth` | `number` | `150` | `layout` | Min Sidebar Width |
| `sidebarMaxWidth` | `number` | `600` | `layout` | Sidebar Max Width |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `sidebar` | `theme.card` |
| `border` | `theme.border` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `sidebar` | Yes | `named` | Sidebar |
| `content` | Yes | `named` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `SidebarLayoutProps`

Properties for the SidebarLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sidebar` *(optional)* | `React.ReactNode` | – | The React node to render inside the sidebar pane. |
| `children` *(optional)* | `React.ReactNode` | – | The main content node to render in the primary pane. |
| `sidebarPosition` *(optional)* | `'left' &#124; 'right'` | – | Determines whether the sidebar appears on the 'left' or 'right'. Defaults to 'left'. |
| `sidebarWidth` *(optional)* | `number` | – | The width of the sidebar in logical pixels. Defaults to 250. |
| `key` | `string]: any` | – | – |

### Function: `useSidebarLayoutLogic`

```ts
useSidebarLayoutLogic(props: SidebarLayoutProps)
```

### Function: `useSidebarLayoutStyle`

```ts
useSidebarLayoutStyle(logic: any)
```

