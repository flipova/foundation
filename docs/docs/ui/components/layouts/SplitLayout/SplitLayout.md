---
title: "Split"
description: "Two panels (left/right or top/bottom) with independent scroll."
type: "layout"
category: "content"
slug: "/ui/components/layouts/SplitLayout/SplitLayout"
---

# Split

> **Type:** `layout`  |  **Category:** `content`  |  **Tags:** `split` · `two-pane` · `master-detail`

Two panels (left/right or top/bottom) with independent scroll.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SplitLayout, Card, Text, Stack } from '@flipova/foundation';

export default function SplitLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <SplitLayout
          spacing={0}
          ratio={0.5}
          orientation="horizontal"
          hideLeftOnMobile={false}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Split Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Split Section 2</Text>
        </Card>
      </SplitLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `leftWidth` | `number` | – | `layout` | Fixed Left Width |
| `ratio` | `ratio` | `0.5` | `layout` | Left Ratio |
| `orientation` | `enum` | `horizontal` | `layout` | Orientation |
| `hideLeftOnMobile` | `boolean` | `false` | `behavior` | Hide Left on Mobile |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `leftBackground` | `color` | – | `style` | Left Background |
| `rightBackground` | `color` | – | `style` | Right Background |
| `leftBorderRadius` | `radius` | `none` | `style` | Left Radius |
| `rightBorderRadius` | `radius` | `none` | `style` | Right Radius |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `left` | `theme.card` |
| `right` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `left` | Yes | `named` | Left Panel |
| `right` | Yes | `named` | Right Panel |


## TypeScript Logic & Hook Specifications

### Interface: `SplitLayoutProps`

Properties for the SplitLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `left` *(optional)* | `React.ReactNode` | – | The React node to render in the left pane. |
| `right` *(optional)* | `React.ReactNode` | – | The React node to render in the right pane. |
| `ratio` *(optional)* | `number` | – | The percentage (0-100) of the width that the left pane should consume. The right pane will consume the remainder. Defaults to 50. |
| `key` | `string]: any` | – | – |

### Function: `useSplitLayoutLogic`

```ts
useSplitLayoutLogic(props: SplitLayoutProps)
```

### Function: `useSplitLayoutStyle`

```ts
useSplitLayoutStyle(logic: any)
```

