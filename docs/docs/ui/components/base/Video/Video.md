---
title: "Video"
description: "Video player with controls, autoplay, and loop."
type: "component"
category: "media"
slug: "/ui/components/base/Video/Video"
---

# Video

> **Type:** `component`  |  **Category:** `media`  |  **Tags:** `video` · `player` · `media` · `stream`

Video player with controls, autoplay, and loop.

## Use Cases

- Showing tutorials, promotional videos, or user-generated content.
- Background videos for landing pages (using autoPlay and loop).

## Structure

- Native: Uses `expo-video`'s `VideoView` component for native playback capabilities.
- Web: Uses HTML5 `<video>` element with standard controls and playback.
- Container is a standard `View` to apply layout constraints.

## Accessibility

- Native: Controls are made accessible by `expo-video`.
- Web: Uses native HTML5 video controls which are WCAG 2.1 compliant.
- When controls are hidden (e.g., background video), ensure the video content is strictly decorative or alternate text/captions are provided elsewhere.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Video, Card, Stack, Text } from '@flipova/foundation';

export default function VideoExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Video Example</Text>
          <Video
          source="Source URL"
          poster="Poster URL"
          autoplay={false}
          loop={false}
          muted={true}
          controls={true}
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
| `poster` | `string` | – | `content` | Poster URL |
| `autoplay` | `boolean` | `false` | `behavior` | Autoplay |
| `loop` | `boolean` | `false` | `behavior` | Loop |
| `muted` | `boolean` | `true` | `behavior` | Muted |
| `controls` | `boolean` | `true` | `behavior` | Show controls |
| `resizeMode` | `enum` | `contain` | `style` | Resize mode |
| `width` | `number` | – | `layout` | Width |
| `height` | `number` | `220` | `layout` | Height |
| `borderRadius` | `radius` | `none` | `style` | Border radius |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |




## TypeScript Logic & Hook Specifications

### Interface: `VideoProps`

Props for the Video component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `source` | `string &#124; &#123; uri: string` | – | The URI or local path to the video file. |

### Function: `useVideoLogic`

```ts
useVideoLogic(props: VideoProps)
```

### Function: `useVideoStyle`

```ts
useVideoStyle(logic: any)
```

