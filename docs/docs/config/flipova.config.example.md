---
title: "flipova.config.example"
sidebar_label: "flipova.config.example"
description: "Example flipova.config.ts

Place this file at the root of your project.
Import it in your App.tsx and pass it to FoundationProvider.

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
source: "config/flipova.config.example.ts"
slug: "/config/flipova.config.example"
---

# flipova.config.example

Example flipova.config.ts

Place this file at the root of your project.
Import it in your App.tsx and pass it to FoundationProvider.

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

