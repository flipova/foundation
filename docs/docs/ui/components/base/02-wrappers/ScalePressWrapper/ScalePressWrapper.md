---
title: "ScalePressWrapper"
description: "Wraps any element and adds a bouncy shrink effect when pressed."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/ScalePressWrapper/ScalePressWrapper"
---

# ScalePressWrapper

> **Type:** `component`  |  **Category:** `general`

Wraps any element and adds a bouncy shrink effect when pressed.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, ScalePressWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function ScalePressWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">ScalePressWrapper Example</Text>
          <ScalePressWrapper
          scaleTo={0.95}
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
| `scaleTo` | `number` | `0.95` | – | Scale factor when pressed |







## TypeScript Logic & Hook Specifications

### Interface: `ScalePressWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `scaleTo` *(optional)* | `number` | – | Scale factor when pressed |
| `key` | `string]: any` | – | – |

### Function: `useScalePressWrapperLogic`

```ts
useScalePressWrapperLogic(props: ScalePressWrapperProps)
```

### Function: `useScalePressWrapperStyle`

```ts
useScalePressWrapperStyle(logic: any)
```

