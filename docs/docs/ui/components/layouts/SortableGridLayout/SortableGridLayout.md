---
title: "SortableGridLayout"
description: "A drag-and-drop reorderable grid layout for rendering interactive lists or grids."
type: "layout"
category: "general"
slug: "/ui/components/layouts/SortableGridLayout/SortableGridLayout"
---

# SortableGridLayout

> **Type:** `layout`  |  **Category:** `general`  |  **Tags:** `layout` · `grid` · `drag-and-drop` · `interactive` · `reorderable`

A drag-and-drop reorderable grid layout for rendering interactive lists or grids.

## Use Cases

- Photo galleries where users can rearrange their albums.
- Dashboards where widget positions can be customized.

## Structure

- Uses `react-native-reanimated` and `react-native-gesture-handler` for fluid 60fps animations
- during drag and drop. Renders items within an `Animated.View` inside a `GestureDetector`.

## Accessibility

- Drag and drop is inherently difficult for screen readers. Ensure you provide accessible
- alternative buttons (e.g., "Move Up", "Move Down") within each item for keyboard/voice navigation.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SortableGridLayout, Card, Text, Stack } from '@flipova/foundation';

export default function SortableGridLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <SortableGridLayout
          columns={3}
          spacing={8}
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">SortableGridLayout Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">SortableGridLayout Section 2</Text>
        </Card>
      </SortableGridLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `data` *(required)* | `array` | – | – | The list of data items to render. |
| `columns` | `number` | `3` | – | Number of columns in the grid. |
| `spacing` | `number` | `8` | – | Spacing between items. |







## TypeScript Logic & Hook Specifications

### Interface: `SortableGridLayoutProps`

Props for the SortableGridLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `T[]` | – | The list of data items to render. |
| `keyExtractor` | `(item: T, index: number) =&gt; string` | – | Function to extract a unique key from an item. |
| `renderItem` | `(item: T, index: number) =&gt; React.ReactNode` | – | Function to render each item. |
| `columns` *(optional)* | `number` | – | Number of columns in the grid. Default is 3. |
| `spacing` *(optional)* | `number` | – | Spacing between items in pixels. Default is 8. |
| `onReorder` *(optional)* | `(newData: T[]) =&gt; void` | – | Callback fired when items are successfully reordered. |
| `key` | `string]: any` | – | – |

### Function: `useSortableGridLayoutStyle`

```ts
useSortableGridLayoutStyle(logic: any)
```

