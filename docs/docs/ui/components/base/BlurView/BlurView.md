---
title: "Blur View"
description: "Blurred background overlay container."
type: "component"
category: "display"
slug: "/ui/components/base/BlurView/BlurView"
---

# Blur View

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `blur` · `glass` · `frosted` · `overlay`

Blurred background overlay container.

## Use Cases

- Creating modals or overlays where the background content should remain visible but out of focus.
- Building floating navigation bars or toolbars with a frosted glass effect.
- Emphasizing foreground elements without completely obscuring the background context.

## Structure

- `ExpoBlurView`: The underlying component from `expo-blur` that applies the effect.
- Renders children inside the blurred container.

## Accessibility

- Consider contrast and legibility when placing text or interactive elements over a blur.
- Ensure the blur does not interfere with the accessibility tree; it is primarily a visual effect.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, BlurView, Card, Stack, Text } from '@flipova/foundation';

export default function BlurViewExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Blur View Example</Text>
          <BlurView
          intensity={50}
          tint="default"
          borderRadius="none"
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
| `intensity` | `number` | `50` | `style` | Intensity |
| `tint` | `enum` | `default` | `style` | Tint |
| `borderRadius` | `radius` | `none` | `style` | Border radius |
| `padding` | `spacing` | – | `layout` | Padding |







## TypeScript Logic & Hook Specifications

### Interface: `BlurViewProps`

Properties for the BlurView component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `intensity` *(optional)* | `number` | `50` | A number from 1 to 100 to control the intensity of the blur effect. Higher values mean more blur. |
| `tint` *(optional)* | `'light' &#124; 'dark' &#124; 'default'` | `'default'` | The tint color of the blur effect. Can be 'light', 'dark', or 'default'. |
| `children` *(optional)* | `React.ReactNode` | – | The content to render inside the blurred container. |
| `key` | `string]: any` | – | – |

### Function: `useBlurViewLogic`

```ts
useBlurViewLogic(props: BlurViewProps)
```

### Function: `useBlurViewStyle`

```ts
useBlurViewStyle(logic: any)
```

