# Tokens

`design/tokens.xml` declares the atomic design values. Every token has a
`kind` (`scale`, `map`, `font`, `color`, `shadow`, `animation`) and a set of
`<value>` entries. Token ids are addressable from themes and styles with the
`$ref.tokens.<id>.<value-id>` syntax.

The listing below is generated directly from the registry - it is never
duplicated by hand.


### spacing

`kind=scale` &nbsp;·&nbsp; `unit=px` &nbsp;·&nbsp; `base=4` &nbsp;·&nbsp; `formula=n * 4`

Values: `0`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `3.5`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `14`, `16`, `20`, `24`, `32`, `40`, `48`

Reference syntax: `$ref.tokens.spacing.<value-id>`

### radii

`kind=scale` &nbsp;·&nbsp; `unit=px`

Values: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`

Reference syntax: `$ref.tokens.radii.<value-id>`

### breakpoints

`kind=scale` &nbsp;·&nbsp; `unit=px` &nbsp;·&nbsp; `mode=min-width`

Values: `base`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

Reference syntax: `$ref.tokens.breakpoints.<value-id>`

### family

`kind=font`

Values: `system`, `mono`, `serif`, `sans`, `body`, `heading`, `roboto`

Reference syntax: `$ref.tokens.family.<value-id>`

### fontSizes

`kind=scale` &nbsp;·&nbsp; `unit=px`

Values: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`, `8xl`, `9xl`

Reference syntax: `$ref.tokens.fontSizes.<value-id>`

### fontWeights

`kind=map`

Values: `thin`, `extralight`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`

Reference syntax: `$ref.tokens.fontWeights.<value-id>`

### lineHeights

`kind=scale` &nbsp;·&nbsp; `unit=px`

Values: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`, `8xl`, `9xl`

Reference syntax: `$ref.tokens.lineHeights.<value-id>`

### letterSpacings

`kind=scale` &nbsp;·&nbsp; `unit=em`

Values: `tighter`, `tight`, `normal`, `wide`, `wider`, `widest`

Reference syntax: `$ref.tokens.letterSpacings.<value-id>`

### color

`kind=color`

Values: `primary.50`, `primary.100`, `primary.200`, `primary.300`, `primary.400`, `primary.500`, `primary.600`, `primary.700`, `primary.800`, `primary.900`, `primary.950`, `secondary.50`, `secondary.100`, `secondary.200`, `secondary.300`, `secondary.400`, `secondary.500`, `secondary.600`, `secondary.700`, `secondary.800`, `secondary.900`, `secondary.950`, `gray.50`, `gray.100`, `gray.200`, `gray.300`, `gray.400`, `gray.500`, `gray.600`, `gray.700`, `gray.800`, `gray.900`, `gray.950`, `success.50`, `success.100`, `success.200`, `success.300`, `success.400`, `success.500`, `success.600`, `success.700`, `success.800`, `success.900`, `success.950`, `warning.50`, `warning.100`, `warning.200`, `warning.300`, `warning.400`, `warning.500`, `warning.600`, `warning.700`, `warning.800`, `warning.900`, `warning.950`, `error.50`, `error.100`, `error.200`, `error.300`, `error.400`, `error.500`, `error.600`, `error.700`, `error.800`, `error.900`, `error.950`, `info.50`, `info.100`, `info.200`, `info.300`, `info.400`, `info.500`, `info.600`, `info.700`, `info.800`, `info.900`, `info.950`, `neutral.900`, `white`, `black`, `transparent`

Reference syntax: `$ref.tokens.color.<value-id>`

### shadow

`kind=shadow`

Values: `sm`, `md`, `lg`, `xl`, `hard-1`, `hard-2`, `hard-3`, `hard-4`, `hard-5`, `soft-1`, `soft-2`, `soft-3`, `soft-4`

Reference syntax: `$ref.tokens.shadow.<value-id>`

### zIndex

`kind=map`

Values: `base`, `sticky`, `dropdown`, `popover`, `overlay`, `drawer`, `modal`, `toast`, `tooltip`

Reference syntax: `$ref.tokens.zIndex.<value-id>`

### opacity

`kind=map`

Values: `faint`, `muted`, `dim`, `solid`

Reference syntax: `$ref.tokens.opacity.<value-id>`

### duration

`kind=map` &nbsp;·&nbsp; `unit=ms`

Values: `instant`, `fastest`, `fast`, `normal`, `slow`, `slower`, `slowest`

Reference syntax: `$ref.tokens.duration.<value-id>`

### easing

`kind=animation`

Values: `standard`, `enter`, `exit`, `spring`

Reference syntax: `$ref.tokens.easing.<value-id>`
