---
title: "Tabs"
description: "Tab navigation with content panels."
type: "component"
category: "navigation"
slug: "/ui/components/base/Tabs/Tabs"
---

# Tabs

> **Type:** `component`  |  **Category:** `navigation`  |  **Tags:** `tabs` · `navigation` · `panel` · `switch`

Tab navigation with content panels.

## Use Cases

- Switching between different data categories (e.g., "Recent", "Favorites", "All").
- Navigating through different settings pages.

## Structure

- Container `View` wrapping the tab bar and the content.
- Tab bar `View` holding multiple `Pressable` tabs.
- Content `View` displaying the active tab's `ReactNode`.

## Accessibility

- The tab bar uses `accessibilityRole="tablist"`.
- Each tab uses `accessibilityRole="tab"`.
- The active state is conveyed to screen readers via `accessibilityState={{ selected: isActive }}`.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Tabs, Card, Stack, Text } from '@flipova/foundation';

export default function TabsExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Tabs Example</Text>
          <Tabs
          borderRadius="none"
          position="top"
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
| `activeColor` | `color` | – | `style` | Active color |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `none` | `style` | Border radius |
| `position` | `enum` | `top` | `layout` | Position |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `active` | `theme.primary` |
| `bg` | `theme.card` |
| `border` | `theme.border` |




## TypeScript Logic & Hook Specifications

### Interface: `TabsProps`

Props for the Tabs component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `tabs` | `&#123; key: string` | – | An array of tab objects. Each tab must have a unique `key`, a `title` for the tab label, and an optional `content` node to display when active. |
| `title` | `string` | – | – |
| `content` *(optional)* | `React.ReactNode` | – | – |

### Function: `useTabsLogic`

```ts
useTabsLogic(props: TabsProps)
```

### Function: `useTabsStyle`

```ts
useTabsStyle(logic: any)
```

