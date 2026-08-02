---
title: "Dashboard"
description: "Fixed header, collapsible sidebar, scrollable content, optional footer."
type: "layout"
category: "page"
slug: "/ui/components/layouts/DashboardLayout/DashboardLayout"
---

# Dashboard

> **Type:** `layout`  |  **Category:** `page`  |  **Tags:** `dashboard` · `admin` · `sidebar` · `header`

Fixed header, collapsible sidebar, scrollable content, optional footer.

## Use Cases

- Admin panels or complex data-heavy applications.
- Navigation-heavy apps needing a persistent menu across all screens.

## Structure

- Outer container uses a row-based Flexbox layout.
- Left side: A sidebar with a fixed or dynamically provided width.
- Right side: A main content column (flex: 1).
- - Main column top: A header container.
- - Main column bottom: The primary scrolling children content.

## Accessibility

- Ensure logical tab-ordering from Sidebar -> Header -> Main Content.
- Wrap sidebar items in proper accessible touch targets.


## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, DashboardLayout, Card, Text, Stack } from '@flipova/foundation';

export default function DashboardLayoutExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <DashboardLayout
          sidebarWidth={260}
          sidebarCollapsedWidth={70}
          headerHeight={70}
          footerHeight={60}
          spacing={0}
          borderRadius="none"
        >
        <Card p={4} variant="elevated">
          <Stack spacing={2}>
            <Text variant="heading" size="md">Dashboard Section 1</Text>
            <Text color="mutedForeground">Content layout block powered by Flipova Foundation.</Text>
          </Stack>
        </Card>
        <Card p={4} variant="outlined">
          <Text variant="heading" size="md">Dashboard Section 2</Text>
        </Card>
      </DashboardLayout>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `sidebarWidth` | `number` | `260` | `layout` | Sidebar Width |
| `sidebarCollapsedWidth` | `number` | `70` | `layout` | Collapsed Sidebar Width |
| `headerHeight` | `number` | `70` | `layout` | Header Height |
| `footerHeight` | `number` | `60` | `layout` | Footer Height |
| `spacing` | `spacing` | `0` | `layout` | Spacing |
| `borderRadius` | `radius` | `none` | `style` | Border Radius |
| `background` | `color` | – | `style` | Background |
| `disableContentScroll` | `boolean` | `false` | `behavior` | Disable Content Scroll |
| `headerBackground` | `color` | – | `style` | Header Background |
| `sidebarBackground` | `color` | – | `style` | Sidebar Background |
| `contentBackground` | `color` | – | `style` | Content Background |
| `footerBackground` | `color` | – | `style` | Footer Background |
| `headerPaddingX` | `spacing` | `4` | `layout` | Header X Padding |
| `mobileHeaderMinHeight` | `number` | `60` | `layout` | Min Mobile Header Height |
| `defaultSidebarCollapsed` | `boolean` | `false` | `behavior` | Sidebar Collapsed by Default |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `root` | `theme.background` |
| `surface` | `theme.card` |


## Slots

| Slot Name | Required | Kind | Description |
|-----------|----------|------|-------------|
| `header` | Yes | `named` | Header |
| `content` | Yes | `named` | Content |
| `sidebar` | No | `named` | Sidebar |
| `footer` | No | `named` | Footer |

## Dependencies

- `react-native-reanimated`

## TypeScript Logic & Hook Specifications

### Interface: `DashboardLayoutProps`

Props for the DashboardLayout component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sidebar` *(optional)* | `React.ReactNode` | – | The React node to render in the left-hand sidebar container. |
| `header` *(optional)* | `React.ReactNode` | – | The React node to render in the top header container above the main content. |
| `children` *(optional)* | `React.ReactNode` | – | The primary application content rendered below the header. |
| `sidebarWidth` *(optional)* | `number` | – | The fixed width of the sidebar. Defaults to 250. |
| `key` | `string]: any` | – | – |

### Function: `useDashboardLayoutLogic`

```ts
useDashboardLayoutLogic(props: DashboardLayoutProps)
```

### Function: `useDashboardLayoutStyle`

```ts
useDashboardLayoutStyle(logic: any)
```

