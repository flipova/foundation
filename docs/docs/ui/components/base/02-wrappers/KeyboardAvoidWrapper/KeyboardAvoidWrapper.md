---
title: "KeyboardAvoidWrapper"
description: "Automatically handles keyboard layout shifting for its wrapped children."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/KeyboardAvoidWrapper/KeyboardAvoidWrapper"
---

# KeyboardAvoidWrapper

> **Type:** `component`  |  **Category:** `general`

Automatically handles keyboard layout shifting for its wrapped children.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, KeyboardAvoidWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function KeyboardAvoidWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">KeyboardAvoidWrapper Example</Text>
          <KeyboardAvoidWrapper
          offset={20}
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
| `offset` | `number` | `20` | – | Extra offset above keyboard |







## TypeScript Logic & Hook Specifications

### Interface: `KeyboardAvoidWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `offset` *(optional)* | `number` | – | Extra offset above keyboard |
| `key` | `string]: any` | – | – |

### Function: `useKeyboardAvoidWrapperLogic`

```ts
useKeyboardAvoidWrapperLogic(props: KeyboardAvoidWrapperProps)
```

### Function: `useKeyboardAvoidWrapperStyle`

```ts
useKeyboardAvoidWrapperStyle(logic: any)
```

