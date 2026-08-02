---
title: "Flex"
description: "Adaptive direction, wrap, and spacing. Optional scroll."
type: "layout"
category: "content"
slug: "/ui/components/layouts/FlexLayout/FlexLayout"
---

# Flex

> **Type:** `layout`  |  **Category:** `content`  |  **Tags:** `flex` · `row` · `column` · `wrap` · `adaptive`

Adaptive direction, wrap, and spacing. Optional scroll.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, FlexLayout, Card, Text, Stack } from '@flipova/foundation';

export default function FlexLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <FlexLayout
          direction="row"
          wrap={false}
          spacing={4}
          align="stretch"
          justify="flex-start"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Flex Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Flex Section 2</Text>
        </Card>
      </FlexLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `direction` | `enum` | `row` | `layout` | Direction |
| `wrap` | `boolean` | `false` | `layout` | Wrap Line |
| `spacing` | `spacing` | `4` | `layout` | Spacing |
| `align` | `enum` | `stretch` | `layout` | Align Items |
| `justify` | `enum` | `flex-start` | `layout` | Justify Content |
| `maxWidth` | `number` | – | `layout` | Max Width |
| `scrollable` | `boolean` | `false` | `behavior` | Scrollable |
| `padding` | `padding` | – | `layout` | Padding |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | Yes | `children` | Elements |


## TypeScript Logic & Hook Specifications

### Interface: `FlexLayoutProps`

Props for the FlexLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The React elements to render inside the layout. |
| `direction` *(optional)* | `'row' &#124; 'column'` | – | Defines the primary axis of the flex container. 'row' arranges children horizontally, 'column' vertically. Defaults to 'column'. |
| `gap` *(optional)* | `number` | – | The spacing between adjacent flex items in pixels. Defaults to 0. |
| `key` | `string]: any` | – | – |

### Function: `useFlexLayoutLogic`

```ts
useFlexLayoutLogic(props: FlexLayoutProps)
```

### Function: `useFlexLayoutStyle`

Styles for the FlexLayout component.

Structural choices:
- flex: 1 enables the container to expand and fill available space.
- flexDirection determines the primary axis of arrangement based on logic.
- gap provides a consistent spacing between child elements using flex gap.


```ts
useFlexLayoutStyle(logic: any)
```

