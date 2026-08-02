---
title: CLI & Tooling Guide
sidebar_label: 04. CLI & Tooling
slug: /guides/cli-guide
---

# CLI & Tooling Deep Dive

Flipova Foundation ships with two powerful, standalone command-line executables: **`flipova`** (project scaffolding and configuration) and **`flipova-ds`** (interactive design system and registry manager).

---

## 1. Overview & Dual-Binary Architecture

The CLI tools are designed to streamline project setup, automate token compilation, and generate documentation straight from your terminal without requiring manual code writing.

| Binary | Command | Primary Role |
| :--- | :--- | :--- |
| **Scaffolding CLI** | `npx flipova` | Interactively initializes `flipova.config.ts`, creates directories, and checks peer dependencies. |
| **Design System CLI** | `npx flipova-ds` | Interactive menu to manage themes, index component registries, build tokens, and generate MDX documentation. |

---

## 2. Project Scaffolding (`npx flipova`)

To initialize Flipova Foundation in a new or existing React Native, Expo, or React Web project, run:

```bash
npx flipova
```

### Interactive Walkthrough & Actions:

1. **Configuration Creation:** Generates `flipova.config.ts` at your project root using `defineConfig`.
2. **Directory Structure:** Creates designated folders for custom tokens (`tokens.yaml`), themes (`themes.yaml`), and generated files.
3. **Dependency Auditor:** Verifies whether required Expo peer dependencies (`react-native-screens`, `react-native-safe-area-context`, `react-native-reanimated`, `expo-linear-gradient`, `lucide-react-native`) are installed and provides one-click installation.

### Structure of `flipova.config.ts`

```ts
import { defineConfig } from '@flipova/foundation/config';

export default defineConfig({
  defaultTheme: 'dark',
  themes: {
    dark: {
      primary: '#000091',
    },
  },
  docs: {
    outDir: './docs/docs',
  },
});
```

---

## 3. Interactive Design System CLI (`npx flipova-ds`)

To manage your design tokens, themes, and component metadata interactively:

```bash
npx flipova-ds
```

### Terminal Menu Options:

- **1. Manage Themes:** Interactively add, remove, or inspect custom color schemes. It automatically registers them in your theme registry.
- **2. Manage Registry:** Browse, add, or index UI primitives, base components, and layout blocks.
- **3. Build Tokens:** Recompile `tokens.yaml` and `themes.yaml` into type-safe `generated.ts` files.
- **4. Generate MDX Documentation:** Traverse your codebase, parse TSDoc comments and `.meta.yaml` files, and output a 1-to-1 mirror MDX site.

---

## 4. Non-Interactive Command Reference

You can invoke specific CLI sub-commands directly in CI/CD pipelines or package scripts:

```bash
# Recompile token definitions from tokens.yaml
npx flipova build:tokens

# Recompile theme definitions from themes.yaml
npx flipova build:themes

# Recompile registry metadata index
npx flipova build:registry

# Generate 1-to-1 mirror MDX documentation
npx flipova docs [outDir]
```

### Available CLI Flags for `flipova docs`:

- `[outDir]`: Optional target directory for generated `.md` files (Default: `./docs/docs`).

---

## 5. Documentation Portal Scripts

The root `package.json` includes pre-configured scripts to launch and build the Docusaurus documentation portal:

```bash
# Start Docusaurus development server
npm run docs:dev

# Build static production site into docs/build
npm run docs:build

# Serve & preview static production build locally
npm run docs:preview
```
