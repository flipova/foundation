---
title: "OTPInput"
description: "A multi-cell One-Time-Password input."
type: "component"
category: "general"
slug: "/ui/components/base/OTPInput/OTPInput"
---

# OTPInput

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `otp`

A multi-cell One-Time-Password input.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, OTPInput, Card, Stack, Text } from '@flipova/foundation';

export default function OTPInputExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">OTPInput Example</Text>
          <OTPInput />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `OTPInputProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `length` *(optional)* | `number` | – | The length of the OTP (number of cells) |
| `value` *(optional)* | `string` | – | Current value of the OTP |
| `onChangeText` *(optional)* | `(val: string) =&gt; void` | – | Callback when the value changes |
| `error` *(optional)* | `boolean` | – | Whether the input is in an error state |
| `errorMessage` *(optional)* | `string` | – | Error message to display |
| `onComplete` *(optional)* | `(otp: string) =&gt; void` | – | Callback fired when OTP is complete (length reached) |
| `key` | `string]: any` | – | – |

### Function: `useOTPInputLogic`

```ts
useOTPInputLogic(props: OTPInputProps)
```

### Function: `useOTPInputStyle`

```ts
useOTPInputStyle(logic: any)
```

