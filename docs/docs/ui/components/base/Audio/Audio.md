---
title: "Audio"
description: "A base component for audio playback using expo-av."
type: "component"
category: "general"
slug: "/ui/components/base/Audio/Audio"
---

# Audio

> **Type:** `component`  |  **Category:** `general`  |  **Tags:** `base` · `media` · `audio` · `player`

A base component for audio playback using expo-av.

## Use Cases

- Podcast or music mini-player.
- Voice note playback.

## Structure

- Renders a circular Play/Pause button next to a progress bar that advances
- automatically based on the playback state.

## Accessibility

- The play/pause button is accessible via a Pressable, though aria-labels should be passed
- if screen-reader support is strictly required for the playback state.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Audio, Card, Stack, Text } from '@flipova/foundation';

export default function AudioExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Audio Example</Text>
          <Audio
          source="Sample"
          autoPlay={false}
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
| `source` *(required)* | `string` | – | – | The source URI of the audio file |
| `autoPlay` | `boolean` | `false` | – | Whether the audio should auto-play |







## TypeScript Logic & Hook Specifications

### Interface: `AudioProps`

Props for the Audio component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `source` | `string` | – | The source URI of the audio file |
| `autoPlay` *(optional)* | `boolean` | – | Whether the audio should auto-play |
| `key` | `string]: any` | – | – |

### Function: `useAudioLogic`

```ts
useAudioLogic(rawProps: AudioProps)
```

### Function: `useAudioStyle`

```ts
useAudioStyle(logic: any)
```

