---
title: "Inline"
description: "Horizontal row with spacing and alignment."
type: "primitive"
category: "primitive"
slug: "/ui/components/base/01-primitives/Inline/Inline"
---

# Inline

> **Type:** `primitive`  |  **Category:** `primitive`  |  **Tags:** `inline` · `horizontal` · `row` · `hstack`

Horizontal row with spacing and alignment.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Inline, Card, Stack, Text } from '@flipova/foundation';

export default function InlineExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Inline Example</Text>
          <Inline
          spacing={2}
          align="stretch"
          justify="flex-start"
          wrap={false}
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
| `justify` | `enum` | – | `layout` | Justify |
| `wrap` | `boolean` | `false` | `layout` | Wrap |
| `bg` | `color` | – | `style` | Background |
| `p` | `spacing` | – | `layout` | Padding |
| `flex` | `number` | – | `layout` | Flex |
| `fillWidth` | `boolean` | `false` | `layout` | Fill Width |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | No | `node` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `InlineProps`

Properties for the Inline component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `gap` *(optional)* | `number` | – | The spacing between children items. Uses React Native gap. Defaults to 8. |
| `children` *(optional)* | `React.ReactNode` | – | The items to be laid out horizontally with wrapping. |
| `key` | `string]: any` | – | – |

### Function: `useInlineLogic`

```ts
useInlineLogic(props: InlineProps)
```

### Function: `useInlineStyle`

```ts
useInlineStyle(logic: any)
```

