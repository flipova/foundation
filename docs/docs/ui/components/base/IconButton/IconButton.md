---
title: "Icon Button"
description: "Pressable icon-only button."
type: "component"
category: "action"
slug: "/ui/components/base/IconButton/IconButton"
---

# Icon Button

> **Type:** `component`  |  **Category:** `action`  |  **Tags:** `icon` · `button` · `action`

Pressable icon-only button.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, IconButton, Inline, Stack, Text } from '@flipova/foundation';

export default function IconButtonExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Stack spacing={4} style={{ padding: 20 }}>
        <Text variant="heading" size="md">Icon Button Actions</Text>
        <Inline spacing={3} alignItems="center">
          <IconButton
          variant="ghost"
          size="md"
          disabled={false}
          borderRadius="full"
        onPress={() => console.log('IconButton pressed')} />
        </Inline>
      </Stack>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `variant` | `enum` | `ghost` | `style` | Variant |
| `size` | `enum` | `md` | `style` | Size |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `borderRadius` | `radius` | `full` | `style` | Border radius |
| `color` | `color` | – | `style` | Icon color |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `filled` | Filled | – |
| `ghost` | Ghost | `&#123;"bg":"transparent"&#125;` |
| `outline` | Outline | `&#123;"bg":"transparent","borderWidth":1&#125;` |

## Sizes

Supported sizes: `sm` · `md` · `lg`

```json
{
  "sm": {
    "height": 32,
    "width": 32,
    "iconSize": 16
  },
  "md": {
    "height": 40,
    "width": 40,
    "iconSize": 20
  },
  "lg": {
    "height": 48,
    "width": 48,
    "iconSize": 24
  }
}
```

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |
| `icon` | `theme.foreground` |




## TypeScript Logic & Hook Specifications

### Interface: `IconButtonProps`

Props for the IconButton component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `icon` | `string` | – | The name of the icon to display, corresponding to a `lucide-react-native` component. |
| `onPress` *(optional)* | `() =&gt; void` | – | Callback executed when the button is pressed. |
| `size` *(optional)* | `number` | – | The size of the icon in pixels. The button container will scale accordingly. |
| `disabled` *(optional)* | `boolean` | – | Disables the button, applying a visual opacity and preventing interaction. |
| `variant` *(optional)* | `'default' &#124; 'ghost' &#124; 'outline'` | – | Visual variant of the button: - 'default': Solid background with primary theme colors. - 'ghost': Transparent background. - 'outline': Transparent background with a border. |
| `key` | `string]: any` | – | – |

### Function: `useIconButtonLogic`

```ts
useIconButtonLogic(props: IconButtonProps)
```

### Function: `useIconButtonStyle`

```ts
useIconButtonStyle(logic: any)
```

