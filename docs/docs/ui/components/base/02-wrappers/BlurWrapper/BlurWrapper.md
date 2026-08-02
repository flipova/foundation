---
title: "BlurWrapper"
description: "Wraps children in a frosted glass/blur container."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/BlurWrapper/BlurWrapper"
---

# BlurWrapper

> **Type:** `component`  |  **Category:** `general`

Wraps children in a frosted glass/blur container.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, BlurWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function BlurWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">BlurWrapper Example</Text>
          <BlurWrapper
          intensity={50}
          tint="default"
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
| `intensity` | `number` | `50` | – | Blur intensity (1-100) |
| `tint` | `string` | `default` | – | Tint color (light, dark, default) |







## TypeScript Logic & Hook Specifications

### Interface: `BlurWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `intensity` *(optional)* | `number` | – | Blur intensity (1-100) |
| `tint` *(optional)* | `string` | – | Tint color (light, dark, default) |
| `key` | `string]: any` | – | – |

### Function: `useBlurWrapperLogic`

```ts
useBlurWrapperLogic(props: BlurWrapperProps)
```

### Function: `useBlurWrapperStyle`

```ts
useBlurWrapperStyle(logic: any)
```

