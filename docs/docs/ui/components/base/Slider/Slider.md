---
title: "Slider"
description: "Range slider input."
type: "component"
category: "input"
slug: "/ui/components/base/Slider/Slider"
---

# Slider

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `slider` · `range` · `input` · `form`

Range slider input.





## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, Slider, Card, Stack, Text, Button } from '@flipova/foundation';

export default function SliderExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Slider Input</Text>
          <Slider
          size="md"
          min={0}
          max={100}
          step={1}
          label="Label"
          showValue={true}
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
| `min` | `number` | `0` | `behavior` | Min |
| `max` | `number` | `100` | `behavior` | Max |
| `step` | `number` | `1` | `behavior` | Step |
| `label` | `string` | – | `content` | Label |
| `showValue` | `boolean` | `true` | `behavior` | Show value |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `activeColor` | `color` | – | `style` | Active color |


## Sizes

Supported sizes: `sm` · `md`

```json
{
  "sm": {
    "trackHeight": 4,
    "thumbSize": 16,
    "labelSize": 11,
    "valueSize": 12
  },
  "md": {
    "trackHeight": 6,
    "thumbSize": 20,
    "labelSize": 13,
    "valueSize": 14
  }
}
```

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `active` | `theme.primary` |
| `track` | `theme.muted` |




## TypeScript Logic & Hook Specifications

### Interface: `SliderProps`

Props for the Slider component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `number` | – | The current numerical value of the slider. |
| `onValueChange` *(optional)* | `(value: number) =&gt; void` | – | Callback fired when the slider value changes. |
| `min` *(optional)* | `number` | – | The minimum allowable value. |
| `max` *(optional)* | `number` | – | The maximum allowable value. |
| `step` *(optional)* | `number` | – | The step size between values. |
| `disabled` *(optional)* | `boolean` | – | If true, disables user interaction with the slider. |
| `key` | `string]: any` | – | – |

### Function: `useSliderLogic`

```ts
useSliderLogic(props: SliderProps)
```

### Function: `useSliderStyle`

```ts
useSliderStyle(logic: any)
```

