---
title: "File Picker"
description: "File/image upload input."
type: "component"
category: "input"
slug: "/ui/components/base/FilePicker/FilePicker"
---

# File Picker

> **Type:** `component`  |  **Category:** `input`  |  **Tags:** `file` · `upload` · `image` · `picker` · `form`

File/image upload input.





## Usage Example

```tsx
import React, { useState } from 'react';
import { FoundationProvider, FilePicker, Card, Stack, Text, Button } from '@flipova/foundation';

export default function FilePickerExample() {
  const [value, setValue] = useState('');

  return (
    <FoundationProvider defaultTheme="dark">
      <Card p={5} borderRadius="lg" variant="elevated" style={{ maxWidth: 400 }}>
        <Stack spacing={4}>
          <Text variant="heading" size="md">File Picker Input</Text>
          <FilePicker
          variant="button"
          size="md"
          accept="image/*"
          multiple={false}
          label="Upload file"
          disabled={false}
        value={value} onChangeText={setValue} />
          <Button variant="primary" label="Submit" onPress={() => console.log(value)} />
        </Stack>
      </Card>
    </FoundationProvider>
  );
}
```


## Props & Options

| Prop | Type | Default | Group | Description |
|------|------|---------|-------|-------------|
| `variant` | `enum` | `button` | `style` | Variant |
| `size` | `enum` | `md` | `style` | Size |
| `accept` | `string` | `image/*` | `behavior` | Accept types |
| `multiple` | `boolean` | `false` | `behavior` | Multiple |
| `label` | `string` | `Upload file` | `content` | Label |
| `disabled` | `boolean` | `false` | `behavior` | Disabled |
| `borderRadius` | `radius` | `md` | `style` | Border radius |

## Variants

| Variant | Label | Style Overrides |
|---------|-------|-----------------|
| `button` | Button | – |
| `dropzone` | Drop Zone | – |

## Sizes

Supported sizes: `sm` · `md` · `lg`

## Theme Token Mapping

| Component Property | Theme Token |
|--------------------|-------------|
| `bg` | `theme.muted` |
| `text` | `theme.foreground` |
| `border` | `theme.border` |
| `accent` | `theme.primary` |




## TypeScript Logic & Hook Specifications

### Interface: `FilePickerProps`

Props for the FilePicker component.


| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `onFileSelect` *(optional)* | `(file: any) =&gt; void` | – | Callback fired when a file is successfully selected. |
| `onFileError` *(optional)* | `(error: string) =&gt; void` | – | Callback fired when file validation fails. |
| `disabled` *(optional)* | `boolean` | – | Disables the file picker, preventing interaction if set to true. |
| `label` *(optional)* | `string` | – | The text label displayed inside the file picker button. Defaults to 'Select a file'. |
| `accept` *(optional)* | `string` | – | Optional MIME type to restrict file selection (e.g. 'image/*', 'image/png,image/jpeg'). |
| `maxSizeInMB` *(optional)* | `number` | – | Maximum file size in megabytes. If not specified, no limit is enforced. |
| `allowedExtensions` *(optional)* | `string[]` | – | Array of allowed file extensions (without dot, e.g., ['pdf', 'docx']). If not specified, no extension validation is performed. |
| `key` | `string]: any` | – | – |

### Function: `useFilePickerLogic`

```ts
useFilePickerLogic(props: FilePickerProps)
```

### Function: `useFilePickerStyle`

```ts
useFilePickerStyle(logic: any)
```

