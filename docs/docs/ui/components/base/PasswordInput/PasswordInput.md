---
title: "PasswordInput"
description: "A secure text input with visibility toggle."
type: "component"
category: "general"
slug: "/ui/components/base/PasswordInput/PasswordInput"
---

# PasswordInput

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `password` · `secure`

A secure text input with visibility toggle.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, PasswordInput, Card, Stack, Text } from '@flipova/foundation';

export default function PasswordInputExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">PasswordInput Example</Text>
          <PasswordInput />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `PasswordInputProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `string` | – | The current password value |
| `onChangeText` *(optional)* | `(val: string) =&gt; void` | – | Callback fired when the text changes |
| `placeholder` *(optional)* | `string` | – | Placeholder text for the input |
| `showStrengthMeter` *(optional)* | `boolean` | – | Whether to show the strength meter. Default: true |
| `style` *(optional)* | `ViewStyle` | – | Additional styling |
| `key` | `string]: any` | – | – |

### Function: `usePasswordInputLogic`

```ts
usePasswordInputLogic(props: PasswordInputProps)
```

### Function: `usePasswordInputStyle`

```ts
usePasswordInputStyle(logic: any)
```

