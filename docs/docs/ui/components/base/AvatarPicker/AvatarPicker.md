---
title: "AvatarPicker"
description: "Allows users to select an avatar from a list of predefined options or upload one."
type: "component"
category: "general"
slug: "/ui/components/base/AvatarPicker/AvatarPicker"
---

# AvatarPicker

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `picker` · `avatar`

Allows users to select an avatar from a list of predefined options or upload one.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, AvatarPicker, Card, Stack, Text } from '@flipova/foundation';

export default function AvatarPickerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">AvatarPicker Example</Text>
          <AvatarPicker />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `AvatarPickerProps`

Properties for the AvatarPicker component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onChange` *(optional)* | `(uri: string) =&gt; void` | – | Callback fired when an avatar is selected or uploaded. |
| `value` *(optional)* | `string` | – | Currently selected avatar URI. |
| `style` *(optional)* | `StyleProp&lt;ViewStyle&gt;` | – | Additional style to apply to the container. |
| `key` | `string]: any` | – | – |

### Function: `useAvatarPickerLogic`

Properties for the AvatarPicker component.
/
export interface AvatarPickerProps {
  /**
Callback fired when an avatar is selected or uploaded.


```ts
useAvatarPickerLogic(props: AvatarPickerProps)
```

### Function: `useAvatarPickerStyle`

Custom hook to generate the styles for the AvatarPicker component.


```ts
useAvatarPickerStyle(logic: any)
```

