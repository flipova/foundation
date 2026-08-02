---
title: "Accordion"
description: "Expandable/collapsible content section."
type: "component"
category: "display"
slug: "/ui/components/base/Accordion/Accordion"
---

# Accordion

> **Type:** `component`  |  **Category:** `display`  |  **Tags:** `accordion` · `collapse` · `expand` · `faq`

Expandable/collapsible content section.





## Usage Example

```tsx
import React from 'react';
import { FoundationProvider, Accordion, Card, Stack, Text } from '@flipova/foundation';

export default function AccordionExample() {
  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated">
        <Stack spacing={3}>
          <Text variant="heading" size="md">Accordion Example</Text>
          <Accordion
          title="Section"
          defaultOpen={false}
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
| `title` | `string` | `Section` | `content` | Title |
| `defaultOpen` | `boolean` | `false` | `behavior` | Default open |
| `background` | `color` | – | `style` | Background |
| `borderRadius` | `radius` | `lg` | `style` | Border radius |
| `borderColor` | `color` | – | `style` | Border color |



## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.card` |
| `text` | `theme.foreground` |
| `border` | `theme.border` |




## TypeScript Logic & Hook Specifications

### Interface: `AccordionProps`

Properties for the Accordion component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` *(optional)* | `string` | – | The text displayed in the header of the accordion. |
| `defaultOpen` *(optional)* | `boolean` | – | Whether the accordion should be open by default on initial mount. |
| `background` *(optional)* | `string` | – | Background color of the accordion container. |
| `borderRadius` *(optional)* | `string &#124; number` | – | Border radius of the accordion container. Can be a theme token size (e.g. 'sm') or a number. |
| `borderColor` *(optional)* | `string` | – | Border color of the accordion container. |
| `children` *(optional)* | `React.ReactNode` | – | The content to be revealed when the accordion is expanded. |
| `onToggle` *(optional)* | `(isOpen: boolean) =&gt; void` | – | Callback fired when the accordion's open state changes. |
| `key` | `string]: any` | – | – |

### Function: `useAccordionLogic`

```ts
useAccordionLogic(props: AccordionProps)
```

### Function: `useAccordionStyle`

```ts
useAccordionStyle(logic: any)
```

