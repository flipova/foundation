---
title: "Map"
description: "Interactive map view with markers."
type: "component"
category: "media"
slug: "/ui/components/base/MapView/MapView"
---

# Map

> **Type:** `component`  |  **Category:** `media`  |  **Tags:** `map` · `location` · `gps` · `marker`

Interactive map view with markers.



## Accessibility

- Maps are inherently visual. Always provide:
- Text description of location
- List of coordinates/addresses
- Alternative data representation


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, MapView, Card, Stack, Text } from '@flipova/foundation';

export default function MapViewExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Map Example</Text>
          <MapView
          latitude={48.8566}
          longitude={2.3522}
          zoom={12}
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
| `latitude` | `number` | `48.8566` | `content` | Latitude |
| `longitude` | `number` | `2.3522` | `content` | Longitude |
| `zoom` | `number` | `12` | `content` | Zoom |
| `width` | `number` | – | `layout` | Width |
| `height` | `number` | `300` | `layout` | Height |
| `borderRadius` | `radius` | `lg` | `style` | Border radius |
| `showsUserLocation` | `boolean` | `true` | `behavior` | User location |







## TypeScript Logic & Hook Specifications

### Interface: `MapViewProps`

Props for the MapView component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `latitude` *(optional)* | `number` | – | The initial latitude coordinate for the center of the map. Defaults to 48.8566 (Paris). |
| `longitude` *(optional)* | `number` | – | The initial longitude coordinate for the center of the map. Defaults to 2.3522 (Paris). |
| `zoom` *(optional)* | `number` | – | The initial zoom level of the map. Higher values zoom in closer. Defaults to 12. |
| `key` | `string]: any` | – | – |

### Function: `useMapViewLogic`

```ts
useMapViewLogic(props: MapViewProps)
```

### Function: `useMapViewStyle`

```ts
useMapViewStyle(logic: any)
```

