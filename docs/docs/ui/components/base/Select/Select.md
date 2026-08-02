---
title: "Select"
description: "Dropdown select input with options."
type: "component"
category: "input"
slug: "/ui/components/base/Select/Select"
---

# Select

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `select` · `dropdown` · `picker` · `form`

Dropdown select input with options.





## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, Select, Card, Stack, Text, Button } from '@flipova/foundation';

export default function SelectExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Select Input</Text>
          <Select
          variant="outlined"
          size="md"
          label="Label"
          placeholder="Select..."
          error="Error message"
          disabled={false}
        value={value} onChangeText={setValue} />
          <Button variant="primary" label="Submit" onPress={() => console.log(value)} />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `variant` | `enum` | `outlined` | `style` | Variant |
| `size` | `enum` | `md` | `style` | Size |
| `label` | `string` | – | `content` | Label |
| `placeholder` | `string` | `Select...` | `content` | Placeholder |
| `error` | `string` | – | `content` | Error message |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `borderRadius` | `radius` | `md` | `style` | Border radius |
| `background` | `color` | – | `style` | Background |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `outlined` | Outlined | `&#123;"borderWidth":1&#125;` |
| `filled` | Filled | `&#123;"borderWidth":0&#125;` |

## Sizes

Supported sizes: `sm` · `md` · `lg`

```json
{
  "sm": {
    "height": 32,
    "px": 3,
    "fontSize": 13,
    "labelSize": 11
  },
  "md": {
    "height": 40,
    "px": 4,
    "fontSize": 15,
    "labelSize": 13
  },
  "lg": {
    "height": 48,
    "px": 5,
    "fontSize": 17,
    "labelSize": 14
  }
}
```

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.input` |
| `text` | `theme.foreground` |
| `border` | `theme.border` |




## TypeScript Logic & Hook Specifications

### Interface: `SelectProps`

Props for the Select component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `string` | – | The currently selected value. |
| `onValueChange` *(optional)* | `(value: string) =&gt; void` | – | Callback fired when a new option is selected. |
| `options` | `&#123; label: string` | – | List of available choices to pick from. |
| `value` | `string` | – | – |

### Function: `useSelectLogic`

```ts
useSelectLogic(props: SelectProps)
```

### Function: `useSelectStyle`

```ts
useSelectStyle(logic: any)
```

