---
title: "Button"
description: "Pressable button with variant and size support."
type: "component"
category: "action"
slug: "/ui/components/base/Button/Button"
---

# Button

> **Type:** `component`  |  **Category:** `action`  |  **Tags:** `button` · `cta` · `action` · `pressable`

Pressable button with variant and size support.

## Use Cases

- Submitting forms or triggering actions.
- Navigating between different screens (e.g., as a link variant).
- Displaying a loading state while awaiting a network response.

## Structure

- `Pressable`: The core interactive element handling touch events.
- `ActivityIndicator`: Conditionally rendered when the button is in a loading state.
- `Text`: Displays the button label.

## Accessibility

- Uses `accessibilityRole="button"` to inform screen readers of its purpose.
- Manages `accessibilityState` to communicate `disabled` and `busy` (loading) states.
- Ensure sufficient color contrast for the text against the button background in all variants.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Button, Inline, Stack, Text } from '@flipova/foundation';

export default function ButtonExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Stack spacing={4} style={{ padding: 20 }}>
        <Text variant="heading" size="md">Button Actions</Text>
        <Inline spacing={3} alignItems="center">
          <Button
          label="Button"
          variant="primary"
          size="md"
          disabled={false}
          loading={false}
          fullWidth={false}
        onPress={() => console.log('Button pressed')} />
        </Inline>
      </Stack>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `label` | `string` | `Button` | `content` | Label |
| `variant` | `enum` | `primary` | `style` | Variant |
| `size` | `enum` | `md` | `style` | Size |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `loading` | `boolean` | `false` | `behavior` | Loading |
| `fullWidth` | `boolean` | `false` | `layout` | Full width |
| `borderRadius` | `radius` | `md` | `style` | Border radius |
| `iconPosition` | `enum` | `left` | `layout` | Icon position |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `primary` | Primary | `&#123;"borderWidth":0&#125;` |
| `secondary` | Secondary | `&#123;"borderWidth":0&#125;` |
| `outline` | Outline | `&#123;"bg":"transparent","borderWidth":1&#125;` |
| `ghost` | Ghost | `&#123;"bg":"transparent","borderWidth":0&#125;` |
| `destructive` | Destructive | `&#123;"borderWidth":0&#125;` |

## Sizes

Supported sizes: `sm` · `md` · `lg`

```json
{
  "sm": {
    "height": 32,
    "px": 3,
    "fontSize": 13
  },
  "md": {
    "height": 40,
    "px": 4,
    "fontSize": 15
  },
  "lg": {
    "height": 48,
    "px": 5,
    "fontSize": 17
  }
}
```

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.primary` |
| `text` | `theme.primaryForeground` |




## TypeScript Logic & Hook Specifications

### Interface: `ButtonProps`

Properties for the Button component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `label` *(optional)* | `string` | – | The text label to display inside the button. |
| `onPress` *(optional)* | `() =&gt; void` | – | Callback function executed when the button is pressed. |
| `disabled` *(optional)* | `boolean` | `false` | Whether the button is disabled. If true, interactions are ignored and the visual state is adjusted. |
| `loading` *(optional)* | `boolean` | `false` | Whether the button is in a loading state. If true, an ActivityIndicator is shown and interactions are disabled. |
| `variant` *(optional)* | `'default' &#124; 'destructive' &#124; 'outline' &#124; 'secondary' &#124; 'ghost' &#124; 'link'` | `'default'` | The visual style variant of the button. Determines background and text colors. |
| `size` *(optional)* | `'default' &#124; 'sm' &#124; 'lg' &#124; 'icon'` | `'default'` | The size of the button, affecting padding, height, and width (for icon size). |
| `key` | `string]: any` | – | – |

### Function: `useButtonLogic`

```ts
useButtonLogic(props: ButtonProps)
```

### Function: `useButtonStyle`

```ts
useButtonStyle(logic: any)
```

