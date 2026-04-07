# Flipova Studio

Visual app builder for React Native. Drag & drop layouts, components, and blocks from the foundation registry. Configure props visually. Generate clean React Native code.

## Quick start

```bash
npx flipova-studio
```

This single command:
1. Builds the web UI if not already built
2. Starts the Express server on port 4200
3. Opens the builder at http://localhost:4200

## Commands

| Command | Description |
|---------|-------------|
| `npx flipova-studio` | Start the builder (auto-builds UI if needed) |
| `npx flipova-studio --port 3000` | Start on a custom port |
| `npx flipova-studio --dev` | Dev mode: API on 4200 + Vite HMR on 5173 |
| `npx flipova-studio generate` | Generate code from the saved project |

## Development

For working on the studio UI itself:

```bash
npx flipova-studio --dev
```

This starts:
- Express API server on http://localhost:4200
- Vite dev server on http://localhost:5173 (with hot reload and API proxy)

Open http://localhost:5173 for the dev experience with instant updates.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  React Web UI (Vite + React + TypeScript)        │
│  studio/web/src/                                 │
│  Built to studio/web/dist/ → served by Express   │
└──────────────────────┬──────────────────────────┘
                       │ fetch /api/* + WebSocket /ws
┌──────────────────────▼──────────────────────────┐
│  Express Server (studio/server/)                 │
│  ├── /api/registry     → foundation registries   │
│  ├── /api/project      → project CRUD            │
│  ├── /api/pages/:id    → page tree CRUD          │
│  └── /api/generate     → code generation         │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  .flipova-studio/project.json                    │
└──────────────────────┬──────────────────────────┘
                       │ generate
┌──────────────────────▼──────────────────────────┐
│  ./generated/                                    │
│  ├── App.tsx                                     │
│  ├── screens/*.tsx                               │
│  ├── navigation/index.tsx                        │
│  ├── theme/index.ts                              │
│  └── services/*.ts                               │
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

| Event | Payload | When |
|-------|---------|------|
| `page:created` | PageDocument | New page created |
| `page:updated` | PageDocument | Page tree modified |
| `page:deleted` | `{ id }` | Page removed |
| `theme:changed` | `{ theme }` | Theme switched |

## Project structure

```
studio/
├── cli/index.ts           CLI entry point (npx flipova-studio)
├── server/
│   ├── index.ts           Express + WebSocket server
│   └── api.ts             REST API routes (imports foundation registries)
├── engine/
│   ├── tree/
│   │   ├── types.ts       TreeNode, PageDocument, ProjectDocument
│   │   └── operations.ts  Immutable tree operations
│   └── codegen/
│       ├── generator.ts   Page → .tsx code
│       └── project.ts     Project → full app scaffold
└── web/                   React app (Vite + TypeScript)
    ├── src/               React components
    ├── dist/              Built statics (served by Express)
    └── package.json       Separate deps (react, react-dom, vite)
```
