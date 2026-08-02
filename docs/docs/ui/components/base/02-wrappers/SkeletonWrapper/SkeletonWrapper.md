---
title: "SkeletonWrapper"
description: "A wrapper component that measures its children and displays an animated shimmering skeleton outline when loading."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/SkeletonWrapper/SkeletonWrapper"
---

# SkeletonWrapper

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `wrapper` · `loader` · `skeleton` · `shimmer`

A wrapper component that measures its children and displays an animated shimmering skeleton outline when loading.

## Use Cases

- Wrapping cards, images, or blocks of text while waiting for data.

## Structure

- Renders the children invisibly (opacity: 0) to capture their `onLayout` dimensions.
- Once measured, an absolute positioned `Animated.View` overlays a shimmering effect.



## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SkeletonWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function SkeletonWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">SkeletonWrapper Example</Text>
          <SkeletonWrapper
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
| `isLoading` *(required)* | `boolean` | – | – | Whether the component is currently loading. If true, shows skeleton. |







## TypeScript Logic & Hook Specifications

### Interface: `SkeletonWrapperProps`

Props for the SkeletonWrapper component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `isLoading` | `boolean` | – | Whether the component is currently loading. If true, shows skeleton. |
| `children` | `React.ReactNode` | – | Children elements to measure and optionally render |
| `key` | `string]: any` | – | – |

### Function: `useSkeletonWrapperLogic`

```ts
useSkeletonWrapperLogic(rawProps: SkeletonWrapperProps)
```

### Function: `useSkeletonWrapperStyle`

```ts
useSkeletonWrapperStyle(logic: any)
```

