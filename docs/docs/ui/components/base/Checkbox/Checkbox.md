---
title: "Checkbox"
description: "Toggle checkbox with label."
type: "component"
category: "input"
slug: "/ui/components/base/Checkbox/Checkbox"
---

# Checkbox

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `checkbox` · `toggle` · `form` · `boolean`

Toggle checkbox with label.

## Use Cases

- Selecting one or multiple options from a list.
- Agreeing to terms and conditions.
- Toggling a boolean setting.

## Structure

- `Pressable`: Wraps the entire component (checkbox + label) to increase the tap target size.
- `View`: Renders the visual box.
- `Check`: A Lucide icon rendered inside the box when checked.
- `Text`: Displays the optional label next to the checkbox.

## Accessibility

- The entire wrapper is pressable to aid users with limited dexterity.
- Proper ARIA roles and states for web (aria-checked, aria-disabled, aria-label).
- Native accessibility role and state for React Native.
- Error states supported with aria-invalid and aria-describedby.


## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, Checkbox, Card, Stack, Text, Button } from '@flipova/foundation';

export default function CheckboxExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Checkbox Input</Text>
          <Checkbox
          variant="square"
          size="md"
          disabled={false}
          label="Label"
          checked={false}
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
| `variant` | `enum` | `square` | `style` | Variant |
| `size` | `enum` | `md` | `style` | Size |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `label` | `string` | – | `content` | Label |
| `activeColor` | `color` | – | `style` | Active color |
| `checked` | `boolean` | `false` | `behavior` | Checked |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `square` | Square | `&#123;"borderRadius":"sm"&#125;` |
| `rounded` | Rounded | `&#123;"borderRadius":"full"&#125;` |

## Sizes

Supported sizes: `sm` · `md`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `active` | `theme.primary` |
| `border` | `theme.border` |




## TypeScript Logic & Hook Specifications

### Interface: `CheckboxProps`

Properties for the Checkbox component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `checked` *(optional)* | `boolean` | – | Whether the checkbox is checked. If provided, the component operates in controlled mode. |
| `onCheckedChange` *(optional)* | `(checked: boolean) =&gt; void` | – | Callback fired when the checkbox state changes. |
| `disabled` *(optional)* | `boolean` | `false` | Whether the checkbox is disabled. |
| `label` *(optional)* | `string` | – | The text label to display next to the checkbox. |
| `key` | `string]: any` | – | – |

### Function: `useCheckboxLogic`

```ts
useCheckboxLogic(props: CheckboxProps)
```

### Function: `useCheckboxStyle`

```ts
useCheckboxStyle(logic: any)
```

