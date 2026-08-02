---
title: "Center"
description: "Centers content both horizontally and vertically."
type: "primitive"
category: "primitive"
slug: "/ui/components/base/01-primitives/Center/Center"
---

# Center

> **Type:** `primitive`  |  **Category:** `primitive`  |  **Tags:** `center` · `align` · `middle`

Centers content both horizontally and vertically.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Center, Card, Stack, Text } from '@flipova/foundation';

export default function CenterExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Center Example</Text>
          <Center />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `flex` | `number` | – | `layout` | Flex |
| `bg` | `color` | – | `style` | Background |
| `p` | `spacing` | – | `layout` | Padding |
| `py` | `spacing` | – | `layout` | Padding Y |
| `width` | `number` | – | `layout` | Width |
| `height` | `number` | – | `layout` | Height |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | No | `node` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `CenterProps`

Properties for the Center component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The content to be centered horizontally and vertically. |
| `key` | `string]: any` | – | – |

### Function: `useCenterLogic`

```ts
useCenterLogic(props: CenterProps)
```

### Function: `useCenterStyle`

```ts
useCenterStyle(logic: any)
```

