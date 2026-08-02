---
title: "Spinner"
description: "Loading indicator."
type: "component"
category: "feedback"
slug: "/ui/components/base/Spinner/Spinner"
---

# Spinner

> **Type:** `component`  |  **Category:** `feedback`  |  **Tags:** `spinner` · `loading` · `indicator`

Loading indicator.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Spinner, Card, Stack, Text } from '@flipova/foundation';

export default function SpinnerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Spinner Example</Text>
          <Spinner
          size="md"
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
| `size` | `enum` | `md` | `style` | Size |
| `color` | `color` | – | `style` | Color |


## Sizes

Supported sizes: `sm` · `md` · `lg`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `color` | `theme.primary` |




## TypeScript Logic & Hook Specifications

### Interface: `SpinnerProps`

Props for the Spinner component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `size` *(optional)* | `'small' &#124; 'large' &#124; number` | – | Size of the spinner. Usually 'small' or 'large'. Numeric values fallback to 'small' on native platforms, though scaling could be applied. |
| `color` *(optional)* | `string` | – | Optional custom color for the spinner. Falls back to theme primary color. |
| `key` | `string]: any` | – | – |

### Function: `useSpinnerLogic`

```ts
useSpinnerLogic(props: SpinnerProps)
```

### Function: `useSpinnerStyle`

```ts
useSpinnerStyle(logic: any)
```

