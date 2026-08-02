---
title: "TutoLayout"
description: "A guided tutorial overlay layout that traces children elements and renders an interactive tour."
type: "layout"
category: "special"
slug: "/ui/components/layouts/TutoLayout/TutoLayout"
---

# TutoLayout

> **Type:** `layout`  |  **Category:** `special`  |  **Tags:** `layout` · `tutorial` · `guide` · `onboarding`

A guided tutorial overlay layout that traces children elements and renders an interactive tour.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, TutoLayout, Card, Text, Stack } from '@flipova/foundation';

export default function TutoLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <TutoLayout
          overlayOpacity={0.78}
          showSkip={true}
          nextLabel="Next"
          finishLabel="Finish"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">TutoLayout Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">TutoLayout Section 2</Text>
        </Card>
      </TutoLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `overlayOpacity` | `ratio` | `0.78` | `style` | Overlay Opacity |
| `overlayColor` | `color` | – | `style` | Overlay Color |
| `showSkip` | `boolean` | `true` | `behavior` | Skip Button |
| `nextLabel` | `string` | `Next` | `content` | Next Label |
| `finishLabel` | `string` | `Finish` | `content` | Finish Label |
| `accentColor` | `color` | – | `style` | Accent Color |
| `textBackground` | `color` | – | `style` | Text Background |
| `textColor` | `color` | – | `style` | Text Color |
| `mutedTextColor` | `color` | – | `style` | Secondary Text |
| `steps` | `json` | `[]` | `content` | Steps |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `accent` | `theme.primary` |
| `text` | `theme.foreground` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | Yes | `children` | Content to Annotate |

## Dependencies

- `react-native-reanimated`

## TypeScript Logic & Hook Specifications

### Interface: `TutoStep`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `targetId` | `string` | – | The ID of the TutoElement to highlight |
| `title` *(optional)* | `string` | – | Title text for the tooltip |
| `description` *(optional)* | `string` | – | Description text for the tooltip |
| `animation` *(optional)* | `TutoAnimationType` | – | Animation gesture to display over the highlight |

### Interface: `TutoLayoutProps`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `steps` *(optional)* | `TutoStep[]` | – | Array of tutorial steps |
| `isActive` *(optional)* | `boolean` | – | Whether the tutorial overlay is currently active |
| `onStepChange` *(optional)* | `(stepIndex: number) =&gt; void` | – | Callback fired when a step changes |
| `onComplete` *(optional)* | `() =&gt; void` | – | Callback fired when the tutorial completes |
| `key` | `string]: any` | – | – |

### Function: `useTutoLayoutLogic`

```ts
useTutoLayoutLogic(props: TutoLayoutProps)
```

### Function: `useTutoLayoutStyle`

```ts
useTutoLayoutStyle(logic: any)
```

