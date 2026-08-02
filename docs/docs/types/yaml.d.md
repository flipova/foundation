---
title: "yaml.d"
sidebar_label: "yaml.d"
description: "yaml.d"
source: "types/yaml.d.ts"
slug: "/types/yaml.d"
---

# yaml.d

Source file exports:

```ts
declare module '*.yaml' {
  const content: any;
  export default content;
}

declare module '*.yml' {
  const content: any;
  export default content;
}
```
