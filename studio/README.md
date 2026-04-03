# Flipova Studio

Visual app builder for React Native. Drag & drop layouts, components, and blocks from the foundation registry. Configure props visually. Generate clean, production-ready React Native code.

## Quick start

```bash
npx flipova-studio
```

Opens the builder at http://localhost:4200.

## Commands

| Command | Description |
|---------|-------------|
| `npx flipova-studio` | Start the builder UI on port 4200 |
| `npx flipova-studio --port 3000` | Start on a custom port |
| `npx flipova-studio generate` | Generate code from the saved project |

## How it works

Studio reads the foundation registries (layouts, components, blocks) to know what's available. When you build a page in the UI, it creates a document tree (JSON). The code generator transforms that tree into `.tsx` files that import from `@flipova/foundation`.

```
┌─────────────────────────────────────────────────┐
│  Studio Web UI (http://localhost:4200)           │
│  ┌──────────┐ ┌──────────────┐ ┌─────────────┐  │
│  │ Registry │ │   Canvas     │ │  Props Panel │  │
│  │ Panel    │ │  (drag/drop) │ │  (configure) │  │
│  └──────────┘ └──────────────┘ └─────────────┘  │
└──────────────────────┬──────────────────────────┘
                       │ WebSocket (live sync)
┌──────────────────────▼──────────────────────────┐
│  Studio Server (Express + WS)                    │
│  ├── /api/registry     → foundation registries   │
│  ├── /api/project      → project CRUD            │
│  ├── /api/pages/:id    → page tree CRUD          │
│  └── /api/generate     → code generation         │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  .flipova-studio/project.json                    │
│  (document tree, pages, services, navigation)    │
└──────────────────────┬──────────────────────────┘
                       │ generate
┌──────────────────────▼──────────────────────────┐
│  ./generated/                                    │
│  ├── App.tsx                                     │
│  ├── screens/HomeScreen.tsx                      │
│  ├── navigation/index.tsx                        │
│  ├── theme/index.ts                              │
│  └── services/...                                │
└─────────────────────────────────────────────────┘
```

## REST API

### Registry (read-only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/registry` | All registries (layouts, components, blocks) |
| GET | `/api/registry/layouts` | Layout registry only |
| GET | `/api/registry/components` | Component registry only |
| GET | `/api/registry/blocks` | Block registry only |

### Project

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/project` | Load the current project |
| PUT | `/api/project` | Save the entire project |
| PUT | `/api/project/theme` | Change the active theme |
| PUT | `/api/project/navigation` | Update navigation config |
| POST | `/api/project/services` | Add a service |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pages` | Create a new page |
| PUT | `/api/pages/:id` | Update a page (tree, name, route) |
| DELETE | `/api/pages/:id` | Delete a page |

### Code generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate full project to `./generated/` |
| POST | `/api/generate/preview/:pageId` | Preview generated code for one page |

## WebSocket

Connect to `ws://localhost:4200/ws` for live updates.

### Events (server → client)

| Event | Payload | When |
|-------|---------|------|
| `page:created` | PageDocument | New page created |
| `page:updated` | PageDocument | Page tree modified |
| `page:deleted` | `{ id }` | Page removed |
| `theme:changed` | `{ theme }` | Theme switched |

## Document tree format

Each page is a tree of nodes:

```json
{
  "id": "node_123",
  "kind": "layout",
  "registryId": "DashboardLayout",
  "props": { "spacing": 4, "borderRadius": "md" },
  "children": [
    {
      "id": "node_124",
      "kind": "block",
      "registryId": "HeaderBlock",
      "props": { "height": 56 },
      "children": [],
      "slotName": "header"
    },
    {
      "id": "node_125",
      "kind": "component",
      "registryId": "Button",
      "props": { "label": "Click me", "variant": "primary" },
      "variant": "primary",
      "children": [],
      "slotName": "content"
    }
  ]
}
```

### Node kinds

| Kind | Description | Example |
|------|-------------|---------|
| `layout` | Page-level layout | DashboardLayout, AuthLayout |
| `component` | Base UI component | Button, TextInput |
| `block` | Functional block | AuthFormBlock, HeaderBlock |
| `slot` | Named content area | header, sidebar, footer |
| `text` | Raw text node | "Hello world" |

## Generated code example

Input tree → Output `.tsx`:

```tsx
import React from "react";
import { DashboardLayout, Button, HeaderBlock } from "@flipova/foundation";

export default function HomeScreen() {
  return (
    <DashboardLayout spacing={4} borderRadius="md">
      <HeaderBlock height={56} />
      <Button label="Click me" variant="primary" />
    </DashboardLayout>
  );
}
```

## Project structure

```
studio/
├── cli/index.ts           CLI entry point (npx flipova-studio)
├── server/
│   ├── index.ts           Express + WebSocket server
│   └── api.ts             REST API routes
├── engine/
│   ├── tree/
│   │   ├── types.ts       TreeNode, PageDocument, ProjectDocument
│   │   └── operations.ts  createNode, insertChild, removeNode, moveNode, updateProps
│   └── codegen/
│       ├── generator.ts   Page → .tsx code
│       └── project.ts     Project → full app scaffold
└── README.md              This file
```
