---
title: "FoundationProvider"
sidebar_label: "FoundationProvider"
description: "FoundationProvider

Wraps the app with resolved config (tokens + themes).
Replaces the standalone ThemeProvider — this is the single entry point.

Usage:
'''tsx
import { FoundationProvider } from '@flipova/foundation/config';
import config from './flipova.config';

export default function App() {
  return (
    <FoundationProvider config={config}>
      <MyApp />
    </FoundationProvider>
  );
}
'''"
source: "config/FoundationProvider.tsx"
slug: "/config/FoundationProvider"
---

# FoundationProvider

FoundationProvider

Wraps the app with resolved config (tokens + themes).
Replaces the standalone ThemeProvider — this is the single entry point.

Usage:
```tsx
import { FoundationProvider } from "@flipova/foundation/config";
import config from "./flipova.config";

export default function App() {
  return (
    <FoundationProvider config={config}>
      <MyApp />
    </FoundationProvider>
  );
}
```

## Example

```tsx
```tsx
import { FoundationProvider } from "@flipova/foundation/config";
import config from "./flipova.config";

export default function App() {
  return (
    <FoundationProvider config={config}>
      <MyApp />
    </FoundationProvider>
  );
}
```
```

## Exported Functions & Hooks

### `useFoundationConfig`
FoundationProvider

Wraps the app with resolved config (tokens + themes).
Replaces the standalone ThemeProvider — this is the single entry point.

Usage:
```tsx
import { FoundationProvider } from "@flipova/foundation/config";
import config from "./flipova.config";

export default function App() {
  return (
    <FoundationProvider config={config}>
      <MyApp />
    </FoundationProvider>
  );
}
```
/

import React, { createContext, useContext, useMemo } from "react";
import { ThemeProvider } from "../theme/providers/ThemeProvider";
import type { FoundationConfig, ResolvedConfig } from "./index";
import { resolveConfig } from "./index";

const ConfigContext = createContext<ResolvedConfig | null>(null);

/**
Hook to retrieve the resolved Foundation configuration.

```ts
useFoundationConfig(): ResolvedConfig
```

**Returns:** The resolved configuration.

### `useTokens`
Hook to retrieve resolved design tokens.

```ts
useTokens(): ResolvedConfig["tokens"]
```

**Returns:** Resolved tokens object.

