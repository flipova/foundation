---
title: "Authentication"
description: "Panel branding (desktop) + centered form. Mobile: full screen."
type: "layout"
category: "page"
slug: "/ui/components/layouts/AuthLayout/AuthLayout"
---

# Authentication

> **Type:** `layout`  |  **Category:** `page`  |  **Tags:** `auth` · `login` · `signup` · `onboarding`

Panel branding (desktop) + centered form. Mobile: full screen.

## Use Cases

- Login or Registration pages where a primary marketing image is desired.
- Onboarding flows with distinct visual separation between content and input.

## Structure

- Renders a row-based Flexbox container.
- Left/Top side: An optional visual container for branding/imagery.
- Right/Bottom side: A centered container for authentication forms.

## Accessibility

- Ensure that the provided `image` node contains appropriate `accessibilityLabel` attributes if it conveys meaning.
- The form container acts as a standard `View`, but screen readers should be guided sequentially from the image (if any) to the form.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, AuthLayout, Card, Text, Stack } from '@flipova/foundation';

export default function AuthLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <AuthLayout
          borderRadius="none"
          spacing={0}
          brandingRatio={0.5}
          padding={5}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Authentication Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Authentication Section 2</Text>
        </Card>
      </AuthLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `brandingBackground` | `color` | – | `style` | Branding Background |
| `background` | `background` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `brandingRatio` | `ratio` | `0.5` | `layout` | Branding Ratio |
| `padding` | `spacing` | `5` | `layout` | Form Padding |
| `shadowed` | `boolean` | `true` | `style` | Mobile Shadow |
| `formMaxWidth` | `number` | `520` | `layout` | Form Max Width |
| `formScrollPaddingY` | `spacing` | `8` | `layout` | Scroll Y Padding |
| `formScrollPaddingX` | `spacing` | `4` | `layout` | Scroll X Padding |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | Yes | `children` | Form |
| `branding` | No | `named` | Panel branding |


## TypeScript Logic & Hook Specifications

### Interface: `AuthLayoutProps`

Props for the AuthLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `image` *(optional)* | `React.ReactNode` | – | The visual element to display alongside the authentication form. Typically an Image or SVG component providing branding or context. |
| `children` *(optional)* | `React.ReactNode` | – | The authentication form components (e.g., inputs, buttons). These are rendered within a centered, padded container. |
| `key` | `string]: any` | – | – |

### Function: `useAuthLayoutLogic`

```ts
useAuthLayoutLogic(props: AuthLayoutProps)
```

### Function: `useAuthLayoutStyle`

```ts
useAuthLayoutStyle(logic: any)
```

