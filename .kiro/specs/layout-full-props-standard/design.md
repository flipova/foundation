# Design Document — layout-full-props-standard

## Overview

This feature completes the prop-exposure work started in `layout-props-full-control`. It has two orthogonal concerns:

1. **Multi-item standard** — `DeckLayout`, `FlipLayout`, and `SwiperLayout` currently use `cards` / `slides` as their primary slot name. The Studio's `slotConfig.ts` and `ItemsRenderer` already handle any slot with `array: true` by passing items via the slot's `name` as a prop. Renaming the slot to `items` (while keeping `cards`/`slides` as backward-compat aliases in the component) aligns these three layouts with the rest of the multi-item family.

2. **Registry completeness** — Every layout has hardcoded values in its TSX that are not exposed as `PropDescriptor` entries. This makes them invisible to the Studio design panel. Each new descriptor must carry a `default` (or `themeDefault`) that exactly reproduces the previously hardcoded value, guaranteeing zero visual change when no explicit prop is passed.

The work is purely additive: new `PropDescriptor` entries in `layouts.ts`, slot renames in `layouts.ts`, and corresponding prop additions in the TSX interfaces. No existing prop is removed or renamed.

---

## Architecture

```
foundation/layout/
  registry/
    layouts.ts          ← PropDescriptor additions + slot renames
    __tests__/
      layouts.registry.test.ts  ← new property-based tests
  ui/
    DeckLayout.tsx      ← slot rename cards→items (backward compat kept)
    FlipLayout.tsx      ← slot rename cards→items (backward compat kept)
    SwiperLayout.tsx    ← slot rename slides→items (backward compat kept)
    CenteredLayout.tsx  ← mobilePadding / desktopPadding props
    AuthLayout.tsx      ← formMaxWidth / formScrollPaddingY / formScrollPaddingX
    DashboardLayout.tsx ← headerPaddingX / mobileHeaderMinHeight
    ResponsiveLayout.tsx← mobileHeaderHeight / tabletFooterHeight / sidebarMaxWidth
    SidebarLayout.tsx   ← sidebarMinWidth / sidebarMaxWidth
    ScrollLayout.tsx    ← mobileHeaderHeight / mobileFooterHeight
    HeaderContentLayout.tsx ← scrollEventThrottle
    BottomDrawerLayout.tsx  ← handleBarColor / handleButtonSize
    TopDrawerLayout.tsx     ← closeButtonSize / closeButtonBorderColor / closeButtonTextColor
    LeftDrawerLayout.tsx    ← handleBarColor / handleBarWidth
    CrossTabLayout.tsx  ← background prop
```

The Studio pipeline is unchanged: `slotConfig.ts` derives `mode: 'items'` for any slot with `array: true`, and `ItemsRenderer` passes the resolved array as `{ [slotName]: items }`. Renaming the slot from `cards` to `items` means `ItemsRenderer` will pass `{ items: [...] }` instead of `{ cards: [...] }` — which is exactly what the updated components expect as their primary prop.

---

## Components and Interfaces

### Multi-item standard pattern

All multi-item layouts follow this contract:

**Registry (`layouts.ts`)**
```ts
{
  slots: [{ name: "items", label: "...", required: true, array: true }],
  previewItemCount: N,   // N >= 3
}
```

**Component interface**
```ts
interface MyLayoutProps {
  items?: React.ReactNode[];          // primary — Studio injects here
  cards?: React.ReactNode[];          // alias (DeckLayout / FlipLayout only)
  slides?: React.ReactNode[];         // alias (SwiperLayout only)
  children?: React.ReactNode | React.ReactNode[]; // backward compat
}
```

**Resolution priority** (inside component)
```ts
const rawItems =
  Array.isArray(itemsProp) && itemsProp.length > 0 ? itemsProp
  : Array.isArray(aliasProp) && aliasProp.length > 0 ? aliasProp
  : Array.isArray(childrenProp) ? childrenProp
  : React.Children.toArray(childrenProp);

const resolvedItems = useStudioItems(rawItems, META.previewItemCount!, placeholder);
```

### Registry slot changes

| Layout | Old slot name | New slot name | Alias kept in TSX |
|---|---|---|---|
| DeckLayout | `cards` | `items` | `cards` |
| FlipLayout | `cards` | `items` | `cards` |
| SwiperLayout | `slides` | `items` | `slides` |
| GridLayout | `items` | `items` | — (already correct) |
| MasonryLayout | `items` | `items` | — (already correct) |
| BentoLayout | `items` | `items` | — (already correct) |
| CrossTabLayout | `items` | `items` | — (already correct) |
| ParallaxLayout | `items` | `items` | — (already correct) |

---

## Data Models

### PropDescriptor additions per layout

Below is the exhaustive list of new `PropDescriptor` entries. Every entry that was previously hardcoded carries the exact hardcoded value as its `default` or `themeDefault`.

---

#### DeckLayout

Slot change: `cards` → `items` (label: `"Cartes"`, `array: true`).

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `peekRotation` | `number` | `layout` | `0` | rotation angle of background cards |
| `direction` | `enum` | `behavior` | `"horizontal"` | options: `["horizontal","vertical"]` |
| `background` | `color` | `style` | themeDefault: `"background"` | root container bg |

TSX changes in `DeckLayout.tsx`:
- Destructure `peekRotation`, `direction`, `background` from `applyDefaults`
- Apply `bg={background}` to the root `Box`
- Pass `peekRotation` to the `renderBackgroundCards` rotation transform
- Use `direction` to determine swipe axis in the gesture handler

---

#### FlipLayout

Slot change: `cards` → `items` (label: `"Faces recto"`, `array: true`).

Props already in registry: `flipPerspective` (default: `1200`), `swipeThreshold` (default: `40`).

Registry change: remove `swipeThreshold` from `constants` (it is already in `props`). The `constants` block currently has `swipeThreshold: 40` — this must be removed to avoid duplication. The component already reads `swipeThreshold` from `applyDefaults`, so no TSX change needed beyond the registry cleanup.

No new props needed beyond what is already declared.

---

#### SwiperLayout

Slot change: `slides` → `items` (label: `"Slides"`, `array: true`).

Props already in registry: `preloadRange` (default: `2`), `swipeThreshold` (default: `40`).

Registry change: remove `swipeThreshold` from `constants`. The component already reads it from `applyDefaults`.

No new props needed.

---

#### GridLayout

All required props are already in the registry (verified against requirements). No changes needed.

---

#### MasonryLayout

All required props are already in the registry. No changes needed.

---

#### BentoLayout

All required props are already in the registry. No changes needed.

---

#### CrossTabLayout

New prop to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `background` | `color` | `style` | themeDefault: `"background"` | root `GestureHandlerRootView` bg |

TSX change: apply `style={{ flex: 1, backgroundColor: background }}` to `GestureHandlerRootView`.

---

#### ParallaxLayout

All required props are already in the registry (`previewItemCount: 9` already set). No changes needed.

---

#### RootLayout

All required props are already in the registry. No changes needed.

---

#### VoidLayout

All required props are already in the registry. No changes needed.

---

#### CenteredLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `mobilePadding` | `spacing` | `layout` | `4` | replaces hardcoded `p={isMobile ? 4 : 6}` |
| `desktopPadding` | `spacing` | `layout` | `6` | replaces hardcoded `p={6}` on desktop |

TSX change: replace `<Center p={isMobile ? 4 : 6}>` with `<Center p={isMobile ? mobilePadding : desktopPadding}>`.

---

#### AuthLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `formMaxWidth` | `number` | `layout` | `520` | replaces hardcoded `maxWidth={520}` |
| `formScrollPaddingY` | `spacing` | `layout` | `8` | replaces hardcoded `py={8}` |
| `formScrollPaddingX` | `spacing` | `layout` | `4` | replaces hardcoded `px={4}` |

TSX changes:
- `<Scroll py={formScrollPaddingY} px={formScrollPaddingX}>`
- `<Stack ... maxWidth={formMaxWidth}>`

---

#### DashboardLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `headerPaddingX` | `spacing` | `layout` | `4` | replaces hardcoded `px={4}` in header |
| `mobileHeaderMinHeight` | `number` | `layout` | `60` | replaces hardcoded `minHeight={60}` on mobile |

TSX changes:
- `<Box ... px={headerPaddingX}>` on the header Box
- `minHeight={isMobile ? mobileHeaderMinHeight : undefined}` on the header Box

---

#### ResponsiveLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `mobileHeaderHeight` | `number` | `layout` | `56` | replaces hardcoded `isMobile ? 56 : headerHeight` |
| `tabletFooterHeight` | `number` | `layout` | `48` | replaces hardcoded `isTabletRange && collapseFooterOnTablet ? 48 : footerHeight` |
| `sidebarMaxWidth` | `number` | `layout` | `320` | replaces hardcoded `Math.min(sidebarWidth, 320)` |

TSX changes:
- `hHeight: isMobile ? mobileHeaderHeight : headerHeight`
- `fHeight: isTabletRange && collapseFooterOnTablet ? tabletFooterHeight : footerHeight`
- `sWidth: Math.min(sidebarWidth, sidebarMaxWidth)`

---

#### FlexLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `align` | `enum` | `layout` | `"stretch"` | options: `["stretch","flex-start","center","flex-end","baseline"]` |
| `justify` | `enum` | `layout` | `"flex-start"` | options: `["flex-start","center","flex-end","space-between","space-around","space-evenly"]` |

Both props are already used in the TSX (`alignItems={align}`, `justifyContent={justify}`) but missing from the registry.

---

#### SplitLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `leftBorderRadius` | `radius` | `style` | `"none"` | per-panel border radius |
| `rightBorderRadius` | `radius` | `style` | `"none"` | per-panel border radius |

TSX changes: apply `borderRadius={leftBorderRadius}` to left panel Box, `borderRadius={rightBorderRadius}` to right panel Box (instead of sharing the global `borderRadius`).

---

#### FooterLayout

All required props are already in the registry. No changes needed.

---

#### SidebarLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `sidebarMinWidth` | `number` | `layout` | `150` | replaces hardcoded `minWidth: 150` in resize style |
| `sidebarMaxWidth` | `number` | `layout` | `600` | replaces hardcoded `maxWidth: 600` in resize style |

TSX change: replace `minWidth: 150, maxWidth: 600` with `minWidth: sidebarMinWidth, maxWidth: sidebarMaxWidth` in the `canResize` style object.

---

#### BottomDrawerLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `handleBarColor` | `color` | `style` | themeDefault: `"border"` | replaces hardcoded `theme.border` on the handle bar |
| `handleButtonSize` | `number` | `layout` | `56` | replaces hardcoded `width: 56` on the Fingerprint button |

Registry change: `contentScaleWhenOpen` default should be `0.95` (requirements say 0.95; current registry has `0.95` — already correct).

TSX changes:
- `<Box ... bg={handleBarColor}>` on the handle bar inside the drawer
- `width: handleButtonSize` on the handle button style

---

#### TopDrawerLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `closeButtonSize` | `number` | `layout` | `36` | replaces hardcoded `width: 36, height: 36` |
| `closeButtonBorderColor` | `color` | `style` | themeDefault: `"border"` | replaces hardcoded `${theme.border}30` |
| `closeButtonTextColor` | `color` | `style` | themeDefault: `"mutedForeground"` | replaces hardcoded `theme.mutedForeground` |

TSX changes:
- `width: closeButtonSize, height: closeButtonSize, borderRadius: closeButtonSize / 2`
- `borderColor: closeButtonBorderColor`
- `color: closeButtonTextColor` on the `×` Text

---

#### LeftDrawerLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `handleBarColor` | `color` | `style` | themeDefault: `"border"` | replaces hardcoded `theme.border` on the vertical handle bar |
| `handleBarWidth` | `number` | `layout` | `40` | replaces hardcoded `width={40}` on the gesture zone |

TSX changes:
- `<Box ... bg={handleBarColor}>` on the handle bar
- `width={handleBarWidth}` on the gesture zone Box

---

#### ScrollLayout

New props to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `mobileHeaderHeight` | `number` | `layout` | `60` | replaces hardcoded `isMobile ? 60 : headerHeight` |
| `mobileFooterHeight` | `number` | `layout` | `50` | replaces hardcoded `isMobile ? 50 : footerHeight` |

TSX change: `h: isMobile ? mobileHeaderHeight : headerHeight`, `f: isMobile ? mobileFooterHeight : footerHeight`.

---

#### HeaderContentLayout

New prop to add:

| name | type | group | default / themeDefault | notes |
|---|---|---|---|---|
| `scrollEventThrottle` | `number` | `behavior` | `16` | replaces hardcoded `scrollEventThrottle={16}` |

TSX change: `<Animated.ScrollView scrollEventThrottle={scrollEventThrottle} ...>`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Multi-item layouts use slot name "items"

*For any* layout in the registry whose primary slot has `array: true`, that slot's `name` SHALL be `"items"`.

**Validates: Requirements 1.5, 2.5, 3.5, 4.1–4.5, 30.4**

---

### Property 2: Multi-item layouts declare previewItemCount

*For any* layout in the registry whose primary slot has `array: true`, the layout SHALL declare `previewItemCount` with a value ≥ 3.

**Validates: Requirements 1.6, 2.6, 3.6, 4.6, 12.2, 30.1**

---

### Property 3: useStudioItems returns placeholders for empty input

*For any* count N ≥ 1 and any placeholder factory, calling `useStudioItems([], N, factory)` SHALL return exactly N items, all produced by the factory.

**Validates: Requirements 1.7, 2.7, 3.7, 4.7**

---

### Property 4: Zero-breaking-change defaults

*For any* layout in the registry, calling `applyDefaults({}, META, theme)` SHALL return an object where every prop with a declared `default` has exactly that default value, and every prop with a `themeDefault` has the corresponding theme color value.

**Validates: Requirements 28.1, 28.2**

---

### Property 5: Ratio props have min and max

*For any* `PropDescriptor` in the registry with `type: "ratio"`, both `min` and `max` SHALL be defined (not undefined).

**Validates: Requirements 29.4, 30.2**

---

### Property 6: Enum props have non-empty options

*For any* `PropDescriptor` in the registry with `type: "enum"`, `options` SHALL be a non-empty array.

**Validates: Requirements 29.5, 30.3**

---

### Property 7: Group values are valid

*For any* `PropDescriptor` in the registry, `group` SHALL be one of `"style"`, `"layout"`, `"behavior"`, `"content"`.

**Validates: Requirement 29.6**

---

### Property 8: Color props use correct type

*For any* `PropDescriptor` in the registry where the prop name ends with `"Background"`, `"Color"`, or equals `"background"`, the `type` SHALL be `"color"` or `"background"` (never `"string"`).

**Validates: Requirement 29.1**

---

## Error Handling

- **Missing META**: All layouts call `getLayoutMeta(id)!` with a non-null assertion. If a layout ID is misspelled in the registry, the component will throw at module load time. This is intentional — it surfaces misconfiguration immediately.
- **Empty items array**: `useStudioItems` handles this gracefully by returning `previewItemCount` placeholders. The placeholder factory receives the index and must return a valid `ReactNode`.
- **Invalid prop values**: `applyDefaults` does not validate prop values against their declared type. Type safety is enforced at the TypeScript interface level in each component.
- **Slot name mismatch**: If the registry slot name does not match the prop name the component reads, `ItemsRenderer` will pass items to the wrong prop and the layout will render empty. The design ensures slot name === primary prop name for all multi-item layouts.

---

## Testing Strategy

### Dual testing approach

Unit tests verify specific examples and edge cases. Property-based tests verify universal invariants across all layouts and all inputs. Both are required.

### Unit tests (examples)

Add to `foundation/layout/registry/__tests__/layouts.registry.test.ts`:

- DeckLayout slot is `{ name: "items", array: true }` and `previewItemCount === 4`
- FlipLayout slot is `{ name: "items", array: true }` and `previewItemCount === 3`
- SwiperLayout slot is `{ name: "items", array: true }` and `previewItemCount === 4`
- DeckLayout has `peekRotation` prop with `default: 0`
- DeckLayout has `direction` prop with `default: "horizontal"` and options `["horizontal","vertical"]`
- DeckLayout has `background` prop with `themeDefault: "background"`
- FlipLayout `constants` does NOT contain `swipeThreshold` (moved to props)
- SwiperLayout `constants` does NOT contain `swipeThreshold` (moved to props)
- FlipLayout has `flipPerspective` prop with `default: 1200`
- FlipLayout has `swipeThreshold` prop with `default: 40`
- SwiperLayout has `preloadRange` prop with `default: 2`
- SwiperLayout has `swipeThreshold` prop with `default: 40`
- CrossTabLayout has `background` prop with `themeDefault: "background"`
- CenteredLayout has `mobilePadding` prop with `default: 4`
- CenteredLayout has `desktopPadding` prop with `default: 6`
- AuthLayout has `formMaxWidth` prop with `default: 520`
- AuthLayout has `formScrollPaddingY` prop with `default: 8`
- AuthLayout has `formScrollPaddingX` prop with `default: 4`
- DashboardLayout has `headerPaddingX` prop with `default: 4`
- DashboardLayout has `mobileHeaderMinHeight` prop with `default: 60`
- ResponsiveLayout has `mobileHeaderHeight` prop with `default: 56`
- ResponsiveLayout has `tabletFooterHeight` prop with `default: 48`
- ResponsiveLayout has `sidebarMaxWidth` prop with `default: 320`
- FlexLayout has `align` prop with `default: "stretch"`
- FlexLayout has `justify` prop with `default: "flex-start"`
- SplitLayout has `leftBorderRadius` and `rightBorderRadius` props with `default: "none"`
- SidebarLayout has `sidebarMinWidth` prop with `default: 150`
- SidebarLayout has `sidebarMaxWidth` prop with `default: 600`
- BottomDrawerLayout has `handleBarColor` prop with `themeDefault: "border"`
- BottomDrawerLayout has `handleButtonSize` prop with `default: 56`
- TopDrawerLayout has `closeButtonSize` prop with `default: 36`
- TopDrawerLayout has `closeButtonBorderColor` prop with `themeDefault: "border"`
- TopDrawerLayout has `closeButtonTextColor` prop with `themeDefault: "mutedForeground"`
- LeftDrawerLayout has `handleBarColor` prop with `themeDefault: "border"`
- LeftDrawerLayout has `handleBarWidth` prop with `default: 40`
- ScrollLayout has `mobileHeaderHeight` prop with `default: 60`
- ScrollLayout has `mobileFooterHeight` prop with `default: 50`
- HeaderContentLayout has `scrollEventThrottle` prop with `default: 16`

### Property-based tests

Use `fast-check` (already in the test suite). Minimum 100 iterations per test.

```ts
// Feature: layout-full-props-standard, Property 1: multi-item slot name is "items"
fc.assert(fc.property(
  fc.constantFrom(...layoutRegistry.filter(m => m.slots.some(s => s.array))),
  (meta) => meta.slots.filter(s => s.array).every(s => s.name === "items")
), { numRuns: 100 });

// Feature: layout-full-props-standard, Property 2: previewItemCount >= 3 for array slots
fc.assert(fc.property(
  fc.constantFrom(...layoutRegistry.filter(m => m.slots.some(s => s.array))),
  (meta) => (meta.previewItemCount ?? 0) >= 3
), { numRuns: 100 });

// Feature: layout-full-props-standard, Property 3: useStudioItems returns N placeholders for empty input
fc.assert(fc.property(
  fc.integer({ min: 1, max: 20 }),
  (n) => {
    const result = useStudioItems([], n, (i) => i);
    return result.length === n;
  }
), { numRuns: 100 });

// Feature: layout-full-props-standard, Property 4: zero-breaking-change defaults
fc.assert(fc.property(
  fc.constantFrom(...layoutRegistry.filter(m => m.props.some(p => p.default !== undefined))),
  (meta) => {
    const result = applyDefaults({}, meta, mockTheme);
    return meta.props.filter(p => p.default !== undefined)
      .every(p => JSON.stringify(result[p.name]) === JSON.stringify(p.default));
  }
), { numRuns: 100 });

// Feature: layout-full-props-standard, Property 5: ratio props have min and max
fc.assert(fc.property(
  fc.constantFrom(...layoutRegistry),
  (meta) => meta.props.filter(p => p.type === "ratio")
    .every(p => p.min !== undefined && p.max !== undefined)
), { numRuns: 100 });

// Feature: layout-full-props-standard, Property 6: enum props have non-empty options
// (already covered by existing Property 5 test in the suite)

// Feature: layout-full-props-standard, Property 7: group values are valid
fc.assert(fc.property(
  fc.constantFrom(...layoutRegistry),
  (meta) => meta.props.every(p =>
    !p.group || ["style","layout","behavior","content"].includes(p.group)
  )
), { numRuns: 100 });

// Feature: layout-full-props-standard, Property 8: color/background props use correct type
fc.assert(fc.property(
  fc.constantFrom(...layoutRegistry),
  (meta) => meta.props
    .filter(p => /[Bb]ackground$|[Cc]olor$/.test(p.name) || p.name === "background")
    .every(p => p.type === "color" || p.type === "background")
), { numRuns: 100 });
```

Each property test must be tagged with the format:
`// Feature: layout-full-props-standard, Property N: <property_text>`
