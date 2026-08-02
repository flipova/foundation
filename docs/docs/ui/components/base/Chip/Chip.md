---
title: "Chip"
description: "Selectable chip / tag with optional close action."
type: "component"
category: "input"
slug: "/ui/components/base/Chip/Chip"
---

# Chip

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `chip` · `tag` · `filter` · `selectable`

Selectable chip / tag with optional close action.

## Use Cases

- Displaying tags or categories for an article.
- Showing applied filters that the user can dismiss.
- Offering selectable choices in a compact form.

## Structure

- `Pressable`: Wraps the chip to handle main interactions (like selecting).
- `Text`: Displays the chip's label.
- An optional delete icon (X) wrapped in a `Pressable` for dismissal.

## Accessibility

- The delete button has a `hitSlop` to increase its touchable area without increasing its visual size.
- Consider passing accessibility labels to the delete button if used, to clarify its purpose (e.g., "Remove [tag name]").


## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, Chip, Card, Stack, Text, Button } from '@flipova/foundation';

export default function ChipExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">Chip Input</Text>
          <Chip
          label="Label"
          variant="filled"
          size="md"
          selected={false}
          closable={false}
          disabled={false}
        value={value} onChangeText={setValue} />
          <Button variant="primary" label="Submit" onPress={() => console.log(value)} />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `label` | `string` | – | `content` | Label |
| `variant` | `enum` | `filled` | `style` | Variant |
| `size` | `enum` | `md` | `style` | Size |
| `selected` | `boolean` | `false` | `behavior` | Selected |
| `closable` | `boolean` | `false` | `behavior` | Closable |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `borderRadius` | `radius` | `full` | `style` | Border radius |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `filled` | Filled | – |
| `outline` | Outline | `&#123;"bg":"transparent","borderWidth":1&#125;` |

## Sizes

Supported sizes: `sm` · `md`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |
| `text` | `theme.foreground` |
| `active` | `theme.primary` |




## TypeScript Logic & Hook Specifications

### Interface: `ChipProps`

Properties for the Chip component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | – | The text label to display inside the chip. |
| `onPress` *(optional)* | `() =&gt; void` | – | Callback fired when the chip is pressed. |
| `onDelete` *(optional)* | `() =&gt; void` | – | Callback fired when the delete icon is pressed. If provided, a delete icon will be rendered. |
| `selected` *(optional)* | `boolean` | `false` | Whether the chip is currently in a selected state (affects visual styling). |
| `disabled` *(optional)* | `boolean` | `false` | Whether the chip is disabled. |
| `key` | `string]: any` | – | – |

### Function: `useChipLogic`

```ts
useChipLogic(props: ChipProps)
```

### Function: `useChipStyle`

```ts
useChipStyle(logic: any)
```

