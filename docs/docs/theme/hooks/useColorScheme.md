---
title: "useColorScheme"
sidebar_label: "useColorScheme"
description: "Hook to manage the theme color scheme in the application.

This hook provides a unified way to manage theme selection:
- Uses the explicitly provided theme mode if specified.
- Uses the device's native color scheme (light/dark) by default.
- Defaults to light theme if the native scheme is unavailable."
source: "theme/hooks/useColorScheme.ts"
slug: "/theme/hooks/useColorScheme"
---

# useColorScheme

Hook to manage the theme color scheme in the application.

This hook provides a unified way to manage theme selection:
- Uses the explicitly provided theme mode if specified.
- Uses the device's native color scheme (light/dark) by default.
- Defaults to light theme if the native scheme is unavailable.

## Example

```tsx
```typescript
// Use the device's native color scheme
const theme = useColorScheme();

// Force light theme regardless of device preference
const lightTheme = useColorScheme('light');

// Force dark theme regardless of device preference
const darkTheme = useColorScheme('dark');
```
```

## Exported Functions & Hooks

### `useColorScheme`
Hook to manage the theme color scheme in the application.

This hook provides a unified way to manage theme selection:
- Uses the explicitly provided theme mode if specified.
- Uses the device's native color scheme (light/dark) by default.
- Defaults to light theme if the native scheme is unavailable.

```ts
useColorScheme(theme?: 'light' | 'dark'): 'light' | 'dark'
```

**Parameters:**
- `theme`: (Optional) Explicit theme mode to use instead of the device preference.

**Returns:** The resolved theme mode ('light' or 'dark').

