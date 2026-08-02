---
title: "SlideUpWrapper"
description: "Animates its children sliding up from below on mount."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/SlideUpWrapper/SlideUpWrapper"
---

# SlideUpWrapper

> **Type:** `component`  |  **Category:** `general`

Animates its children sliding up from below on mount.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SlideUpWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function SlideUpWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">SlideUpWrapper Example</Text>
          <SlideUpWrapper
          duration={500}
          delay={0}
          distance={50}
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
| `duration` | `number` | `500` | – | Animation duration in ms |
| `delay` | `number` | `0` | – | Animation delay in ms |
| `distance` | `number` | `50` | – | Distance to slide from in pixels |







## TypeScript Logic & Hook Specifications

### Interface: `SlideUpWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` *(optional)* | `number` | – | Animation duration in ms |
| `delay` *(optional)* | `number` | – | Animation delay in ms |
| `distance` *(optional)* | `number` | – | Distance to slide from in pixels |
| `key` | `string]: any` | – | – |

### Function: `useSlideUpWrapperLogic`

```ts
useSlideUpWrapperLogic(props: SlideUpWrapperProps)
```

### Function: `useSlideUpWrapperStyle`

```ts
useSlideUpWrapperStyle(logic: any)
```

