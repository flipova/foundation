---
title: "BadgeWrapper"
description: "Wraps an element and places a customizable notification badge in the top right corner."
type: "component"
category: "general"
slug: "/ui/components/base/02-wrappers/BadgeWrapper/BadgeWrapper"
---

# BadgeWrapper

> **Type:** `component`  |  **Category:** `general`

Wraps an element and places a customizable notification badge in the top right corner.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, BadgeWrapper, Card, Stack, Text } from '@flipova/foundation';

export default function BadgeWrapperExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">BadgeWrapper Example</Text>
          <BadgeWrapper
          count={0}
          showZero={false}
          color="Sample"
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
| `count` | `number` | `0` | – | Number to display in badge. If 0, no badge is shown unless showZero is true. |
| `showZero` | `boolean` | `false` | – | Show badge even if count is 0 |
| `color` | `string` | `null` | – | Badge background color |







## TypeScript Logic & Hook Specifications

### Interface: `BadgeWrapperProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `count` *(optional)* | `number` | – | Number to display in badge. If 0, no badge is shown unless showZero is true. |
| `showZero` *(optional)* | `boolean` | – | Show badge even if count is 0 |
| `color` *(optional)* | `string` | – | Badge background color |
| `key` | `string]: any` | – | – |

### Function: `useBadgeWrapperLogic`

```ts
useBadgeWrapperLogic(props: BadgeWrapperProps)
```

### Function: `useBadgeWrapperStyle`

```ts
useBadgeWrapperStyle(logic: any)
```

