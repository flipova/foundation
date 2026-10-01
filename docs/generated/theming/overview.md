# Theming Overview

Theming is registry-driven and has two halves:

- **`design/tokens.xml`** - the atomic values (spacing, colours, typography,
  shadows, animation). Colours live in the `color` token as shaded palette
  entries (e.g. `primary.600`, `gray.200`).
- **`design/themes.xml`** - each theme (`light`, `dark`) maps **semantic roles**
  to token references. The role ids are exactly the gluestack/nativewind CSS
  variable names without the leading `--`, so `primary-foreground` becomes
  `--primary-foreground`, `card-foreground` becomes `--card-foreground`, and so
  on.

At generation time `generate.py` turns those two files into two artifacts:

- **`config.ts`** - every role resolved to a concrete colour and emitted as a
  **space-separated RGB triplet** (the format nativewind/gluestack expect, e.g.
  `37 99 235`), which enables Tailwind opacity modifiers such as `bg-primary/50`;
- **`tokens.js`** - the **entire** Tailwind theme, where each role also becomes a
  `rgb(var(--<role>)/<alpha-value>)` colour, alongside every scale token
  (spacing, radii, breakpoints, typography, shadow, z-index, opacity, motion).

`tailwind.config.js` therefore holds **no design value at all**: it only wires
`extend: tokens.theme`. The XML registries are the single source of truth for
both the runtime variables and every utility class - the registry and the theme
can never drift apart.

See [Tokens](/docs/theming/tokens), **Themes** and the generated **gluestack config** for details.
