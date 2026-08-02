---
title: Architecture & Performance Guide
sidebar_label: 03. Architecture & Performance
slug: /guides/architecture-guide
---

# Architecture & Performance Deep Dive

Flipova Foundation is engineered under strict architectural principles: **deterministic code generation**, **universal platform compatibility**, and **zero-runtime performance overhead**.

---

## 1. Core Architectural Principles

### A. Write Once, Target Native & Web
Flipova Foundation abstracts platform dependencies so that mobile applications (React Native / Expo) and web applications (Next.js, Vite, Remix) can share 100% of their UI and design system layer.

- **Mobile Entry (`@flipova/foundation`):** Maps to native primitives (`View`, `Text`, `Pressable`, `ScrollView`).
- **Web Entry (`@flipova/foundation/web`):** Maps to highly-optimized semantic HTML elements (`div`, `span`, `button`, `section`) without heavy React Native Web bundle overhead.

### B. Deterministic & Metadata-Driven
Component definitions, default sizes, variants, and slots derive straight from `.meta.yaml` definitions and TSDoc comments. There are no magic numbers or inline hardcoded layout offsets in component source files.

---

## 2. The 3-File Modular Component Structure

Every component in the Flipova Foundation repository follows a strict 3-file modular separation of concerns:

```text
Button/
├── Button.tsx           # Pure view component handling rendering & JSX
├── Button.logic.ts     # Isolated hooks, event callbacks & state
└── Button.style.ts     # Dynamic variant styles, dimensions & token bindings
```

### 1. The View Layer (`Button.tsx`)
Renders layout primitives and binds props to the calculated styles.

```tsx
import React from 'react';
import { useButtonLogic } from './Button.logic';
import { getButtonStyle } from './Button.style';
import { Box } from '../primitives/Box';

export const Button: React.FC<ButtonProps> = (props) => {
  const { handlePress, isPressed } = useButtonLogic(props);
  const styles = getButtonStyle(props, isPressed);

  return (
    <Box onClick={handlePress} style={styles.container}>
      {props.label}
    </Box>
  );
};
```

### 2. The Logic Layer (`Button.logic.ts`)
Keeps state management and callbacks completely decoupled from rendering.

```ts
import { useState, useCallback } from 'react';

export function useButtonLogic(props: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = useCallback(() => {
    if (props.disabled) return;
    props.onPress?.();
  }, [props]);

  return { isPressed, handlePress };
}
```

### 3. The Style Layer (`Button.style.ts`)
Calculates variant styles and maps design tokens deterministically.

---

## 3. Declarative Layout Primitives

Flipova strongly discourages raw inline styles or custom CSS flexbox positioning. All UI structure is composed using 4 core layout primitives:

| Primitive | Flex Direction | Main Purpose |
| :--- | :--- | :--- |
| **`Box`** | N/A | Foundational container supporting padding, margins, borders & background tokens |
| **`Stack`** | `column` | Vertical layout with uniform `gap` spacing between items |
| **`Inline`** | `row` | Horizontal layout with uniform `gap` spacing and optional wrapping |
| **`Center`** | `row / column` | Centers children horizontally and vertically |

### Complex Layout Example (`UserCard.tsx`)

```tsx
import React from 'react';
import { Box, Inline, Stack, Center } from '@flipova/foundation/web';
import { Avatar, Text, Button } from '@flipova/foundation/web';

export function UserCard() {
  return (
    <Box padding="lg" borderRadius="md" backgroundColor="surface">
      <Inline gap="md" align="center">
        <Avatar src="https://example.com/avatar.png" size="lg" />
        <Stack gap="xs" flex={1}>
          <Text variant="heading" size="md">Alex Morgan</Text>
          <Text variant="body" color="muted">Lead Mobile Architect</Text>
        </Stack>
        <Center>
          <Button label="Connect" variant="primary" size="sm" />
        </Center>
      </Inline>
    </Box>
  );
}
```

---

## 4. Performance & Re-render Optimization

### A. Memoization & Pure Component Boundaries
All components are wrapped with `React.memo` and utilize isolated hooks to prevent parent state changes from causing unnecessary child re-renders.

### B. Tree-Shaking & Sub-module Entry Points
By importing from specific sub-modules (`@flipova/foundation/tokens`, `@flipova/foundation/layout`, `@flipova/foundation/web`), bundlers like Webpack, Vite, and Turbopack eliminate 100% of unused component code.

### C. Responsive Breakpoints (`useBreakpoint`)
Viewport dimensions are tracked globally through an optimized resize listener, exposing lightweight breakpoint flags (`isMobile`, `isTablet`, `isDesktop`) without polling.

```tsx
import { useBreakpoint } from '@flipova/foundation/layout';

export function ResponsiveNavigation() {
  const { isMobile } = useBreakpoint();

  return isMobile ? <MobileDrawer /> : <DesktopNavbar />;
}
```
