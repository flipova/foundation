---
title: "WebView"
description: "Embedded web browser view."
type: "component"
category: "media"
slug: "/ui/components/base/WebView/WebView"
---

# WebView

> **Type:** `component`  |  **Category:** `media`  |  **Tags:** `webview` · `browser` · `iframe` · `embed`

Embedded web browser view.

## Use Cases

- Displaying external websites or articles without leaving the app.
- Rendering complex HTML strings or rich text.
- Loading web-based auth flows or payment gateways.

## Structure

- Native: Wraps `react-native-webview` for rendering arbitrary web content in a native context.
- Web: Uses iframe with restrictive sandbox for security

## Accessibility

- The web content should inherently implement its own ARIA and semantic HTML for screen readers.
- Iframes can obscure content from screen readers; ensure navigation between host and embedded content is clear.
- Provide title and aria-label for all iframes


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, WebView, Card, Stack, Text } from '@flipova/foundation';

export default function WebViewExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">WebView Example</Text>
          <WebView
          url="https://expo.dev"
          height={400}
          scrollEnabled={true}
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
| `url` | `string` | `https://expo.dev` | `content` | URL |
| `width` | `number` | – | `layout` | Width |
| `height` | `number` | `400` | `layout` | Height |
| `scrollEnabled` | `boolean` | `true` | `behavior` | Scroll |
| `borderRadius` | `radius` | `none` | `style` | Border radius |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |




## TypeScript Logic & Hook Specifications

### Interface: `WebViewProps`

Props for the WebView component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `source` | `string` | – | The URL or URI to load inside the web view. |
| `key` | `string]: any` | – | – |

### Function: `useWebViewLogic`

```ts
useWebViewLogic(props: WebViewProps)
```

### Function: `useWebViewStyle`

```ts
useWebViewStyle(logic: any)
```

