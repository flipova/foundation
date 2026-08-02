---
title: "Pressable"
description: "Generic pressable wrapper with feedback."
type: "component"
category: "action"
slug: "/ui/components/base/Pressable/Pressable"
---

# Pressable

> **Type:** `component`  |  **Category:** `action`  |  **Tags:** `pressable` · `touchable` · `tap` · `click`

Generic pressable wrapper with feedback.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Pressable, Inline, Stack, Text } from '@flipova/foundation';

export default function PressableExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Stack spacing={4} style={{ padding: 20 }}>
        <Text variant="heading" size="md">Pressable Actions</Text>
        <Inline spacing={3} alignItems="center">
          <Pressable
          disabled={false}
          opacity={0.7}
        onPress={() => console.log('Pressable pressed')} />
        </Inline>
      </Stack>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `opacity` | `number` | `0.7` | `style` | Press opacity |







## TypeScript Logic & Hook Specifications

### Interface: `PressableProps`

Props for the Pressable component.
Defines the contract for external interactions.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onPress` *(optional)* | `() =&gt; void` | – | Callback invoked when the user presses the component. |
| `disabled` *(optional)* | `boolean` | – | If true, disables all touch interactions and visually dims the component. |
| `children` *(optional)* | `React.ReactNode` | – | The content to be rendered inside the pressable area. |
| `key` | `string]: any` | – | – |

### Function: `usePressableLogic`

```ts
usePressableLogic(props: PressableProps)
```

### Function: `usePressableStyle`

```ts
usePressableStyle(logic: any)
```

