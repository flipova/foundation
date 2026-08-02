---
title: "spacingToStyle"
sidebar_label: "spacingToStyle"
description: "Converts spacing shorthands into React Native padding ViewStyle properties."
source: "ui/utils/spacingToStyle.ts"
slug: "/ui/utils/spacingToStyle"
---

# spacingToStyle

Converts spacing shorthands into React Native padding ViewStyle properties.

## Exported Functions & Hooks

### `spacingToStyle`
Converts spacing shorthands into React Native padding ViewStyle properties.

```ts
spacingToStyle(
  value:
    | SpacingShorthand
    | [SpacingShorthand, SpacingShorthand]
    | [SpacingShorthand, SpacingShorthand, SpacingShorthand, SpacingShorthand],
): Partial<ViewStyle>
```

**Parameters:**
- `value`: Spacing token/number or array tuple (vertical/horizontal or top/right/bottom/left).

**Returns:** A partial ViewStyle object with resolved padding properties.

