---
title: "ThemeProvider"
sidebar_label: "ThemeProvider"
description: "Defines the shape of the theme context value.
Provides access to the current theme, mode, theme setter, and available themes."
source: "theme/providers/ThemeProvider.tsx"
slug: "/theme/providers/ThemeProvider"
---

# ThemeProvider

Defines the shape of the theme context value.
Provides access to the current theme, mode, theme setter, and available themes.

## Example

```tsx
```tsx
// Basic usage
const { theme, mode, setTheme } = useTheme();

// With a specific custom theme
const { theme } = useTheme('neon');
```
```

## Exported Functions & Hooks

### `useTheme`
Defines the shape of the theme context value.
Provides access to the current theme, mode, theme setter, and available themes.
/
interface ThemeContextType {
  /** The current active color scheme object */
  theme: ColorScheme;
  /** The current theme mode (built-in or custom) */
  mode: ThemeMode | CustomThemeMode;
  /** Function to change the current theme */
  setTheme: (theme: ThemeMode | CustomThemeMode) => void;
  /** Registry of all available themes */
  availableThemes: ThemeRegistry;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
Hook to access the theme context.

```ts
useTheme(customTheme?: ThemeMode | CustomThemeMode)
```

**Parameters:**
- `customTheme`: (Optional) Custom theme mode to use instead of current context theme.

**Returns:** Theme context object with current theme, mode, theme setter, and available themes.

