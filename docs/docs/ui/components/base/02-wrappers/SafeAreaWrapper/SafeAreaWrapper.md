---
title: "SafeAreaWrapper"
description: "A convenient wrapper that applies safe area boundaries to specific sections of children."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/SafeAreaWrapper/SafeAreaWrapper"
---

# SafeAreaWrapper

> **Type:** `component`  |  **Category:** `general`

A convenient wrapper that applies safe area boundaries to specific sections of children.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SafeAreaWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function SafeAreaWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">SafeAreaWrapper Example</Text>
          <SafeAreaWrapper />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `edges` | `array` | `["top","bottom"]` | – | Edges to apply safe area (top, bottom, left, right) |







## TypeScript Logic & Hook Specifications

### Interface: `SafeAreaWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `edges` *(optional)* | `string[]` | – | Edges to apply safe area (top, bottom, left, right) |
| `key` | `string]: any` | – | – |

### Function: `useSafeAreaWrapperLogic`

```ts
useSafeAreaWrapperLogic(props: SafeAreaWrapperProps)
```

### Function: `useSafeAreaWrapperStyle`

```ts
useSafeAreaWrapperStyle(logic: any)
```

