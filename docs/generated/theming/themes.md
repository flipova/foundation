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

### spring-light

`mode=light`

| Role | Reference |
|---|---|
| `background` | `$ref.tokens.color.success.50` |
| `foreground` | `$ref.tokens.color.success.900` |
| `card` | `$ref.tokens.color.white` |
| `card-foreground` | `$ref.tokens.color.success.900` |
| `popover` | `$ref.tokens.color.white` |
| `popover-foreground` | `$ref.tokens.color.success.900` |
| `primary` | `$ref.tokens.color.success.600` |
| `primary-foreground` | `$ref.tokens.color.white` |
| `secondary` | `$ref.tokens.color.success.500` |
| `secondary-foreground` | `$ref.tokens.color.white` |
| `muted` | `$ref.tokens.color.success.100` |
| `muted-foreground` | `$ref.tokens.color.success.700` |
| `accent` | `$ref.tokens.color.success.200` |
| `accent-foreground` | `$ref.tokens.color.success.900` |
| `destructive` | `$ref.tokens.color.error.600` |
| `destructive-foreground` | `$ref.tokens.color.white` |
| `border` | `$ref.tokens.color.success.200` |
| `input` | `$ref.tokens.color.success.200` |
| `ring` | `$ref.tokens.color.success.400` |
| `success` | `$ref.tokens.color.success.600` |
| `success-foreground` | `$ref.tokens.color.white` |
| `warning` | `$ref.tokens.color.warning.600` |
| `warning-foreground` | `$ref.tokens.color.white` |
| `error` | `$ref.tokens.color.error.600` |
| `error-foreground` | `$ref.tokens.color.white` |
| `info` | `$ref.tokens.color.info.600` |
| `info-foreground` | `$ref.tokens.color.white` |

Reference syntax: `$ref.themes.<role>` -> `--<role>` in the generated config

### spring-dark

`mode=dark`

| Role | Reference |
|---|---|
| `background` | `$ref.tokens.color.success.950` |
| `foreground` | `$ref.tokens.color.success.50` |
| `card` | `$ref.tokens.color.success.900` |
| `card-foreground` | `$ref.tokens.color.success.50` |
| `popover` | `$ref.tokens.color.success.900` |
| `popover-foreground` | `$ref.tokens.color.success.50` |
| `primary` | `$ref.tokens.color.success.400` |
| `primary-foreground` | `$ref.tokens.color.success.950` |
| `secondary` | `$ref.tokens.color.success.300` |
| `secondary-foreground` | `$ref.tokens.color.success.950` |
| `muted` | `$ref.tokens.color.success.900` |
| `muted-foreground` | `$ref.tokens.color.success.200` |
| `accent` | `$ref.tokens.color.success.800` |
| `accent-foreground` | `$ref.tokens.color.success.50` |
| `destructive` | `$ref.tokens.color.error.500` |
| `destructive-foreground` | `$ref.tokens.color.white` |
| `border` | `$ref.tokens.color.success.800` |
| `input` | `$ref.tokens.color.success.800` |
| `ring` | `$ref.tokens.color.success.300` |
| `success` | `$ref.tokens.color.success.400` |
| `success-foreground` | `$ref.tokens.color.success.950` |
| `warning` | `$ref.tokens.color.warning.400` |
| `warning-foreground` | `$ref.tokens.color.success.950` |
| `error` | `$ref.tokens.color.error.400` |
| `error-foreground` | `$ref.tokens.color.success.950` |
| `info` | `$ref.tokens.color.info.400` |
| `info-foreground` | `$ref.tokens.color.success.950` |

Reference syntax: `$ref.themes.<role>` -> `--<role>` in the generated config
