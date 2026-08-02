---
title: "TooltipWrapper"
description: "Wraps a component and displays a tooltip bubble near it."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/TooltipWrapper/TooltipWrapper"
---

# TooltipWrapper

> **Type:** `component`  |  **Category:** `general`

Wraps a component and displays a tooltip bubble near it.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, TooltipWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function TooltipWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">TooltipWrapper Example</Text>
          <TooltipWrapper
          text="Sample"
          isVisible={false}
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
| `text` | `string` | `null` | – | Tooltip text |
| `isVisible` | `boolean` | `false` | – | Whether tooltip is visible |







## TypeScript Logic & Hook Specifications

### Interface: `TooltipWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `text` *(optional)* | `string` | – | Tooltip text |
| `isVisible` *(optional)* | `boolean` | – | Whether tooltip is visible |
| `key` | `string]: any` | – | – |

### Function: `useTooltipWrapperLogic`

```ts
useTooltipWrapperLogic(props: TooltipWrapperProps)
```

### Function: `useTooltipWrapperStyle`

```ts
useTooltipWrapperStyle(logic: any)
```

