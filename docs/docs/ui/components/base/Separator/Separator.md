---
title: "Separator"
description: "Visual separator with optional label."
type: "component"
category: "display"
slug: "/ui/components/base/Separator/Separator"
---

# Separator

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `separator` · `divider` · `or` · `line`

Visual separator with optional label.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Separator, Card, Stack, Text } from '@flipova/foundation';

export default function SeparatorExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Separator Example</Text>
          <Separator
          label="Label"
          thickness={1}
          spacing={4}
          orientation="horizontal"
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
| `label` | `string` | – | `content` | Label |
| `color` | `color` | – | `style` | Color |
| `thickness` | `number` | `1` | `style` | Thickness |
| `spacing` | `spacing` | `4` | `layout` | Spacing |
| `orientation` | `enum` | `horizontal` | `layout` | Orientation |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `color` | `theme.border` |
| `text` | `theme.mutedForeground` |




## TypeScript Logic & Hook Specifications

### Interface: `SeparatorProps`

Props for the Separator component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `orientation` *(optional)* | `'horizontal' &#124; 'vertical'` | – | The orientation of the separator, deciding if it renders as a line horizontally or vertically. |
| `key` | `string]: any` | – | – |

### Function: `useSeparatorLogic`

```ts
useSeparatorLogic(props: SeparatorProps)
```

### Function: `useSeparatorStyle`

```ts
useSeparatorStyle(logic: any)
```

