---
title: "usePlatformRender"
sidebar_label: "usePlatformRender"
description: "Hook to render different components based on platform"
source: "ui/hooks/usePlatformRender.ts"
slug: "/ui/hooks/usePlatformRender"
---

# usePlatformRender

Hook to render different components based on platform

## Example

```tsx
```tsx
const Component = usePlatformRender({
  web: WebComponent,
  native: NativeComponent,
  ios: IOSSpecificComponent,
});
```
```

## Interfaces & Types

### `PlatformRenderConfig`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `web` *(optional)* | `T` | – | – |
| `native` *(optional)* | `T` | – | – |
| `ios` *(optional)* | `T` | – | – |
| `android` *(optional)* | `T` | – | – |
| `default` *(optional)* | `T` | – | – |

## Exported Functions & Hooks

### `usePlatformCheck`
Hook to render different components based on platform
/

import { useMemo } from 'react';
import { isWeb, isNative, isIOS, isAndroid } from '../utils/platform';

export interface PlatformRenderConfig<T> {
  web?: T;
  native?: T;
  ios?: T;
  android?: T;
  default?: T;
}

/**
Hook to select a value based on the current platform

```ts
usePlatformCheck(platform: 'web' | 'native' | 'ios' | 'android'): boolean
```

