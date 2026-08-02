---
title: "Center"
sidebar_label: "Center"
description: "Center"
source: "web/primitives/Center.tsx"
slug: "/web/primitives/Center"
---

# Center

Source file exports:

```ts
import React from 'react';
import { Box, WebBoxProps } from './Box';

export const Center: React.FC<WebBoxProps> = ({ style, children, ...rest }) => (
  <Box
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    }}
    {...rest}
  >
    {children}
  </Box>
);
```
