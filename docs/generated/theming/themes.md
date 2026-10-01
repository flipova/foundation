# Themes

`design/themes.xml` declares the themes (`default="light"`). Each theme holds a
`roleMap` of semantic roles to colour token references. A role id is the
gluestack CSS variable name without the leading `--`, so the registry and the
runtime config stay in lockstep.

The generated listing below reflects the current registry.


Default theme: `light`

### light

`mode=light`  *(default)*

| Role | Reference |
|---|---|
| `background` | `$ref.tokens.color.gray.50` |
| `foreground` | `$ref.tokens.color.gray.900` |
| `card` | `$ref.tokens.color.white` |
| `card-foreground` | `$ref.tokens.color.gray.900` |
| `popover` | `$ref.tokens.color.white` |
| `popover-foreground` | `$ref.tokens.color.gray.900` |
| `primary` | `$ref.tokens.color.primary.600` |
| `primary-foreground` | `$ref.tokens.color.white` |
| `secondary` | `$ref.tokens.color.secondary.600` |
| `secondary-foreground` | `$ref.tokens.color.white` |
| `muted` | `$ref.tokens.color.gray.100` |
| `muted-foreground` | `$ref.tokens.color.gray.600` |
| `accent` | `$ref.tokens.color.primary.50` |
| `accent-foreground` | `$ref.tokens.color.primary.900` |
| `destructive` | `$ref.tokens.color.error.600` |
| `destructive-foreground` | `$ref.tokens.color.white` |
| `border` | `$ref.tokens.color.gray.200` |
| `input` | `$ref.tokens.color.gray.200` |
| `ring` | `$ref.tokens.color.primary.500` |
| `success` | `$ref.tokens.color.success.600` |
| `success-foreground` | `$ref.tokens.color.white` |
| `warning` | `$ref.tokens.color.warning.600` |
| `warning-foreground` | `$ref.tokens.color.white` |
| `error` | `$ref.tokens.color.error.600` |
| `error-foreground` | `$ref.tokens.color.white` |
| `info` | `$ref.tokens.color.info.600` |
| `info-foreground` | `$ref.tokens.color.white` |

Reference syntax: `$ref.themes.<role>` -> `--<role>` in the generated config

### dark

`mode=dark`

| Role | Reference |
|---|---|
| `background` | `$ref.tokens.color.gray.900` |
| `foreground` | `$ref.tokens.color.gray.100` |
| `card` | `$ref.tokens.color.gray.800` |
| `card-foreground` | `$ref.tokens.color.gray.100` |
| `popover` | `$ref.tokens.color.gray.800` |
| `popover-foreground` | `$ref.tokens.color.gray.100` |
| `primary` | `$ref.tokens.color.primary.500` |
| `primary-foreground` | `$ref.tokens.color.white` |
| `secondary` | `$ref.tokens.color.secondary.500` |
| `secondary-foreground` | `$ref.tokens.color.white` |
| `muted` | `$ref.tokens.color.gray.800` |
| `muted-foreground` | `$ref.tokens.color.gray.400` |
| `accent` | `$ref.tokens.color.primary.900` |
| `accent-foreground` | `$ref.tokens.color.primary.100` |
| `destructive` | `$ref.tokens.color.error.500` |
| `destructive-foreground` | `$ref.tokens.color.white` |
| `border` | `$ref.tokens.color.gray.700` |
| `input` | `$ref.tokens.color.gray.700` |
| `ring` | `$ref.tokens.color.primary.400` |
| `success` | `$ref.tokens.color.success.500` |
| `success-foreground` | `$ref.tokens.color.gray.900` |
| `warning` | `$ref.tokens.color.warning.500` |
| `warning-foreground` | `$ref.tokens.color.gray.900` |
| `error` | `$ref.tokens.color.error.500` |
| `error-foreground` | `$ref.tokens.color.white` |
| `info` | `$ref.tokens.color.info.500` |
| `info-foreground` | `$ref.tokens.color.white` |

Reference syntax: `$ref.themes.<role>` -> `--<role>` in the generated config
