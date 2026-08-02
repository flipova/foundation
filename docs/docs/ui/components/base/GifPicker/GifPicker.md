---
title: "GifPicker"
description: "A placeholder picker for GIFs."
type: "component"
category: "general"
slug: "/ui/components/base/GifPicker/GifPicker"
---

# GifPicker

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `input` · `picker` · `gif`

A placeholder picker for GIFs.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, GifPicker, Card, Stack, Text } from '@flipova/foundation';

export default function GifPickerExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">GifPicker Example</Text>
          <GifPicker />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```









## TypeScript Logic & Hook Specifications

### Interface: `GifItem`

Interface representing a GIF item.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | – | Unique ID for the GIF |
| `url` | `string` | – | URL of the GIF image |
| `title` | `string` | – | Title or description of the GIF |

### Interface: `GifPickerProps`

Props for the GifPicker component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onChange` *(optional)* | `(gifUrl: string) =&gt; void` | – | Callback fired when a GIF is selected |
| `value` *(optional)* | `string` | – | Currently selected GIF URL |
| `apiKey` *(optional)* | `string` | – | Optional API key for Giphy/Tenor (mocked if not provided) |
| `limit` *(optional)* | `number` | – | Optional limit of GIFs to fetch |
| `style` *(optional)* | `any` | – | Custom styles |
| `key` | `string]: any` | – | – |

### Function: `useGifPickerLogic`

Interface representing a GIF item.
/
export interface GifItem {
  /** Unique ID for the GIF */
  id: string;
  /** URL of the GIF image */
  url: string;
  /** Title or description of the GIF */
  title: string;
}

/**
Props for the GifPicker component.
/
export interface GifPickerProps {
  /** Callback fired when a GIF is selected */
  onChange?: (gifUrl: string) => void;
  /** Currently selected GIF URL */
  value?: string;
  /** Optional API key for Giphy/Tenor (mocked if not provided) */
  apiKey?: string;
  /** Optional limit of GIFs to fetch */
  limit?: number;
  /** Custom styles */
  style?: any;
  /** Any other props */
  [key: string]: any;
}

// Mock GIFs to simulate API data
const MOCK_GIFS: GifItem[] = [
  { id: '1', url: 'https://media.giphy.com/media/l41YkxvU8c7J7Bba0/giphy.gif', title: 'Funny Cat' },
  { id: '2', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', title: 'Happy Dance' },
  { id: '3', url: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif', title: 'Mind Blown' },
  { id: '4', url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblWQ/giphy.gif', title: 'Thumbs Up' },
  { id: '5', url: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', title: 'Laughter' },
  { id: '6', url: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif', title: 'Crying' },
  { id: '7', url: 'https://media.giphy.com/media/26gsa1yJkqYJpZpXG/giphy.gif', title: 'Surprise' },
  { id: '8', url: 'https://media.giphy.com/media/3oEduYmB0t5Vj028sE/giphy.gif', title: 'Shrug' }
];

/**
Logic hook for the GifPicker component.


```ts
useGifPickerLogic(props: GifPickerProps)
```

### Function: `useGifPickerStyle`

```ts
useGifPickerStyle(logic: any)
```

