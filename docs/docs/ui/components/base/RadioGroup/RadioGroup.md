---
title: "Radio Group"
description: "Group of radio buttons for single selection."
type: "component"
category: "input"
slug: "/ui/components/base/RadioGroup/RadioGroup"
---

# Radio Group

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `radio` · `group` · `select` · `form`

Group of radio buttons for single selection.





## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, RadioGroup, Card, Stack, Text, Button } from '@flipova/foundation';

export default function RadioGroupExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Radio Group Input</Text>
          <RadioGroup
          size="md"
          label="Label"
          direction="column"
          spacing={2}
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
| `label` | `string` | – | `content` | Label |
| `direction` | `enum` | `column` | `layout` | Direction |
| `spacing` | `spacing` | `2` | `layout` | Spacing |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `activeColor` | `color` | – | `style` | Active color |


## Sizes

Supported sizes: `sm` · `md`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `active` | `theme.primary` |
| `border` | `theme.border` |
| `text` | `theme.foreground` |




## TypeScript Logic & Hook Specifications

### Interface: `RadioGroupProps`

Props for the RadioGroup component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `string` | – | The currently selected value. |
| `onValueChange` *(optional)* | `(value: string) =&gt; void` | – | Callback fired when a new radio option is selected. |
| `options` | `&#123; label: string` | – | Array of options to display in the radio group. |
| `value` | `string` | – | – |

### Function: `useRadioGroupLogic`

```ts
useRadioGroupLogic(props: RadioGroupProps)
```

### Function: `useRadioGroupStyle`

```ts
useRadioGroupStyle(logic: any)
```

