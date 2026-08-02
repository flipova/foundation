---
title: "ShimmerWrapper"
description: "Adds a shiny animated loading shimmer effect over its children."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/ShimmerWrapper/ShimmerWrapper"
---

# ShimmerWrapper

> **Type:** `component`  |  **Category:** `general`

Adds a shiny animated loading shimmer effect over its children.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, ShimmerWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function ShimmerWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">ShimmerWrapper Example</Text>
          <ShimmerWrapper
          isLoading={true}
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
| `isLoading` | `boolean` | `true` | – | Whether to show the shimmer |







## TypeScript Logic & Hook Specifications

### Interface: `ShimmerWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `isLoading` *(optional)* | `boolean` | – | Whether to show the shimmer |
| `key` | `string]: any` | – | – |

### Function: `useShimmerWrapperLogic`

```ts
useShimmerWrapperLogic(props: ShimmerWrapperProps)
```

### Function: `useShimmerWrapperStyle`

```ts
useShimmerWrapperStyle(logic: any)
```

