---
title: "Centered"
description: "Centered content with optional card and maxWidth."
type: "layout"
category: "page"
slug: "/ui/components/layouts/CenteredLayout/CenteredLayout"
---

# Centered

> **Type:** `layout`  |  **Category:** `page`  |  **Tags:** `centered` · `form` · `onboarding` · `modal`

Centered content with optional card and maxWidth.

## Use Cases

- Loading screens with a central spinner.
- Error states or "empty" states displaying a central icon and message.
- Splash screens.

## Structure

- A single Flexbox container taking up all available space.
- Employs justifyContent and alignItems to center contents.

## Accessibility

- Transparent from an accessibility perspective; it simply groups elements visually.
- Ensure child elements have appropriate accessibility roles if needed.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, CenteredLayout, Card, Text, Stack } from '@flipova/foundation';

export default function CenteredLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <CenteredLayout
          maxWidth={500}
          padding={4}
          borderRadius="3xl"
          shadowed={false}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Centered Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Centered Section 2</Text>
        </Card>
      </CenteredLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `maxWidth` | `number` | `500` | `layout` | Card Max Width |
| `padding` | `spacing` | `4` | `layout` | Card Padding |
| `background` | `color` | – | `style` | Page Background |
| `cardBackground` | `color` | – | `style` | Card Background |
| `borderRadius` | `radius` | `3xl` | `style` | Border Radius |
| `shadowed` | `boolean` | `false` | `style` | Card Shadow |
| `mobilePadding` | `spacing` | `4` | `layout` | Mobile Padding |
| `desktopPadding` | `spacing` | `6` | `layout` | Desktop Padding |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | Yes | `children` | Content |


## TypeScript Logic & Hook Specifications

### Interface: `CenteredLayoutProps`

Props for the CenteredLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The content to be centered horizontally and vertically. |
| `key` | `string]: any` | – | – |

### Function: `useCenteredLayoutLogic`

```ts
useCenteredLayoutLogic(props: CenteredLayoutProps)
```

### Function: `useCenteredLayoutStyle`

```ts
useCenteredLayoutStyle(logic: any)
```

