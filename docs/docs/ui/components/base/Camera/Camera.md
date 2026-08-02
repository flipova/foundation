---
title: "Camera"
description: "Camera viewfinder for photo/video capture."
type: "component"
category: "media"
slug: "/ui/components/base/Camera/Camera"
---

# Camera

> **Type:** `component`  |  **Category:** `media`  |  **Tags:** `camera` · `photo` · `capture` · `scan`

Camera viewfinder for photo/video capture.

## Use Cases

- Scanning QR codes or barcodes
- Capturing user avatars or profile photos
- Recording video clips within the application


## Accessibility

- Provides fallback text when permissions are denied
- ARIA labels for video elements
- Error messages are descriptive and user-friendly


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Camera, Card, Stack, Text } from '@flipova/foundation';

export default function CameraExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Camera Example</Text>
          <Camera
          facing="back"
          flash="off"
          enableTorch={false}
          height={300}
          borderRadius="lg"
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
| `facing` | `enum` | `back` | `behavior` | Facing |
| `flash` | `enum` | `off` | `behavior` | Flash |
| `enableTorch` | `boolean` | `false` | `behavior` | Torch |
| `width` | `number` | – | `layout` | Width |
| `height` | `number` | `300` | `layout` | Height |
| `borderRadius` | `radius` | `lg` | `style` | Border radius |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |




## TypeScript Logic & Hook Specifications

### Interface: `CameraProps`

Properties for the Camera component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `facing` *(optional)* | `'back' &#124; 'front'` | `'back'` | The active camera facing direction ('back' or 'front'). |
| `isActive` *(optional)* | `boolean` | `true` | Whether the camera is active and rendering. Can be used to pause the camera preview. |
| `onCapture` *(optional)* | `(uri: string) =&gt; void` | – | Callback fired when a photo or video is captured. |
| `key` | `string]: any` | – | – |

### Function: `useCameraLogic`

```ts
useCameraLogic(props: CameraProps)
```

### Function: `useCameraStyle`

```ts
useCameraStyle(logic: any)
```

