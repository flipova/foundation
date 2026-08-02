---
title: "List"
description: "Scrollable list with virtualization."
type: "component"
category: "display"
slug: "/ui/components/base/FlatList/FlatList"
---

# List

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `list` · `flatlist` · `scroll` · `virtualized`

Scrollable list with virtualization.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, FlatList, Card, Stack, Text } from '@flipova/foundation';

export default function FlatListExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">List Example</Text>
          <FlatList
          horizontal={false}
          numColumns={1}
          spacing={0}
          showsScrollIndicator={true}
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
| `horizontal` | `boolean` | `false` | `layout` | Horizontal |
| `numColumns` | `number` | `1` | `layout` | Columns |
| `spacing` | `spacing` | `0` | `layout` | Item spacing |
| `showsScrollIndicator` | `boolean` | `true` | `behavior` | Scroll indicator |
| `background` | `color` | – | `style` | Background |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.background` |




## TypeScript Logic & Hook Specifications

### Interface: `FlatListProps`

Props for the FlatList component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `any[]` | – | An array of data objects to be rendered as a list. |
| `renderItem` | `(&#123; item, index` | – | Function that takes an item from the data array and returns a React element to render. |

### Function: `useFlatListLogic`

```ts
useFlatListLogic(props: FlatListProps)
```

### Function: `useFlatListStyle`

```ts
useFlatListStyle(logic: any)
```

