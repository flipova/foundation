---
title: "Text"
description: "Text display component with typography control."
type: "component"
category: "display"
slug: "/ui/components/base/Text/Text"
---

# Text

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `text` · `label` · `paragraph` · `heading` · `typography`

Text display component with typography control.

## Use Cases

- Displaying headings, paragraphs, and labels.
- Enforcing consistent typography (font sizes, weights, and colors) across the app.

## Structure

- Wraps the React Native `Text` component.

## Accessibility

- Inherits React Native's `Text` accessibility features.
- Text content is automatically accessible to screen readers.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Text, Card, Stack, Text } from '@flipova/foundation';

export default function TextExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Text Example</Text>
          <Text
          text="Text"
          fontSize={14}
          fontWeight="400"
          textAlign="left"
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
| `text` | `string` | `Text` | `content` | Text |
| `fontSize` | `number` | `14` | `style` | Font size |
| `fontWeight` | `enum` | `400` | `style` | Font weight |
| `color` | `color` | – | `style` | Color |
| `textAlign` | `enum` | `left` | `style` | Align |
| `numberOfLines` | `number` | – | `behavior` | Max lines |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `color` | `theme.foreground` |




## TypeScript Logic & Hook Specifications

### Interface: `TextProps`

Props for the Text component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The content to be rendered inside the Text component. |
| `variant` *(optional)* | `'h1' &#124; 'h2' &#124; 'h3' &#124; 'h4' &#124; 'p' &#124; 'small' &#124; 'muted'` | – | The typography variant determining font size, weight, and default margins. |
| `align` *(optional)* | `'left' &#124; 'center' &#124; 'right'` | – | Horizontal text alignment. |
| `weight` *(optional)* | `'normal' &#124; 'bold' &#124; '600'` | – | Override for the font weight. If omitted, the variant's default weight is used. |
| `key` | `string]: any` | – | – |

### Function: `useTextLogic`

```ts
useTextLogic(props: TextProps)
```

### Function: `useTextStyle`

```ts
useTextStyle(logic: any)
```

