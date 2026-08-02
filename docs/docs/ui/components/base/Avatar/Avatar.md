---
title: "Avatar"
description: "User avatar with image, initials, or icon fallback."
type: "component"
category: "display"
slug: "/ui/components/base/Avatar/Avatar"
---

# Avatar

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `avatar` · `user` · `profile` · `image`

User avatar with image, initials, or icon fallback.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Avatar, Card, Stack, Text } from '@flipova/foundation';

export default function AvatarExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Avatar Example</Text>
          <Avatar
          variant="circle"
          size="md"
          source="Image source"
          initials="Initials"
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
| `variant` | `enum` | `circle` | `style` | Shape |
| `size` | `enum` | `md` | `style` | Size |
| `source` | `string` | – | `content` | Image source |
| `initials` | `string` | – | `content` | Initials |
| `background` | `color` | – | `style` | Background |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `circle` | Circle | `&#123;"borderRadius":"full"&#125;` |
| `square` | Square | `&#123;"borderRadius":"md"&#125;` |

## Sizes

Supported sizes: `xs` · `sm` · `md` · `lg` · `xl`

```json
{
  "xs": {
    "height": 24,
    "width": 24,
    "fontSize": 10
  },
  "sm": {
    "height": 32,
    "width": 32,
    "fontSize": 12
  },
  "md": {
    "height": 40,
    "width": 40,
    "fontSize": 14
  },
  "lg": {
    "height": 56,
    "width": 56,
    "fontSize": 18
  },
  "xl": {
    "height": 72,
    "width": 72,
    "fontSize": 24
  }
}
```

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |
| `text` | `theme.mutedForeground` |




## TypeScript Logic & Hook Specifications

### Interface: `AvatarProps`

Properties for the Avatar component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `src` *(optional)* | `string` | – | The URL of the image to display. If omitted, initials will be shown. |
| `initials` *(optional)* | `string` | – | Explicit initials to display. Overrides derived initials from the alt prop. |
| `size` *(optional)* | `'sm' &#124; 'md' &#124; 'lg' &#124; 'xl'` | – | The size variant of the avatar. Dictates width, height, and font size. Defaults to 'md'. |
| `alt` *(optional)* | `string` | – | Alternative text for screen readers. Also used to derive initials if `initials` is not provided. |
| `key` | `string]: any` | – | – |

### Function: `useAvatarLogic`

```ts
useAvatarLogic(props: AvatarProps)
```

### Function: `useAvatarStyle`

```ts
useAvatarStyle(logic: any)
```

