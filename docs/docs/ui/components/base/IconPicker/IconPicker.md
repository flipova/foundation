---
title: "IconPicker"
description: "A searchable grid of icons."
type: "component"
category: "general"
slug: "/ui/components/base/IconPicker/IconPicker"
---

# IconPicker

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `picker` · `icon`

A searchable grid of icons.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, IconPicker, Card, Stack, Text } from '@flipova/foundation';

export default function IconPickerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">IconPicker Example</Text>
          <IconPicker />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `IconPickerProps`

Props for the IconPicker component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onChange` *(optional)* | `(iconName: string) =&gt; void` | – | Callback fired when an icon is selected |
| `value` *(optional)* | `string` | – | Currently selected icon |
| `style` *(optional)* | `any` | – | Custom styles |
| `key` | `string]: any` | – | – |

### Function: `useIconPickerLogic`

Props for the IconPicker component.
/
export interface IconPickerProps {
  /** Callback fired when an icon is selected */
  onChange?: (iconName: string) => void;
  /** Currently selected icon */
  value?: string;
  /** Custom styles */
  style?: any;
  /** Catch-all for other props */
  [key: string]: any;
}

/**
Logic hook for the IconPicker component.


```ts
useIconPickerLogic(props: IconPickerProps)
```

### Function: `useIconPickerStyle`

```ts
useIconPickerStyle(logic: any)
```

