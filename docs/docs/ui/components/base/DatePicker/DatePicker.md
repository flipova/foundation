---
title: "Date Picker"
description: "Date/time picker input."
type: "component"
category: "input"
slug: "/ui/components/base/DatePicker/DatePicker"
---

# Date Picker

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `date` · `time` · `picker` · `calendar` · `form`

Date/time picker input.

## Use Cases

- Selecting birth dates or appointment dates.
- Filtering lists by a date range.
- Providing date input for form fields.

## Structure

- Manages the visibility state (`show`) of the native date picker modal.
- On Web: Renders an `<input type="date">`.
- On Native: Renders a `Pressable` trigger that displays the selected date alongside a Calendar icon.
- Tapping it opens the `DateTimePicker`.

## Accessibility

- The native trigger acts as a button and could benefit from `accessibilityRole="button"`.
- For web, the native input manages its own accessibility.


## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, DatePicker, Card, Stack, Text, Button } from '@flipova/foundation';

export default function DatePickerExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Date Picker Input</Text>
          <DatePicker
          size="md"
          mode="date"
          label="Label"
          placeholder="Select date"
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
| `size` | `enum` | `md` | `style` | Size |
| `mode` | `enum` | `date` | `behavior` | Mode |
| `label` | `string` | – | `content` | Label |
| `placeholder` | `string` | `Select date` | `content` | Placeholder |
| `error` | `string` | – | `content` | Error message |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `borderRadius` | `radius` | `md` | `style` | Border radius |


## Sizes

Supported sizes: `sm` · `md` · `lg`

```json
{
  "sm": {
    "height": 32,
    "fontSize": 13
  },
  "md": {
    "height": 40,
    "fontSize": 15
  },
  "lg": {
    "height": 48,
    "fontSize": 17
  }
}
```

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.input` |
| `text` | `theme.foreground` |
| `border` | `theme.border` |
| `accent` | `theme.primary` |




## TypeScript Logic & Hook Specifications

### Interface: `DatePickerProps`

Properties for the DatePicker component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `Date` | `new Date()` | The currently selected date. |
| `onDateChange` *(optional)* | `(date: Date) =&gt; void` | – | Callback fired when the user selects a new date. |
| `disabled` *(optional)* | `boolean` | `false` | Whether the date picker is disabled. |
| `key` | `string]: any` | – | – |

### Function: `useDatePickerLogic`

```ts
useDatePickerLogic(props: DatePickerProps)
```

### Function: `useDatePickerStyle`

```ts
useDatePickerStyle(logic: any)
```

