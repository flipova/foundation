---
title: "Card"
description: "Surface container used to group and display information."
type: "component"
category: "display"
slug: "/ui/components/base/Card/Card"
---

# Card

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `card` · `surface` · `container`

Surface container used to group and display information.

## Use Cases

- Displaying a summary of an item (e.g., a product, user profile, or article snippet).
- Grouping related form fields or settings.
- Creating modular dashboard widgets.

## Structure

- Wraps its children inside a styled `View`.
- Applies theming to backgrounds, borders, and shadows out of the box.

## Accessibility

- Cards themselves are typically just presentational containers.
- If a card is interactive as a whole, consider wrapping it in a `Pressable` or passing accessibility roles via `rest`.
- Ensure logical heading structures and reading orders inside the card content.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Card, Card, Stack, Text } from '@flipova/foundation';

export default function CardExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Card Example</Text>
          <Card
          shadow="md"
          interactive={false}
          padding={4}
          borderRadius="md"
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
| `shadow` | `enum` | `md` | `style` | Shadow |
| `interactive` | `boolean` | `false` | `behavior` | Interactive |
| `padding` | `spacing` | `4` | `layout` | Padding |
| `borderRadius` | `radius` | `md` | `style` | Border Radius |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.card` |
| `text` | `theme.cardForeground` |
| `border` | `theme.border` |




## TypeScript Logic & Hook Specifications

### Interface: `CardProps`

Properties for the Card component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The content to display inside the card. |
| `key` | `string]: any` | – | – |

### Function: `useCardLogic`

```ts
useCardLogic(props: CardProps)
```

### Function: `useCardStyle`

```ts
useCardStyle(logic: any)
```

