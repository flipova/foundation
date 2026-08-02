---
title: "Tabs"
sidebar_label: "Tabs"
description: "Tabs"
source: "web/components/Tabs.tsx"
slug: "/web/components/Tabs"
---

# Tabs

## Interfaces & Types

### `TabItem`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | `string` | – | – |
| `label` | `string` | – | – |
| `icon` *(optional)* | `React.ReactNode` | – | – |

### `WebTabsProps`
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `TabItem[]` | – | – |
| `activeId` | `string` | – | – |
| `onChange` | `(id: string) =&gt; void` | – | – |
| `style` *(optional)* | `React.CSSProperties` | – | – |

