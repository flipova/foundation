---
title: "Gradient"
description: "Linear gradient background container."
type: "component"
category: "display"
slug: "/ui/components/base/Gradient/Gradient"
---

# Gradient

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `gradient` · `linear` · `background` · `color`

Linear gradient background container.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Gradient, Card, Stack, Text } from '@flipova/foundation';

export default function GradientExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Gradient Example</Text>
          <Gradient
          startColor="#3b82f6"
          endColor="#8b5cf6"
          direction="vertical"
          borderRadius="none"
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
| `startColor` | `color` | `#3b82f6` | `style` | Start color |
| `endColor` | `color` | `#8b5cf6` | `style` | End color |
| `direction` | `enum` | `vertical` | `style` | Direction |
| `borderRadius` | `radius` | `none` | `style` | Border radius |
| `height` | `number` | – | `layout` | Height |
| `padding` | `spacing` | – | `layout` | Padding |







## TypeScript Logic & Hook Specifications

### Interface: `GradientProps`

Props for the Gradient component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `colors` | `string[]` | – | An array of colors that represent the stops in the gradient. e.g., ['#ff0000', '#00ff00'] |

### Function: `useGradientLogic`

```ts
useGradientLogic(props: GradientProps)
```

### Function: `useGradientStyle`

```ts
useGradientStyle(logic: any)
```

