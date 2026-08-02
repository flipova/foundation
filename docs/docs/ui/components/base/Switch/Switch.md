---
title: "Switch"
description: "Toggle switch."
type: "component"
category: "input"
slug: "/ui/components/base/Switch/Switch"
---

# Switch

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `switch` · `toggle` · `boolean`

Toggle switch.

## Use Cases

- Settings panels to toggle preferences.
- Form fields for boolean choices (e.g., "I agree to terms", "Enable notifications").

## Structure

- Uses a `Pressable` wrapper for interaction and accessibility.
- Contains a `View` acting as the track.
- Uses an `Animated.View` from `react-native-reanimated` for the thumb to provide smooth spring animations when toggled.
- Optionally renders a `Text` component for the label next to the switch.

## Accessibility

- Implements `accessibilityRole="switch"`.
- Uses `accessibilityState` to announce the current `checked` and `disabled` states to screen readers.
- Uses `accessibilityLabel` from the provided label or defaults to "Toggle Switch".


## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, Switch, Card, Stack, Text, Button } from '@flipova/foundation';

export default function SwitchExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Switch Input</Text>
          <Switch
          size="md"
          disabled={false}
          label="Label"
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
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `label` | `string` | – | `content` | Label |
| `activeColor` | `color` | – | `style` | Active color |
| `trackColor` | `color` | – | `style` | Track color |


## Sizes

Supported sizes: `sm` · `md`

```json
{
  "sm": {
    "scale": 0.8,
    "labelSize": 13,
    "width": 36,
    "height": 20
  },
  "md": {
    "scale": 1,
    "labelSize": 15,
    "width": 44,
    "height": 24
  }
}
```

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `active` | `theme.primary` |
| `track` | `theme.muted` |




## TypeScript Logic & Hook Specifications

### Interface: `SwitchProps`

Props for the Switch component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `checked` *(optional)* | `boolean` | – | The controlled checked state of the switch. If provided, the switch operates in controlled mode and relies on `onCheckedChange` to update its state. |
| `onCheckedChange` *(optional)* | `(checked: boolean) =&gt; void` | – | Callback invoked when the switch's checked state changes. Receives the new boolean state as its argument. |
| `disabled` *(optional)* | `boolean` | – | Disables the switch, preventing user interaction and altering its visual opacity. |
| `label` *(optional)* | `string` | – | Optional text label rendered alongside the switch track. Also serves as the primary accessibility label if provided. |
| `key` | `string]: any` | – | – |

### Function: `useSwitchLogic`

```ts
useSwitchLogic(props: SwitchProps)
```

### Function: `useSwitchStyle`

```ts
useSwitchStyle(logic: any)
```

