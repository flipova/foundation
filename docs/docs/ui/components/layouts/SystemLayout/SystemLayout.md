---
title: "System UI"
description: "System wrapper managing StatusBar, SafeAreaView, and NavigationBar."
type: "layout"
category: "special"
slug: "/ui/components/layouts/SystemLayout/SystemLayout"
---

# System UI

> **Type:** `layout`  |  **Category:** `special`  |  **Tags:** `system` · `statusbar` · `navigation-bar` · `safe-area`

System wrapper managing StatusBar, SafeAreaView, and NavigationBar.



## Accessibility

- Provides a safe container to ensure UI elements are not obscured by system UI.
- Leaves specific accessibility roles and labels to its children.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, SystemLayout, Card, Text, Stack } from '@flipova/foundation';

export default function SystemLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <SystemLayout
          rootBackgroundColor="#0c3ddbff"
          statusBarContentStyle="auto"
          navigationBarContentStyle="light"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">System UI Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">System UI Section 2</Text>
        </Card>
      </SystemLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `rootBackgroundColor` | `color` | `#0c3ddbff` | `style` | Root Background Color |
| `statusBarContentStyle` | `enum` | `auto` | `behavior` | Status Bar Style |
| `edges` | `json` | `["top","bottom","left","right"]` | `behavior` | Safe Area Edges |
| `navigationBarContentStyle` | `enum` | – | `behavior` | Nav Bar Style |
| `navigationBarReferenceColor` | `color` | – | `style` | Nav Bar Ref Color |





## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `children` | Yes | `children` | Content |

## Dependencies

- `expo-status-bar`
- `react-native-safe-area-context`

## TypeScript Logic & Hook Specifications

### Interface: `SystemLayoutProps`

Props for the SystemLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `children` *(optional)* | `React.ReactNode` | – | The content to be rendered inside the safe area container. |
| `statusBarMode` *(optional)* | `'light' &#124; 'dark' &#124; 'auto'` | – | The visual style of the system status bar ('light', 'dark', or 'auto'). |
| `key` | `string]: any` | – | – |

### Function: `useSystemLayoutLogic`

```ts
useSystemLayoutLogic(props: SystemLayoutProps)
```

### Function: `useSystemLayoutStyle`

```ts
useSystemLayoutStyle(logic: any)
```

