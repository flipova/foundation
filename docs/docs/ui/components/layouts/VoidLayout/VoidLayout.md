---
title: "Void"
description: "Minimal container with optional scroll, padding, and maxWidth."
type: "layout"
category: "page"
slug: "/ui/components/layouts/VoidLayout/VoidLayout"
---

# Void

> **Type:** `layout`  |  **Category:** `page`  |  **Tags:** `blank` · `empty` · `minimal` · `wrapper`

Minimal container with optional scroll, padding, and maxWidth.



## Accessibility

- Purely transparent container, no inherent accessibility role, leaving it to its children.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, VoidLayout, Card, Text, Stack } from '@flipova/foundation';

export default function VoidLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <VoidLayout
          scrollable={true}
          borderRadius="none"
          spacing={0}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Void Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Void Section 2</Text>
        </Card>
      </VoidLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `maxWidth` | `number` | – | `layout` | Maximum container width |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `padding` | `padding` | – | `layout` | Padding |
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `centerContent` | `boolean` | `false` | `layout` | Center Content |
| `showBorder` | `boolean` | `false` | `style` | Visible Border |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | Yes | `children` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `VoidLayoutProps`

Props for the VoidLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | Content to render inside the raw unstyled container. |
| `key` | `string]: any` | – | – |

### Function: `useVoidLayoutLogic`

```ts
useVoidLayoutLogic(props: VoidLayoutProps)
```

### Function: `useVoidLayoutStyle`

```ts
useVoidLayoutStyle(logic: any)
```

