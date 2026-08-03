---
title: "Integrating External Component Libraries (shadcn/ui, Radix, MUI)"
sidebar_label: "External Libraries & Theming"
description: "Comprehensive guide on integrating Flipova Foundation design tokens and theming system with external React Web component libraries such as shadcn/ui, Tailwind CSS, Radix UI, Material UI, and Ant Design."
slug: "/guides/external-libraries-theming"
---

# Integrating External Component Libraries

Flipova Foundation provides a unified design token system and dynamic theming engine. While `@flipova/foundation/web` and `@flipova/foundation` include built-in components and layout primitives, you can easily use Flipova Foundation's design tokens and theme state to drive external React Web component libraries such as **shadcn/ui**, **Tailwind CSS**, **Radix UI**, **Material UI (MUI)**, **Chakra UI**, and **Ant Design**.

This guide demonstrates how to seamlessly bridge Flipova Foundation's `ThemeProvider`, `useTheme()`, and design tokens into external component ecosystems.

---

## Architecture: How Integration Works

Flipova Foundation offers three primary integration mechanisms:

1. **CSS Custom Properties (Variables)**: Injecting theme tokens directly into CSS root variables (`:root` / `[data-theme]`) for Tailwind CSS, shadcn/ui, and custom CSS.
2. **React Context & `useTheme()` Hook**: Subscribing external components directly to theme color changes and active color schemes.
3. **Dynamic Theme Converters**: Utility functions that convert Flipova `ColorScheme` objects into target library theme formats (e.g. MUI `createTheme()` or Chakra `extendTheme()`).

---

## 1. Integrating with shadcn/ui & Tailwind CSS

**shadcn/ui** relies on Tailwind CSS and CSS variables. By binding Flipova Foundation tokens to CSS variables, all shadcn components automatically update when you switch themes in Flipova.

### Step 1: Syncing Flipova Theme to CSS Variables

Create a wrapper component `FlipovaShadcnBridge` that updates CSS custom properties whenever the Flipova theme changes:

```tsx
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme, ColorScheme } from '@flipova/foundation/web';

function CSSVariableInjector({ children }: { children: React.ReactNode }) {
  const { theme, colorScheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    // Map Flipova ColorScheme properties to HSL / hex CSS variables expected by shadcn/ui
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--card-foreground', theme.cardForeground);
    root.style.setProperty('--popover', theme.card);
    root.style.setProperty('--popover-foreground', theme.cardForeground);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-foreground', theme.primaryForeground);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--secondary-foreground', theme.secondaryForeground);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--muted-foreground', theme.mutedForeground);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-foreground', theme.accentForeground);
    root.style.setProperty('--destructive', theme.destructive);
    root.style.setProperty('--destructive-foreground', theme.destructiveForeground);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--input', theme.input);
    root.style.setProperty('--ring', theme.ring);

    // Sync dark class for Tailwind
    if (colorScheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, colorScheme]);

  return <>{children}</>;
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultMode="dark">
      <CSSVariableInjector>{children}</CSSVariableInjector>
    </ThemeProvider>
  );
}
```

### Step 2: Configuring `tailwind.config.js`

In your `tailwind.config.js`, configure theme colors to use the injected CSS variables:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
    },
  },
  plugins: [],
};
```

---

## 2. Integrating with Radix UI Primitives

Radix UI components (Dialog, Accordion, DropdownMenu) are unstyled primitives. You can pass Flipova Foundation tokens to Radix elements using inline styles or `@flipova/foundation/web` components.

```tsx
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTheme, Button, Card, Stack, Text } from '@flipova/foundation/web';

export function FlipovaRadixModal() {
  const { theme } = useTheme();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open Radix Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            width: '90%',
            maxWidth: '450px',
          }}
        >
          <Card padding="lg" elevation="lg">
            <Stack gap="md">
              <Dialog.Title asChild>
                <Text variant="heading">Radix Dialog Powered by Flipova</Text>
              </Dialog.Title>
              <Dialog.Description asChild>
                <Text color="muted">
                  This modal uses Radix primitive logic with Flipova Foundation design tokens and colors!
                </Text>
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button variant="secondary" fullWidth>
                  Close Modal
                </Button>
              </Dialog.Close>
            </Stack>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

---

## 3. Integrating with Material UI (MUI)

To share themes between Flipova Foundation and Material UI, create a converter that maps Flipova `ColorScheme` to MUI `createTheme()`:

```tsx
import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme, ThemeProvider as FlipovaThemeProvider } from '@flipova/foundation/web';
import MuiButton from '@mui/material/Button';

function MuiThemeBridge({ children }: { children: React.ReactNode }) {
  const { theme, colorScheme } = useTheme();

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: colorScheme === 'dark' ? 'dark' : 'light',
        background: {
          default: theme.background,
          paper: theme.card,
        },
        text: {
          primary: theme.foreground,
          secondary: theme.mutedForeground,
        },
        primary: {
          main: theme.primary,
          contrastText: theme.primaryForeground,
        },
        secondary: {
          main: theme.secondary,
          contrastText: theme.secondaryForeground,
        },
        error: {
          main: theme.error,
        },
        warning: {
          main: theme.warning,
        },
        success: {
          main: theme.success,
        },
        divider: theme.border,
      },
    });
  }, [theme, colorScheme]);

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}

export function App() {
  return (
    <FlipovaThemeProvider defaultMode="dark">
      <MuiThemeBridge>
        {/* MUI components automatically adopt Flipova theme tokens */}
        <MuiButton variant="contained" color="primary">
          MUI Button in Flipova Theme
        </MuiButton>
      </MuiThemeBridge>
    </FlipovaThemeProvider>
  );
}
```

---

## 4. Custom CSS & Styled Components / Emotion

If your web app uses Styled Components, Emotion, or CSS Modules, inject Flipova CSS variables or use the `useTheme()` hook directly:

```tsx
import styled from '@emotion/styled';
import { useTheme } from '@flipova/foundation/web';

// Example 1: Direct theme hook consumption
export function StyledCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.card,
        color: theme.foreground,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <h3 style={{ color: theme.primary, margin: '0 0 12px 0' }}>{title}</h3>
      {children}
    </div>
  );
}
```

---

## Summary Best Practices

1. **Single Source of Truth**: Keep your primary themes defined in `flipova.config.ts` or `createTheme()`.
2. **Inject CSS Variables**: For CSS-in-JS or utility frameworks (Tailwind, shadcn), inject CSS variables at the root `FlipovaThemeProvider` level.
3. **Use `@flipova/foundation/web`**: When targeting React Web applications, import primitives and components directly from `@flipova/foundation/web` to avoid React Native bundling leaks.
