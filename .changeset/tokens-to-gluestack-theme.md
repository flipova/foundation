---
"@flipova/foundation": major
---

The design system is now a **single registry-driven pipeline**: the XML registries
are the only source of truth, and they generate the entire gluestack/nativewind
theme.

```
design/tokens.xml  ┐
                   ├─> components/ui/gluestack-ui-provider/config.ts   (colour vars, light/dark)
design/themes.xml  ┘   components/ui/gluestack-ui-provider/tokens.js   (the whole Tailwind theme)
```

Role ids in `themes.xml` are now the gluestack CSS variable names
(`primary-foreground`, `card-foreground`, ...), emitted as space-separated RGB
triplets so Tailwind opacity modifiers (`bg-primary/50`) keep working.

## Breaking changes

- **The XML element generator is gone.** `uiElement` / `uiHook` definitions, the
  5-files-per-element output, the generated `foundation/**` tree, the showroom
  pages and the generated vitest suites are removed. The component source under
  `components/ui` is now edited directly. `design/schema.xsd` only declares
  `foundationRegistry`, `documentation`, `tokens` and `themes`.
- **`tailwind.config.js` no longer contains design values.** Consumers must wire
  the generated theme themselves:
  ```js
  const tokens = require('@flipova/foundation/tokens');
  module.exports = { presets: [require('nativewind/preset')], theme: { extend: tokens.theme } };
  ```
  `tailwind.config.js`, `globals.css` and `postcss.config.js` are app-level files
  and are not published; see the Installation page for the three-file setup.
- **Removed Tailwind aliases** (all unused in `components/`): colours
  `chart-1..5`, `sidebar-*`, `typography-*`; font families `inter`, `georgia`,
  `melno`, `andika`, `outfit`; font weight `extrablack`.
- **`font-mono` / `font-serif` now resolve from the registry** (literal stacks)
  instead of `var(--font-mono)` / `var(--font-serif)`.
- Apps must define `--font-sans` (used by `font-sans` / `font-body`) and
  `--font-heading` if those families are used; otherwise the text falls back to
  the inherited font. `font-system`, `font-mono` and `font-serif` need no
  variable.

## Added

- New `@flipova/foundation/tokens` export (typed) exposing the generated Tailwind
  theme, so the design tokens are reachable by package name.
- Semantic colours `success`, `warning`, `error`, `info` and every
  `*-foreground` counterpart are now available as utilities
  (`bg-success`, `text-error-foreground`, ...) - the variables existed but were
  not mapped in Tailwind.
- `font-roboto` now resolves (it was previously absent from the Tailwind config
  and silently produced nothing).
- Scale tokens are exposed as utilities: `spacing`, `borderRadius`, `screens`
  (`xs:` `md:` `lg:` `2xl:`), `fontSize` (including `text-2xs`), `fontWeight`,
  `lineHeight`, `letterSpacing`, `boxShadow` (including `shadow-hard-*` /
  `shadow-soft-*`), `zIndex` (`z-modal`, `z-toast`, ...), `opacity`,
  `transitionDuration` and `transitionTimingFunction`.
