---
title: "Text Input"
description: "Single-line text input with label, error state, and icon support."
type: "component"
category: "input"
slug: "/ui/components/base/TextInput/TextInput"
---

# Text Input

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `input` · `text` · `field` · `form`

Single-line text input with label, error state, and icon support.

## Use Cases

- Registration and login forms.
- Search bars.

## Structure

- Wraps a React Native `TextInput` inside a `View` container.
- Optionally renders an error `Text` below the input.

## Accessibility

- The underlying `TextInput` is naturally accessible.
- Error text is linked to the input via aria-describedby and aria-invalid.
- Proper error announcements for screen readers.


## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, TextInput, Card, Stack, Text, Button } from '@flipova/foundation';

export default function TextInputExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Text Input Input</Text>
          <TextInput
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
| `secureEntry` | `boolean` | `false` | `behavior` | Password |
| `borderRadius` | `radius` | `md` | `style` | Border radius |
| `background` | `color` | – | `style` | Background |
| `borderColor` | `color` | – | `style` | Border color |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `outlined` | Outlined | `&#123;"borderWidth":1,"bg":"transparent"&#125;` |
| `filled` | Filled | `&#123;"borderWidth":0&#125;` |
| `underline` | Underline | `&#123;"borderWidth":0,"borderBottomWidth":1,"borderRadius":"none"&#125;` |

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
| `placeholder` | `theme.mutedForeground` |




## TypeScript Logic & Hook Specifications

### Interface: `TextInputProps`

Props for the TextInput component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `string` | – | The controlled text value of the input. |
| `defaultValue` *(optional)* | `string` | – | The default text value for an uncontrolled input. |
| `onChangeText` *(optional)* | `(text: string) =&gt; void` | – | Callback invoked when the text changes. |
| `placeholder` *(optional)* | `string` | – | Placeholder text shown when the input is empty. |
| `disabled` *(optional)* | `boolean` | – | Disables the input, preventing user interaction. |
| `error` *(optional)* | `string` | – | Error message to display below the input. Also styles the border red. |
| `key` | `string]: any` | – | – |

### Function: `useTextInputLogic`

```ts
useTextInputLogic(props: TextInputProps)
```

### Function: `useTextInputStyle`

```ts
useTextInputStyle(logic: any)
```

