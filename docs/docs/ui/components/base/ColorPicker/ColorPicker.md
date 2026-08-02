---
title: "ColorPicker"
description: "A visual grid of color swatches for choosing a theme or element color."
type: "component"
category: "general"
slug: "/ui/components/base/ColorPicker/ColorPicker"
---

# ColorPicker

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `picker` · `color`

A visual grid of color swatches for choosing a theme or element color.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, ColorPicker, Card, Stack, Text } from '@flipova/foundation';

export default function ColorPickerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">ColorPicker Example</Text>
          <ColorPicker />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `ColorPickerProps`

Properties for the ColorPicker component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onChange` *(optional)* | `(color: string) =&gt; void` | – | Callback fired when a color is selected. |
| `value` *(optional)* | `string` | `"#FF0000"` | Currently selected color in hex format. |
| `style` *(optional)* | `StyleProp&lt;ViewStyle&gt;` | – | Additional style to apply to the container. |
| `key` | `string]: any` | – | – |

### Function: `useColorPickerLogic`

Properties for the ColorPicker component.
/
export interface ColorPickerProps {
  /**
Callback fired when a color is selected.


```ts
useColorPickerLogic(props: ColorPickerProps)
```

### Function: `useColorPickerStyle`

Custom hook to generate the styles for the ColorPicker component.


```ts
useColorPickerStyle(logic: any)
```

