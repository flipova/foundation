---
title: "NumberInput"
description: "A specialized input for numbers with increment/decrement steppers."
type: "component"
category: "general"
slug: "/ui/components/base/NumberInput/NumberInput"
---

# NumberInput

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `number` · `stepper`

A specialized input for numbers with increment/decrement steppers.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, NumberInput, Card, Stack, Text } from '@flipova/foundation';

export default function NumberInputExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">NumberInput Example</Text>
          <NumberInput />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `NumberInputProps`

Props for the NumberInput component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `number` | – | The current numeric value |
| `onChange` *(optional)* | `(val: number) =&gt; void` | – | Callback when value changes |
| `min` *(optional)* | `number` | – | Minimum value allowed |
| `max` *(optional)* | `number` | – | Maximum value allowed |
| `step` *(optional)* | `number` | – | Step amount for the increment/decrement buttons |
| `allowDecimal` *(optional)* | `boolean` | – | Whether decimal values are allowed |
| `error` *(optional)* | `string` | – | Error message to display below the input |
| `key` | `string]: any` | – | – |

### Function: `useNumberInputLogic`

Props for the NumberInput component.
/
export interface NumberInputProps {
  /** The current numeric value */
  value?: number;
  /** Callback when value changes */
  onChange?: (val: number) => void;
  /** Minimum value allowed */
  min?: number;
  /** Maximum value allowed */
  max?: number;
  /** Step amount for the increment/decrement buttons */
  step?: number;
  /** Whether decimal values are allowed */
  allowDecimal?: boolean;
  /** Error message to display below the input */
  error?: string;
  /** Additional styling or wrapper props */
  [key: string]: any;
}

/**
Custom hook to encapsulate NumberInput business logic.


```ts
useNumberInputLogic(props: NumberInputProps)
```

### Function: `useNumberInputStyle`

```ts
useNumberInputStyle(logic: any)
```

