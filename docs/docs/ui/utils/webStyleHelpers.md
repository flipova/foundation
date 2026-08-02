---
title: "webStyleHelpers"
sidebar_label: "webStyleHelpers"
description: "Helper functions to convert React Native styles to web CSS
and handle platform-specific styling requirements"
source: "ui/utils/webStyleHelpers.ts"
slug: "/ui/utils/webStyleHelpers"
---

# webStyleHelpers

Helper functions to convert React Native styles to web CSS
and handle platform-specific styling requirements

## Exported Functions & Hooks

### `convertShadowToBoxShadow`
Helper functions to convert React Native styles to web CSS
and handle platform-specific styling requirements
/

import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { isWeb } from './platform';

type RNStyle = ViewStyle | TextStyle | ImageStyle | any;

/**
Convert React Native shadow properties to CSS box-shadow
React Native uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
CSS uses box-shadow: offsetX offsetY blurRadius spreadRadius color

```ts
convertShadowToBoxShadow(style: RNStyle): React.CSSProperties |
```

### `convertBorderRadius`
Convert React Native border radius shorthand to CSS
React Native uses borderRadius (all corners)
CSS can use border-radius with top-left, top-right, etc.

```ts
convertBorderRadius(
  style: RNStyle
): React.CSSProperties |
```

### `convertElevationToBoxShadow`
Convert React Native elevation (Android shadow) to CSS box-shadow
elevation: number on Android creates a layered shadow effect

```ts
convertElevationToBoxShadow(
  elevation: number | undefined
): React.CSSProperties |
```

### `convertTransformToCSS`
Convert React Native transform array to CSS transform string
React Native: transform: [{ translateX: 10 }, { scale: 0.5 }]
CSS: transform: translateX(10px) scale(0.5)

```ts
convertTransformToCSS(
  transform: any[] | undefined
): React.CSSProperties |
```

### `convertPerspectiveToCSS`
Convert React Native perspective to CSS

```ts
convertPerspectiveToCSS(
  style: RNStyle
): React.CSSProperties |
```

### `applyWebStyleConversions`
Merge multiple style converters and apply to a style object

```ts
applyWebStyleConversions(
  style: RNStyle
): React.CSSProperties
```

### `getCursorStyle`
Handle cursor styles on web
Maps React Native gestures to web cursor values

```ts
getCursorStyle(pointerEvents?: string): React.CSSProperties
```

### `getSelectableStyle`
Handle text selection on web
React Native doesn't use this, but web needs proper cursor feedback

```ts
getSelectableStyle(
  selectable?: boolean
): React.CSSProperties
```

### `getWebSafeClassName`
Ensure specific CSS classes are NOT applied on web (for RN-specific layouts)
Useful for preventing Tailwind or custom CSS from interfering

```ts
getWebSafeClassName(
  className: string | undefined,
  removeClasses: string[] = []
): string
```

### `flexboxConverter`
Convert React Native layout props to CSS flexbox equivalents

```ts
flexboxConverter(style: RNStyle): React.CSSProperties
```

