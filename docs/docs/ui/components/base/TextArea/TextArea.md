---
title: "Text Area"
description: "Multi-line text input."
type: "component"
category: "input"
slug: "/ui/components/base/TextArea/TextArea"
---

# Text Area

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `textarea` · `multiline` · `input` · `form`

Multi-line text input.





## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, TextArea, Card, Stack, Text, Button } from '@flipova/foundation';

export default function TextAreaExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Text Area Input</Text>
          <TextArea
          variant="outlined"
          size="md"
          placeholder="Placeholder"
          label="Label"
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
| `placeholder` | `string` | – | `content` | Placeholder |
| `label` | `string` | – | `content` | Label |
| `error` | `string` | – | `content` | Error message |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `numberOfLines` | `number` | `4` | `layout` | Lines |
| `borderRadius` | `radius` | `md` | `style` | Border radius |
| `background` | `color` | – | `style` | Background |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `outlined` | Outlined | `&#123;"borderWidth":1,"bg":"transparent"&#125;` |
| `filled` | Filled | `&#123;"borderWidth":0&#125;` |

## Sizes

Supported sizes: `sm` · `md` · `lg`

```json
{
  "sm": {
    "height": 80,
    "px": 3,
    "py": 2,
    "fontSize": 13,
    "labelSize": 11
  },
  "md": {
    "height": 120,
    "px": 4,
    "py": 3,
    "fontSize": 15,
    "labelSize": 13
  },
  "lg": {
    "height": 180,
    "px": 5,
    "py": 4,
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

### Interface: `TextAreaProps`

Props for the TextArea component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `string` | – | The controlled text value of the text area. |
| `defaultValue` *(optional)* | `string` | – | The default text value for an uncontrolled text area. |
| `onChangeText` *(optional)* | `(text: string) =&gt; void` | – | Callback invoked when the text changes. |
| `placeholder` *(optional)* | `string` | – | Placeholder text shown when the text area is empty. |
| `disabled` *(optional)* | `boolean` | – | Disables the text area, preventing user input. |
| `error` *(optional)* | `string` | – | Error message to display below the text area. |
| `lines` *(optional)* | `number` | – | Approximate number of lines to dictate the initial minimum height. |
| `key` | `string]: any` | – | – |

### Function: `useTextAreaLogic`

```ts
useTextAreaLogic(props: TextAreaProps)
```

### Function: `useTextAreaStyle`

```ts
useTextAreaStyle(logic: any)
```

