---
title: "Web - Overview"
sidebar_label: "Web (Overview)"
description: "Web - Overview"
source: "web/index.ts"
slug: "/web/index"
---

# Web - Overview

Source file exports:

```ts
/**
 * @flipova/foundation/web
 *
 * Pure DOM-native Web Entry Point for React Web Applications (Next.js, Vite, Remix).
 * Contains ZERO React Native or native mobile dependencies.
 */

export * from './primitives';
export * from './components';
export * from './layouts';

// Re-export design tokens & theme provider utilities for convenience
export * from '../tokens';
export * from '../theme/providers/ThemeProvider';
export * from '../theme/types';
export * from '../theme/createTheme';
```
