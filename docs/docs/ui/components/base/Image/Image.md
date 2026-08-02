---
title: "Image"
description: "Image component with source, resize mode, and placeholder."
type: "component"
category: "display"
slug: "/ui/components/base/Image/Image"
---

# Image

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `image` · `photo` · `picture` · `media`

Image component with source, resize mode, and placeholder.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Image, Card, Stack, Text } from '@flipova/foundation';

export default function ImageExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Image Example</Text>
          <Image
          source="Source URL"
          alt="Alt text"
          resizeMode="cover"
          height={200}
          borderRadius="none"
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
| `source` | `string` | – | `content` | Source URL |
| `alt` | `string` | – | `content` | Alt text |
| `resizeMode` | `enum` | `cover` | `style` | Resize mode |
| `width` | `number` | – | `layout` | Width |
| `height` | `number` | `200` | `layout` | Height |
| `borderRadius` | `radius` | `none` | `style` | Border radius |
| `background` | `color` | – | `style` | Placeholder bg |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |




## TypeScript Logic & Hook Specifications

### Interface: `ImageProps`

Props for the Image component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `src` | `string` | – | The source URI of the image to display. |
| `alt` *(optional)* | `string` | – | Alternative text description for accessibility. Required for semantic HTML and screen reader support. |
| `fallbackSrc` *(optional)* | `string` | – | Fallback image URI displayed if the primary image fails to load. Useful for handling broken links or network errors gracefully. |
| `onError` *(optional)* | `(error: Error) =&gt; void` | – | Callback fired when the image fails to load. |
| `onLoad` *(optional)* | `() =&gt; void` | – | Callback fired when the image successfully loads. |
| `resizeMode` *(optional)* | `'cover' &#124; 'contain' &#124; 'stretch'` | – | Determines how the image should be resized to fit its container. Maps to `expo-image`'s `contentFit` prop. - 'cover': Scales the image uniformly so both dimensions are equal to or greater than the corresponding limits. - 'contain': Scales the image uniformly so both dimensions are equal to or less than the corresponding limits. - 'stretch': Scales the image non-uniformly to exactly match the container bounds. |
| `key` | `string]: any` | – | – |

### Function: `useImageLogic`

```ts
useImageLogic(props: ImageProps)
```

### Function: `useImageStyle`

```ts
useImageStyle(logic: any)
```

