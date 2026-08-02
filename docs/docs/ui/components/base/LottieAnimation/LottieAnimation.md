---
title: "Lottie"
description: "Lottie animation player."
type: "component"
category: "media"
slug: "/ui/components/base/LottieAnimation/LottieAnimation"
---

# Lottie

> **Type:** `component`  |  **Category:** `media`  |  **Tags:** `lottie` · `animation` · `motion` · `json`

Lottie animation player.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, LottieAnimation, Card, Stack, Text } from '@flipova/foundation';

export default function LottieAnimationExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Lottie Example</Text>
          <LottieAnimation
          source="Source URL"
          autoPlay={true}
          loop={true}
          speed={1}
          width={200}
          height={200}
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
| `autoPlay` | `boolean` | `true` | `behavior` | Auto play |
| `loop` | `boolean` | `true` | `behavior` | Loop |
| `speed` | `number` | `1` | `behavior` | Speed |
| `width` | `number` | `200` | `layout` | Width |
| `height` | `number` | `200` | `layout` | Height |







## TypeScript Logic & Hook Specifications

### Interface: `LottieAnimationProps`

Props for the LottieAnimation component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `source` | `any` | – | The source of the animation. Can be a local JSON file (via `require`) or a remote URI string. |
| `autoPlay` *(optional)* | `boolean` | – | Indicates whether the animation should start playing automatically when mounted. Defaults to true. |
| `loop` *(optional)* | `boolean` | – | Indicates whether the animation should loop continuously. Defaults to true. |
| `key` | `string]: any` | – | – |

### Function: `useLottieAnimationLogic`

```ts
useLottieAnimationLogic(props: LottieAnimationProps)
```

### Function: `useLottieAnimationStyle`

```ts
useLottieAnimationStyle(logic: any)
```

