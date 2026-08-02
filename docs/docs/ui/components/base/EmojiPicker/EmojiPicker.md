---
title: "EmojiPicker"
description: "A grid of emojis categorized by type."
type: "component"
category: "general"
slug: "/ui/components/base/EmojiPicker/EmojiPicker"
---

# EmojiPicker

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `picker` · `emoji`

A grid of emojis categorized by type.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, EmojiPicker, Card, Stack, Text } from '@flipova/foundation';

export default function EmojiPickerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">EmojiPicker Example</Text>
          <EmojiPicker />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `EmojiPickerProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onChange` *(optional)* | `(emoji: string, isAnimated?: boolean) =&gt; void` | – | Callback fired when an emoji is selected |
| `value` *(optional)* | `string` | – | Currently selected emoji |
| `showAnimated` *(optional)* | `boolean` | – | Whether to show animated emojis toggle |
| `key` | `string]: any` | – | – |

### Function: `useEmojiPickerLogic`

```ts
useEmojiPickerLogic(props: EmojiPickerProps)
```

### Function: `useEmojiPickerStyle`

```ts
useEmojiPickerStyle(logic: any)
```

