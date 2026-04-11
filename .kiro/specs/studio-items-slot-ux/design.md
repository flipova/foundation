# Design Document — Studio Items Slot UX

## Overview

Four targeted fixes to the Studio visual builder's handling of `items`-mode layouts (BentoLayout, GridLayout, DeckLayout, SwiperLayout, MasonryLayout, ParallaxLayout, etc.). These layouts use a single array slot (`array: true` in the registry), which `deriveSlotConfig` maps to `mode: 'items'`.

The fixes address:
1. InsertZone invisibility when an items-mode layout has no children
2. Missing slot row in the LayersPanel tree for items-mode layouts
3. No dedicated UI to connect a data source directly to an items-mode layout
4. Code generator gaps for empty, DATA, and TEMPLATE modes

All four fixes are surgical — they touch only the identified files and do not change behavior for `children`-mode or `named`-mode layouts.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Studio Canvas (edit mode)                                       │
│                                                                  │
│  NodeRenderer                                                    │
│    └─ ItemsRenderer  ←── Fix 1: IZ rendered outside Component   │
│         └─ Component (BentoLayout, etc.)                         │
│              └─ useStudioItems  ←── Fix 1: IZ passthrough        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LayersPanel                                                     │
│    └─ LayerRow  ←── Fix 2: items slot row for mode==='items'     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LogicPanel                                                      │
│    └─ ItemsDataSourceSection  ←── Fix 3: new component           │
│    └─ RepeatSection (hidden for items-mode nodes)                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Code Generator                                                  │
│    └─ generator.ts renderNode  ←── Fix 4: all 3 modes + empty   │
└─────────────────────────────────────────────────────────────────┘
```

The four fixes are independent — they can be implemented and tested in any order.

---

## Components and Interfaces

### Fix 1 — InsertZone visibility (`ItemsRenderer.tsx` + `useStudioItems.ts`)

**Root cause**: The current EMPTY path in `ItemsRenderer` wraps the InsertZone as an element inside the `items` array and passes it to the layout component. The layout component calls `useStudioItems`, which sees `items.length > 0` (the IZ counts as one item) and returns it. But the layout then renders it inside an absolutely-positioned cell (e.g. BentoLayout's `baseHeight: 200px` cell), making it invisible.

**Fix in `ItemsRenderer`**: When `children.length === 0` and `!previewMode`, render the InsertZone as a sibling overlay **outside** the Component, not as an item inside it.

```tsx
// EMPTY case — render InsertZone outside the component
const IZ = _InsertZone;
if (!previewMode && IZ) {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Component {...rProps} {...{ [itemsProp]: [] }} />
      <View style={overlayStyle} pointerEvents="box-none">
        <IZ parentId={node.id} index={0} label={`Drop ${slotLabel}`} />
      </View>
    </View>
  );
}
// preview mode or no IZ registered — fall through to useStudioItems placeholders
return <Component {...rProps} {...{ [itemsProp]: [] }} />;
```

The overlay style uses `position: 'absolute'`, `inset: 0`, `zIndex: 10`, `alignItems: 'center'`, `justifyContent: 'center'` so the IZ is centered over the empty layout.

**Fix in `useStudioItems`**: Add an InsertZone passthrough guard. When the items array contains exactly one element that is an InsertZone (detected via `$insertZone` marker), return it unchanged. This is a safety net for any layout that calls `useStudioItems` directly.

```ts
// Mark on the InsertZone component (set once at definition time)
InsertZone.$insertZone = true;

// In useStudioItems:
function isInsertZone(el: React.ReactNode): boolean {
  if (!React.isValidElement(el)) return false;
  const t = el.type as any;
  return t?.$insertZone === true || (el.props as any)?.$insertZone === true;
}

export function useStudioItems(items, count, placeholder) {
  const safe = Array.isArray(items) ? items : [];
  if (safe.length === 1 && isInsertZone(safe[0])) return safe; // passthrough
  if (safe.length > 0) return safe;
  return Array.from({ length: Math.max(1, count) }, (_, i) => placeholder(i));
}
```

The `$insertZone` marker is set on the InsertZone component type (not a string comparison), so it survives minification and component renames.

---

### Fix 2 — Items slot row in LayersPanel (`LayersPanel.tsx`)

**Root cause**: `LayerRow` handles `namedSlots` (mode: `named`) with a slot row per slot, but for `mode: 'items'` it falls through to the generic children render at `depth + 1` with no slot label.

**Fix**: After the named slots block, add an items-mode branch:

```tsx
// items-mode slot row
if (slotCfg.mode === 'items') {
  const itemsProp = slotCfg.itemsProp ?? 'items';
  const slotLabel = m?.slots?.find(s => s.array)?.label ?? 'Items';
  const isTargeted = selId === node.id && targetSlot === itemsProp;
  const hasDataBadge = !!node.repeatBinding;

  return (
    <>
      {/* ... existing row JSX ... */}
      {!collapsed && (
        <View>
          <Pressable
            style={[s.slotRow, { paddingLeft: 8 + (depth + 1) * 14 }, isTargeted && s.slotRowTargeted]}
            onPress={() => selectSlot(node.id, itemsProp)}
          >
            <Feather name="inbox" size={10} color={C.muted} />
            <Text style={s.slotLabel}>{slotLabel}</Text>
            {hasDataBadge && <Feather name="database" size={9} color="#a78bfa" />}
            {children.length === 0 && !movingId && (
              <Text style={s.slotEmpty}>{LAYERS_TEXTS.slotEmpty}</Text>
            )}
            {isDropTarget && (
              <Pressable onPress={() => dropInto(node.id, children.length, itemsProp)} hitSlop={6} style={s.slotDropBtn}>
                <Feather name="plus-circle" size={10} color={C.primary} />
                <Text style={s.slotDropText}>Drop</Text>
              </Pressable>
            )}
          </Pressable>
          {children.map((c, i) => (
            <LayerRow key={c.id} node={c} depth={depth + 2} parentId={node.id} index={i} panelHeight={panelHeight} />
          ))}
        </View>
      )}
    </>
  );
}
```

Children are rendered at `depth + 2` (under the slot row), not `depth + 1`. The existing fallthrough `children.filter(c => !usedIds.has(c.id))` render at the bottom of `LayerRow` will not render items-mode children because the items-mode branch returns early.

---

### Fix 3 — Items data source section (`LogicPanel.tsx`)

**New component `ItemsDataSourceSection`**: A self-contained section body (not a full `Section` wrapper) that mirrors `RepeatSection` but with items-mode-specific copy.

```tsx
const ItemsDataSourceSection: React.FC<{
  node: TreeNode;
  onChange: (repeat: TreeNode['repeatBinding']) => void;
}> = ({ node, onChange }) => {
  const repeat = node.repeatBinding;
  return (
    <View style={{ gap: 8 }}>
      <SmartInput
        label="Data source (must be a list)"
        value={repeat?.source || ''}
        onChange={v => onChange(v ? { source: v, keyProp: repeat?.keyProp || 'id' } : undefined)}
        propType="string"
        isExpression
        placeholder="$state.products"
      />
      {repeat && (
        <>
          <SmartInput
            label="Key field"
            value={repeat.keyProp}
            onChange={v => onChange({ ...repeat, keyProp: v })}
            propType="string"
            placeholder="id"
          />
          <Pressable onPress={() => onChange(undefined)} style={s.removeBtn}>
            <Feather name="x" size={10} color={C.muted} />
            <Text style={s.removeBtnText}>Remove data source</Text>
          </Pressable>
        </>
      )}
      {!repeat && (
        <Text style={s.hint}>
          Connect a list variable to render one item per record. Use $state.alias pointing to an array.
        </Text>
      )}
    </View>
  );
};
```

**Detection in `LogicPanel`**: Derive `isItemsMode` from the selected node's registry meta:

```tsx
const isItemsMode = React.useMemo(() => {
  if (!sel) return false;
  const layoutMeta = getLayoutMeta(sel.registryId);
  const slotCfg = deriveSlotConfig(layoutMeta?.slots as any);
  return slotCfg.mode === 'items';
}, [sel?.registryId]);
```

**Conditional rendering**: Replace the "List mode" section with "Items data source" when `isItemsMode`:

```tsx
{isItemsMode ? (
  <Section title="Items data source" icon="database" color="#a78bfa" active={hasRepeat} ...>
    <ItemsDataSourceSection node={sel} onChange={repeat => updateRepeat(sel.id, repeat)} />
  </Section>
) : (
  <Section title="List mode" icon="repeat" ...>
    <RepeatSection ... />
  </Section>
)}
```

---

### Fix 4 — Code generator (`generator.ts`)

**Current state**: `renderNode` already handles STATIC mode (N children → `items={[...]}`) and TEMPLATE mode (child with `repeatBinding` → `items={source.map(...)}`). Missing: DATA mode (repeatBinding on the layout node itself) and empty case (0 children → `items={[]}`).

**Fix in `renderNode`**: The `jsxChildren.length === 0` branch currently emits a self-closing tag. For items-mode nodes, it must emit `items={[]}`:

```ts
if (jsxChildren.length === 0) {
  if (isItemsMode) {
    jsx = `${pad}<${opening} ${itemsPropName}={[]} />`;
  } else {
    jsx = `${pad}<${opening} />`;
  }
}
```

**DATA mode** (repeatBinding on the layout node itself): Currently the `node.repeatBinding` block wraps children in a `.map()` but only handles the case where `isItemsMode` is true with children. The DATA mode where the layout itself has `repeatBinding` and children are the template needs to be handled:

```ts
if (node.repeatBinding && isItemsMode) {
  const { source, keyProp = "id" } = node.repeatBinding;
  const loopVar = node.repeatBinding.itemVar || deriveItemVar(source);
  const keyExpr = `${loopVar}.${keyProp}`;
  const resolvedSource = resolveExpression(source);
  const templateChild = jsxChildren[0];
  if (templateChild) {
    const childJsx = renderNode(templateChild, indent + 2, handlerMap, styleMap, loopVar, stateKeys)
      .replace(new RegExp(`(<${templateChild.registryId}[^>/]*)(/?>)`), `$1 key={${keyExpr}}$2`);
    const mapExpr = `{${resolvedSource}.map((${loopVar}) => (\n${childJsx}\n${pad}))}`;
    jsx = `${pad}<${opening} ${itemsPropName}=${mapExpr} />`;
  } else {
    jsx = `${pad}<${opening} ${itemsPropName}={[]} />`;
  }
}
```

**Summary of all 4 modes after fix**:

| Mode | Condition | Output |
|------|-----------|--------|
| Empty | 0 children, no repeatBinding | `<Layout items={[]} />` |
| Static | N children, no repeatBinding | `<Layout items={[<C1 />, <C2 />]} />` |
| Template | 1 child with repeatBinding | `<Layout items={childSource.map((item) => (<Child key={item.id} />))} />` |
| Data | layout has repeatBinding | `<Layout items={source.map((item) => (<Child key={item.id} />))} />` |

---

## Data Models

No new data models are introduced. All four fixes operate on existing types:

- `TreeNode` — `repeatBinding`, `children`, `registryId` (unchanged)
- `SlotConfig` — `{ mode: 'items', itemsProp }` (unchanged)
- `LayoutMeta` — `slots[].array`, `slots[].label` (unchanged)

The `$insertZone` marker is a static property on the `InsertZone` component type — it is not persisted and does not affect the tree model.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: useStudioItems passthrough for non-empty arrays

*For any* non-empty array of React nodes (including arrays containing an InsertZone element), `useStudioItems` SHALL return the input array unchanged without substituting placeholder items.

**Validates: Requirements 1.2, 1.4**

---

### Property 2: Items-mode children appear at depth+2 under slot row

*For any* items-mode layout node with N children (N ≥ 0), the LayerRow SHALL render a slot row at `depth + 1` and each child at `depth + 2`. No child SHALL appear at `depth + 1` without a slot label row above it.

**Validates: Requirements 2.1, 2.5, 2.7**

---

### Property 3: Items data source section is mutually exclusive with List mode section

*For any* selected node that is an items-mode layout, the LogicPanel SHALL render the "Items data source" section and SHALL NOT render the "List mode" (RepeatSection) section. For any selected node that is NOT items-mode, the LogicPanel SHALL render the "List mode" section and SHALL NOT render the "Items data source" section.

**Validates: Requirements 3.1, 3.2**

---

### Property 4: Generator emits items prop for all items-mode nodes

*For any* items-mode layout node (regardless of child count or repeatBinding), the generated TSX SHALL contain `items={` using the correct `itemsProp` name from the registry, and SHALL NOT contain JSX children inside the layout tag.

**Validates: Requirements 4.1, 4.4**

---

### Property 5: Generator emits map expression for items-mode nodes with repeatBinding

*For any* items-mode layout node that has a `repeatBinding` (DATA mode) or a single child with `repeatBinding` (TEMPLATE mode), the generated TSX SHALL contain `.map(` and SHALL NOT contain a static array literal `[<`.

**Validates: Requirements 4.2, 4.3**

---

### Property 6: Generator non-regression for non-items-mode nodes

*For any* layout node whose `deriveSlotConfig` returns `mode: 'children'` or `mode: 'named'`, the generated TSX SHALL be identical to the output produced before this change (children as JSX children, named slots as JSX props).

**Validates: Requirements 4.6, 4.7**

---

### Property 7: Generator round-trip stability for items-mode nodes

*For any* items-mode layout node, generating TSX, parsing it back to an AST, and re-generating SHALL produce output equivalent to the original generation (no semantic drift across the round trip).

**Validates: Requirement 4.8**

---

## Error Handling

**Fix 1 — InsertZone not registered**: `_InsertZone` may be `null` if `registerInsertZone` has not been called (e.g. in tests or preview mode). The EMPTY branch guards with `if (!previewMode && IZ)` and falls through to `<Component items={[]} />` when IZ is unavailable.

**Fix 2 — Missing registry meta**: `m` (from `meta(node.kind, node.registryId)`) may be `undefined` for unknown components. The slot label falls back to `'Items'` and `itemsProp` falls back to `'items'`.

**Fix 3 — getLayoutMeta returns undefined**: `isItemsMode` defaults to `false` when `getLayoutMeta` returns `undefined`, so the standard "List mode" section is shown — safe fallback.

**Fix 4 — No template child in DATA mode**: If `node.repeatBinding` is set but `jsxChildren` is empty, the generator emits `items={[]}` rather than crashing.

---

## Testing Strategy

### Unit tests

- `useStudioItems`: test passthrough for IZ-marked element, passthrough for non-empty array, placeholder generation for empty array.
- `LayerRow` (snapshot or shallow render): verify slot row appears at correct depth for items-mode node; verify children appear at depth+2.
- `LogicPanel`: verify `ItemsDataSourceSection` renders for items-mode node; verify `RepeatSection` is absent for items-mode node.
- `generator.ts`: specific examples for each of the 4 modes (empty, static, template, data) using a known registry layout (e.g. `BentoLayout`).

### Property-based tests

Use a property-based testing library (e.g. `fast-check` for TypeScript/Jest) with minimum 100 iterations per property.

Each property test is tagged with:
`// Feature: studio-items-slot-ux, Property N: <property_text>`

**Property 1 test** (`useStudioItems.pbt.test.ts`):
Generate arbitrary arrays of React nodes (length ≥ 1). Assert `useStudioItems(arr, 4, placeholder)` returns `arr` unchanged.
`// Feature: studio-items-slot-ux, Property 1: useStudioItems passthrough for non-empty arrays`

**Property 2 test** (`LayerRow.pbt.test.ts`):
Generate items-mode nodes with arbitrary child counts. Render `LayerRow` and assert slot row depth = `baseDepth + 1`, all children depth = `baseDepth + 2`, no child at `baseDepth + 1`.
`// Feature: studio-items-slot-ux, Property 2: items-mode children appear at depth+2 under slot row`

**Property 3 test** (`LogicPanel.pbt.test.ts`):
Generate nodes with arbitrary `registryId` values (items-mode and non-items-mode). Render `LogicPanel` and assert mutual exclusivity of the two sections.
`// Feature: studio-items-slot-ux, Property 3: items data source section is mutually exclusive with list mode section`

**Property 4 test** (`generator.items.pbt.test.ts`):
Generate items-mode nodes with arbitrary child counts (0–10) and no repeatBinding. Assert generated code contains `items={` and does not contain `>` followed by child JSX inside the layout tag.
`// Feature: studio-items-slot-ux, Property 4: generator emits items prop for all items-mode nodes`

**Property 5 test** (`generator.items.pbt.test.ts`):
Generate items-mode nodes with arbitrary repeatBinding (DATA mode) or single child with repeatBinding (TEMPLATE mode). Assert generated code contains `.map(` and does not contain `[<`.
`// Feature: studio-items-slot-ux, Property 5: generator emits map expression for items-mode nodes with repeatBinding`

**Property 6 test** (`generator.items.pbt.test.ts`):
Generate children-mode and named-mode nodes with arbitrary children. Assert generated code is identical to the pre-fix generator output for those nodes.
`// Feature: studio-items-slot-ux, Property 6: generator non-regression for non-items-mode nodes`

**Property 7 test** (`generator.items.pbt.test.ts`):
Generate items-mode nodes with arbitrary structure. Generate TSX, parse to AST, re-generate, assert equivalence.
`// Feature: studio-items-slot-ux, Property 7: generator round-trip stability for items-mode nodes`
