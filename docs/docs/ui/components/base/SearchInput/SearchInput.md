---
title: "SearchInput"
description: "A specialized input for searching with a clear button."
type: "component"
category: "general"
slug: "/ui/components/base/SearchInput/SearchInput"
---

# SearchInput

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `search`

A specialized input for searching with a clear button.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SearchInput, Card, Stack, Text } from '@flipova/foundation';

export default function SearchInputExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">SearchInput Example</Text>
          <SearchInput />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `SearchInputProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `value` *(optional)* | `string` | – | The search text |
| `onChangeText` *(optional)* | `(val: string) =&gt; void` | – | Callback on text change |
| `debounceMs` *(optional)* | `number` | – | Debounce time in ms. Default 300 |
| `placeholder` *(optional)* | `string` | – | Placeholder text |
| `style` *(optional)* | `ViewStyle` | – | Additional styling |
| `key` | `string]: any` | – | – |

### Function: `useSearchInputLogic`

```ts
useSearchInputLogic(props: SearchInputProps)
```

### Function: `useSearchInputStyle`

```ts
useSearchInputStyle(logic: any)
```

