---
title: Themes & Tokens Guide
sidebar_label: 02. Themes & Tokens
slug: /guides/theming-guide
---

# Comprehensive Themes & Design Tokens Guide

Flipova Foundation provides a deterministic, type-safe design token architecture and a declarative theming engine designed for universal compatibility across React Native (iOS, Android) and React Web.

---

## 1. Design Tokens Overview

Design tokens represent the foundational design decisions of your application—colors, spacing, typography scales, radii, and z-index layers. In Flipova Foundation, tokens are defined declaratively in `tokens.yaml` and `themes.yaml` and compiled into immutable TypeScript constants.

### Spacing Scale (`@flipova/foundation/tokens`)

| Token | Pixel Value | Typical Usage |
| :--- | :--- | :--- |
| **`xs`** | `4px` | Micro gaps, tight padding inside badges |
| **`sm`** | `8px` | Small gaps between text lines & icons |
| **`md`** | `16px` | Standard padding inside buttons & inputs |
| **`lg`** | `24px` | Card padding, section gaps |
| **`xl`** | `32px` | Large container padding |
| **`xxl`** | `48px` | Hero section spacing, screen margins |

### Border Radii Scale

| Token | Value | Typical Usage |
| :--- | :--- | :--- |
| **`none`** | `0px` | Square containers, dividers |
| **`sm`** | `4px` | Small tags, tooltips |
| **`md`** | `8px` | Standard buttons, inputs, card corners |
| **`lg`** | `16px` | Modals, drawers, hero cards |
| **`full`** | `9999px` | Avatars, pills, circular icon buttons |

---

## 2. Color System & ColorSchemes

Every theme in Flipova Foundation implements the standardized `ColorScheme` interface. This ensures that UI components automatically re-color without code changes when themes switch.

### Standard Color Tokens

```ts
export interface ColorScheme {
  background: string;       // Primary application background
  surface: string;          // Card & elevated container background
  surfaceHover: string;     // Hover state for interactive surfaces
  primary: string;          // Main brand accent color (Default: #000091)
  primaryHover: string;     // Hover state for primary buttons
  secondary: string;        // Supporting secondary color
  border: string;           // Divider and container border color
  text: string;             // Primary body text color
  textMuted: string;        // Subtle caption text color
  success: string;          // Positive feedback state
  warning: string;          // Cautionary state
  error: string;            // Destructive / error state
}
```

---

## 3. Using Tokens & Themes in Code

### A. Accessing Theme Context via `useTheme`

```tsx
import React from 'react';
import { useTheme } from '@flipova/foundation/theme';

export function UserProfileBadge() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <div style={{ backgroundColor: theme.surface, color: theme.text, padding: '16px' }}>
      <p>Current Theme: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
      <button onClick={toggleTheme} style={{ backgroundColor: theme.primary, color: '#fff' }}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### B. Accessing Tokens Directly

You can import token constants directly for static calculations:

```ts
import { spacing, radii } from '@flipova/foundation/tokens';

const containerStyle = {
  padding: spacing.md,       // 16
  borderRadius: radii.md,   // 8
};
```

---

## 4. Custom Theme Registration

You can extend the default themes with your own custom color schemes using `flipova.config.ts` or directly via `ThemeProvider`.

### Step 1: Define Your Custom `ColorScheme`

```ts
import { ColorScheme } from '@flipova/foundation/theme';

export const customCyberpunkTheme: ColorScheme = {
  background: '#05050a',
  surface: '#0d0e17',
  surfaceHover: '#161826',
  primary: '#00ffcc',
  primaryHover: '#00e6b8',
  secondary: '#ff0055',
  border: 'rgba(0, 255, 204, 0.2)',
  text: '#ffffff',
  textMuted: '#8a8fa8',
  success: '#00ff66',
  warning: '#ffcc00',
  error: '#ff0033',
};
```

### Step 2: Register in `ThemeProvider` or `flipova.config.ts`

```tsx
import React from 'react';
import { ThemeProvider } from '@flipova/foundation/theme';
import { customCyberpunkTheme } from './customCyberpunkTheme';

export default function App() {
  return (
    <ThemeProvider
      defaultTheme="cyberpunk"
      customThemes={{
        cyberpunk: customCyberpunkTheme,
      }}
    >
      <YourAppContent />
    </ThemeProvider>
  );
}
```

---

## 5. Token & Theme Compilation Pipeline

When modifying `tokens.yaml` or `themes.yaml` in your source directory, use the CLI build tools to regenerate the type-safe TypeScript definitions:

```bash
# Recompile tokens.yaml into src/tokens/generated.ts
npx flipova build:tokens

# Recompile themes.yaml into src/theme/generated.ts
npx flipova build:themes

# Interactive terminal manager for themes and tokens
npx flipova-ds
```

The compiled output (`generated.ts`) is automatically imported by `@flipova/foundation/tokens` and `@flipova/foundation/theme`, giving you autocomplete and TypeScript safety across your entire application.
