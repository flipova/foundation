---
title: "Progress Bar"
description: "Horizontal progress indicator."
type: "component"
category: "feedback"
slug: "/ui/components/base/ProgressBar/ProgressBar"
---

# Progress Bar

> **Type:** `component`  |  **Category:** `feedback`  |  **Tags:** `progress` · `bar` · `loading` · `percentage`

Horizontal progress indicator.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, ProgressBar, Card, Stack, Text } from '@flipova/foundation';

export default function ProgressBarExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Progress Bar Example</Text>
          <ProgressBar
          progress={0.5}
          size="md"
          borderRadius="full"
          showLabel={false}
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
| `progress` | `number` | `0.5` | `content` | Progress (0-1) |
| `size` | `enum` | `md` | `style` | Size |
| `color` | `color` | – | `style` | Color |
| `trackColor` | `color` | – | `style` | Track color |
| `borderRadius` | `radius` | `full` | `style` | Border radius |
| `showLabel` | `boolean` | `false` | `behavior` | Show label |


## Sizes

Supported sizes: `sm` · `md`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `active` | `theme.primary` |
| `track` | `theme.muted` |




## TypeScript Logic & Hook Specifications

### Interface: `ProgressBarProps`

Props for the ProgressBar component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `progress` *(optional)* | `number` | – | The current progress value as a percentage (from 0 to 100). |
| `key` | `string]: any` | – | – |

### Function: `useProgressBarLogic`

```ts
useProgressBarLogic(props: ProgressBarProps)
```

### Function: `useProgressBarStyle`

```ts
useProgressBarStyle(logic: any)
```

