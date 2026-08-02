---
title: "usePlatformInfo"
sidebar_label: "usePlatformInfo"
description: "usePlatformInfo — Core Platform Hook

Platform detection hook (iOS / Android / Web).
Use EXCLUSIVELY for platform-specific behavior (haptics, cursors, keyboard),
NOT for responsive styling layout decisions.

For responsive layout decisions → useBreakpoint()."
source: "ui/hooks/usePlatformInfo.ts"
slug: "/ui/hooks/usePlatformInfo"
---

# usePlatformInfo

usePlatformInfo — Core Platform Hook

Platform detection hook (iOS / Android / Web).
Use EXCLUSIVELY for platform-specific behavior (haptics, cursors, keyboard),
NOT for responsive styling layout decisions.

For responsive layout decisions → useBreakpoint().

## Example

```tsx
const { isWeb, isNative } = usePlatformInfo();
if (isNative) Haptics.impactAsync(...);
```

## Interfaces & Types

### `PlatformInfo`
usePlatformInfo — Core Platform Hook

Platform detection hook (iOS / Android / Web).
Use EXCLUSIVELY for platform-specific behavior (haptics, cursors, keyboard),
NOT for responsive styling layout decisions.

For responsive layout decisions → useBreakpoint().

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `isWeb` | `boolean` | – | true if Platform.OS === 'web' |
| `isNative` | `boolean` | – | true if Platform.OS !== 'web' (iOS or Android) |
| `isIOS` | `boolean` | – | true if Platform.OS === 'ios' |
| `isAndroid` | `boolean` | – | true if Platform.OS === 'android' |

## Exported Functions & Hooks

### `usePlatformInfo`
usePlatformInfo — Core Platform Hook

Platform detection hook (iOS / Android / Web).
Use EXCLUSIVELY for platform-specific behavior (haptics, cursors, keyboard),
NOT for responsive styling layout decisions.

For responsive layout decisions → useBreakpoint().

```ts
usePlatformInfo(): PlatformInfo
```

**Returns:** Object containing boolean flags indicating the active platform.

