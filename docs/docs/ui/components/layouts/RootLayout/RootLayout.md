---
title: "Root"
description: "Root page container with direct flex control. Ideal as the base of every page."
type: "layout"
category: "page"
slug: "/ui/components/layouts/RootLayout/RootLayout"
---

# Root

> **Type:** `layout`  |  **Category:** `page`  |  **Tags:** `root` · `page` · `container` · `flex`

Root page container with direct flex control. Ideal as the base of every page.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, RootLayout, Card, Text, Stack } from '@flipova/foundation';

export default function RootLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <RootLayout
          scrollable={true}
          padding={0}
          justifyContent="flex-start"
          alignItems="stretch"
          flexDirection="column"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Root Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Root Section 2</Text>
        </Card>
      </RootLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `background` | `color` | – | `style` | Background |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `padding` | `spacing` | `0` | `layout` | Padding |
| `justifyContent` | `enum` | `flex-start` | `layout` | Justify |
| `alignItems` | `enum` | `stretch` | `layout` | Align Items |
| `flexDirection` | `enum` | `column` | `layout` | Direction |
| `gap` | `number` | `0` | `layout` | Gap |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | Yes | `children` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `RootLayoutProps`

Properties for the RootLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The top-level children of the application or screen. |
| `key` | `string]: any` | – | – |

### Function: `useRootLayoutLogic`

```ts
useRootLayoutLogic(props: RootLayoutProps)
```

### Function: `useRootLayoutStyle`

```ts
useRootLayoutStyle(logic: any)
```

