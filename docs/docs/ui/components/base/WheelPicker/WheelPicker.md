---
title: "WheelPicker"
description: "A scrollable barrel wheel picker. If items exceed maxItemsInWheel, a 'More...' option opens a submenu modal."
type: "component"
category: "general"
slug: "/ui/components/base/WheelPicker/WheelPicker"
---

# WheelPicker

> **Type:** `component`  |  **Category:** `general`

A scrollable barrel wheel picker. If items exceed maxItemsInWheel, a "More..." option opens a submenu modal.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, WheelPicker, Card, Stack, Text } from '@flipova/foundation';

export default function WheelPickerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">WheelPicker Example</Text>
          <WheelPicker
          value="Sample"
          itemHeight={40}
          maxItemsInWheel={5}
          moreLabel="Plus..."
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
| `items` *(required)* | `array` | – | – | Array of items to pick from &#123; label, value &#125; |
| `value` | `string` | – | – | Currently selected value |
| `itemHeight` | `number` | `40` | – | Height of a single item in pixels |
| `maxItemsInWheel` | `number` | `5` | – | Maximum number of items to show in the wheel before moving the rest to a submenu |
| `moreLabel` | `string` | `Plus...` | – | Label for the "More..." option |







## TypeScript Logic & Hook Specifications

### Interface: `WheelPickerItem`

Represents a single item in the WheelPicker


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | – | Display text for the item |
| `value` | `string` | – | Unique value identifying the item |

### Interface: `WheelPickerProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `WheelPickerItem[]` | – | Array of items to pick from |
| `value` *(optional)* | `string` | – | Currently selected value |
| `onChange` *(optional)* | `(value: string) =&gt; void` | – | Callback fired when an item is selected |
| `itemHeight` *(optional)* | `number` | – | Height of a single item in pixels (default: 44) |
| `maxItemsInWheel` *(optional)* | `number` | – | Maximum number of items to show in the wheel before moving the rest to a submenu (default: 7) |
| `moreLabel` *(optional)* | `string` | – | Label for the "More..." option (default: 'More...') |
| `key` | `string]: any` | – | – |

### Function: `useWheelPickerLogic`

Represents a single item in the WheelPicker
/
export interface WheelPickerItem {
  /** Display text for the item */
  label: string;
  /** Unique value identifying the item */
  value: string;
}

export interface WheelPickerProps {
  /** Array of items to pick from */
  items: WheelPickerItem[];
  /** Currently selected value */
  value?: string;
  /** Callback fired when an item is selected */
  onChange?: (value: string) => void;
  /** Height of a single item in pixels (default: 44) */
  itemHeight?: number;
  /** Maximum number of items to show in the wheel before moving the rest to a submenu (default: 7) */
  maxItemsInWheel?: number;
  /** Label for the "More..." option (default: 'More...') */
  moreLabel?: string;
  /** Additional styling or container props */
  [key: string]: any;
}

/**
Custom hook to encapsulate WheelPicker business logic.


```ts
useWheelPickerLogic(props: WheelPickerProps)
```

### Function: `useWheelPickerStyle`

```ts
useWheelPickerStyle(logic: any)
```

