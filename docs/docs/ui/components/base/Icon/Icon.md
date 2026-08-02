---
title: "Icon"
description: "Vector icon from Feather icon set."
type: "component"
category: "display"
slug: "/ui/components/base/Icon/Icon"
---

# Icon

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `icon` · `feather` · `vector` · `symbol`

Vector icon from Feather icon set.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Icon, Card, Stack, Text } from '@flipova/foundation';

export default function IconExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Icon Example</Text>
          <Icon
          name="star"
          size={24}
          strokeWidth={2}
        />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `name` | `string` | `star` | `content` | Icon name |
| `size` | `number` | `24` | `style` | Size |
| `color` | `color` | – | `style` | Color |
| `strokeWidth` | `number` | `2` | `style` | Stroke width |


## Sizes

Supported sizes: `sm` · `md` · `lg`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `color` | `theme.foreground` |




## TypeScript Logic & Hook Specifications

### Interface: `IconProps`

Props for the Icon component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `string` | – | The name of the icon to render, corresponding to a component name in `lucide-react-native`. e.g., 'Home', 'Settings'. |
| `size` *(optional)* | `number` | – | The size of the icon in pixels. Defaults to 24. |
| `color` *(optional)* | `string` | – | The color of the icon. Falls back to the theme's foreground color if not specified. |
| `key` | `string]: any` | – | – |

### Function: `useIconLogic`

```ts
useIconLogic(props: IconProps)
```

### Function: `useIconStyle`

```ts
useIconStyle(logic: any)
```

