---
title: "FadeInWrapper"
description: "Animates its children in with a smooth opacity fade on mount."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/FadeInWrapper/FadeInWrapper"
---

# FadeInWrapper

> **Type:** `component`  |  **Category:** `general`

Animates its children in with a smooth opacity fade on mount.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, FadeInWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function FadeInWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">FadeInWrapper Example</Text>
          <FadeInWrapper
          duration={500}
          delay={0}
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







## TypeScript Logic & Hook Specifications

### Interface: `FadeInWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` *(optional)* | `number` | – | Animation duration in ms |
| `delay` *(optional)* | `number` | – | Animation delay in ms |
| `key` | `string]: any` | – | – |

### Function: `useFadeInWrapperLogic`

```ts
useFadeInWrapperLogic(props: FadeInWrapperProps)
```

### Function: `useFadeInWrapperStyle`

```ts
useFadeInWrapperStyle(logic: any)
```

