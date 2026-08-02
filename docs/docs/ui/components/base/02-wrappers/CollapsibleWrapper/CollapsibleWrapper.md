---
title: "CollapsibleWrapper"
description: "A container that smoothly expands or collapses its children height."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/CollapsibleWrapper/CollapsibleWrapper"
---

# CollapsibleWrapper

> **Type:** `component`  |  **Category:** `general`

A container that smoothly expands or collapses its children height.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, CollapsibleWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function CollapsibleWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">CollapsibleWrapper Example</Text>
          <CollapsibleWrapper
          isExpanded={false}
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
| `isExpanded` | `boolean` | `false` | – | Whether the container is expanded |







## TypeScript Logic & Hook Specifications

### Interface: `CollapsibleWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `isExpanded` *(optional)* | `boolean` | – | Whether the container is expanded |
| `key` | `string]: any` | – | – |

### Function: `useCollapsibleWrapperLogic`

```ts
useCollapsibleWrapperLogic(props: CollapsibleWrapperProps)
```

### Function: `useCollapsibleWrapperStyle`

```ts
useCollapsibleWrapperStyle(logic: any)
```

