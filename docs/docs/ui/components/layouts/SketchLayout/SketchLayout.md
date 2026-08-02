---
title: "Sketch (placeholder)"
description: "Placeholder for a drawing canvas."
type: "layout"
category: "special"
slug: "/ui/components/layouts/SketchLayout/SketchLayout"
---

# Sketch (placeholder)

> **Type:** `layout`  |  **Category:** `special`  |  **Tags:** `sketch` · `draw` · `canvas` · `placeholder`

Placeholder for a drawing canvas.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SketchLayout, Card, Text, Stack } from '@flipova/foundation';

export default function SketchLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <SketchLayout >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Sketch (placeholder) Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Sketch (placeholder) Section 2</Text>
        </Card>
      </SketchLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `background` | `color` | – | `style` | Background |







## TypeScript Logic & Hook Specifications

### Interface: `SketchLayoutProps`

Properties for the SketchLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The content to be rendered on the 2D scrollable canvas. |
| `key` | `string]: any` | – | – |

### Function: `useSketchLayoutLogic`

```ts
useSketchLayoutLogic(props: SketchLayoutProps)
```

### Function: `useSketchLayoutStyle`

```ts
useSketchLayoutStyle(logic: any)
```

