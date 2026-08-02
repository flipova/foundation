---
title: "Badge"
description: "Small status indicator or label."
type: "component"
category: "display"
slug: "/ui/components/base/Badge/Badge"
---

# Badge

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `badge` · `tag` · `label` · `status`

Small status indicator or label.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Badge, Card, Stack, Text } from '@flipova/foundation';

export default function BadgeExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Badge Example</Text>
          <Badge
          label="Label"
          variant="solid"
          size="md"
          color="primary"
          borderRadius="full"
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
| `label` | `string` | – | `content` | Label |
| `variant` | `enum` | `solid` | `style` | Variant |
| `size` | `enum` | `md` | `style` | Size |
| `color` | `enum` | `primary` | `style` | Color scheme |
| `borderRadius` | `radius` | `full` | `style` | Border radius |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `solid` | Solid | – |
| `outline` | Outline | `&#123;"bg":"transparent","borderWidth":1&#125;` |
| `subtle` | Subtle | – |

## Sizes

Supported sizes: `sm` · `md`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.primary` |
| `text` | `theme.primaryForeground` |

## Color Schemes

```json
{
  "primary": {
    "solid": [
      "primary",
      "primaryForeground"
    ],
    "subtle": [
      "primary",
      "primaryForeground"
    ]
  },
  "secondary": {
    "solid": [
      "secondary",
      "secondaryForeground"
    ],
    "subtle": [
      "secondary",
      "secondaryForeground"
    ]
  },
  "success": {
    "solid": [
      "success",
      "#fff"
    ],
    "subtle": [
      "#dcfce7",
      "#166534"
    ]
  },
  "warning": {
    "solid": [
      "warning",
      "#fff"
    ],
    "subtle": [
      "#fef3c7",
      "#92400e"
    ]
  },
  "error": {
    "solid": [
      "error",
      "#fff"
    ],
    "subtle": [
      "#fee2e2",
      "#991b1b"
    ]
  },
  "info": {
    "solid": [
      "info",
      "#fff"
    ],
    "subtle": [
      "#e0f2fe",
      "#0369a1"
    ]
  }
}
```



## TypeScript Logic & Hook Specifications

### Interface: `BadgeProps`

Properties for the Badge component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | – | The text content to display inside the badge. |
| `variant` *(optional)* | `'default' &#124; 'destructive' &#124; 'outline' &#124; 'secondary'` | – | The visual style variant of the badge, mapped to theme colors. Defaults to 'default'. |
| `key` | `string]: any` | – | – |

### Function: `useBadgeLogic`

```ts
useBadgeLogic(props: BadgeProps)
```

### Function: `useBadgeStyle`

```ts
useBadgeStyle(logic: any)
```

