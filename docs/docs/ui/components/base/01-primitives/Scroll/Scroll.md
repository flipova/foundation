---
title: "Scroll"
description: "Scrollable container."
type: "primitive"
category: "primitive"
slug: "/ui/components/base/01-primitives/Scroll/Scroll"
---

# Scroll

> **Type:** `primitive`  |  **Category:** `primitive`  |  **Tags:** `scroll` · `scrollview` · `overflow`

Scrollable container.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Scroll, Card, Stack, Text } from '@flipova/foundation';

export default function ScrollExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Scroll Example</Text>
          <Scroll
          horizontal={false}
          showsScrollIndicator={true}
          scrollEnabled={true}
        />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `horizontal` | `boolean` | `false` | `layout` | Horizontal |
| `showsScrollIndicator` | `boolean` | `true` | `behavior` | Show Indicator |
| `scrollEnabled` | `boolean` | `true` | `behavior` | Scroll Enabled |
| `bg` | `color` | – | `style` | Background |
| `p` | `spacing` | – | `layout` | Padding |
| `flex` | `number` | – | `layout` | Flex |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | No | `node` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `ScrollProps`

Properties for the Scroll component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `horizontal` *(optional)* | `boolean` | – | If true, the scroll view's children are arranged horizontally in a row. |
| `children` *(optional)* | `React.ReactNode` | – | The content to be rendered inside the scrollable view. |
| `key` | `string]: any` | – | – |

### Function: `useScrollLogic`

```ts
useScrollLogic(props: ScrollProps)
```

### Function: `useScrollStyle`

```ts
useScrollStyle(logic: any)
```

