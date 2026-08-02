---
title: "Stack"
description: "Vertical stack with consistent spacing between children."
type: "primitive"
category: "primitive"
slug: "/ui/components/base/01-primitives/Stack/Stack"
---

# Stack

> **Type:** `primitive`  |  **Category:** `primitive`  |  **Tags:** `stack` · `vertical` · `column` · `vstack`

Vertical stack with consistent spacing between children.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Stack, Card, Stack, Text } from '@flipova/foundation';

export default function StackExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Stack Example</Text>
          <Stack
          spacing={2}
          align="stretch"
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
| `spacing` | `spacing` | `2` | `layout` | Spacing |
| `align` | `enum` | – | `layout` | Align |
| `bg` | `color` | – | `style` | Background |
| `p` | `spacing` | – | `layout` | Padding |
| `flex` | `number` | – | `layout` | Flex |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | No | `node` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `StackProps`

Properties for the Stack component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `direction` *(optional)* | `'row' &#124; 'column'` | – | The axis along which to stack the children. Defaults to 'column'. |
| `gap` *(optional)* | `number` | – | The size of the gap between children. Defaults to 16. |
| `children` *(optional)* | `React.ReactNode` | – | The items to be stacked. |
| `key` | `string]: any` | – | – |

### Function: `useStackLogic`

```ts
useStackLogic(props: StackProps)
```

### Function: `useStackStyle`

```ts
useStackStyle(logic: any)
```

