---
title: "Footer"
description: "Main content with fixed or scrollable footer."
type: "layout"
category: "content"
slug: "/ui/components/layouts/FooterLayout/FooterLayout"
---

# Footer

> **Type:** `layout`  |  **Category:** `content`  |  **Tags:** `footer` · `sticky` · `bottom-bar`

Main content with fixed or scrollable footer.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, FooterLayout, Card, Text, Stack } from '@flipova/foundation';

export default function FooterLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <FooterLayout
          footerHeight={60}
          spacing={0}
          sticky={false}
          scrollable={true}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Footer Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Footer Section 2</Text>
        </Card>
      </FooterLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `footerHeight` | `number` | `60` | `layout` | Footer Height |
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `sticky` | `boolean` | `false` | `behavior` | Sticky Footer |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `scrollable` | `boolean` | `true` | `behavior` | Scrollable |
| `footerBackground` | `color` | – | `style` | Footer Background |
| `footerBorderRadius` | `radius` | `none` | `style` | Footer Radius |
| `contentBorderRadius` | `radius` | `none` | `style` | Content Radius |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `padding` | `spacing` | `5` | `layout` | Content Padding |
| `footerPadding` | `spacing` | `5` | `layout` | Footer Padding |
| `compact` | `boolean` | `false` | `behavior` | Compact Mode |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `content` | Yes | `named` | Content |
| `footer` | Yes | `named` | Footer |


## TypeScript Logic & Hook Specifications

### Interface: `FooterLayoutProps`

Props for the FooterLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `footer` *(optional)* | `React.ReactNode` | – | The React element to display in the persistent footer section at the bottom. |
| `children` *(optional)* | `React.ReactNode` | – | The main content to render in the scrollable or flexible area above the footer. |
| `key` | `string]: any` | – | – |

### Function: `useFooterLayoutLogic`

```ts
useFooterLayoutLogic(props: FooterLayoutProps)
```

### Function: `useFooterLayoutStyle`

Styles for the FooterLayout component.

Structural choices:
- 'container' uses column flex direction to stack content vertically.
- 'content' gets flex: 1 to expand and take up all remaining vertical space above the footer.
- 'footer' retains its intrinsic height and uses z-index to overlay if ever needed.


```ts
useFooterLayoutStyle(logic: any)
```

