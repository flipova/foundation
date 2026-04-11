# Requirements Document

## Introduction

The Studio visual builder supports multi-item layouts (BentoLayout, GridLayout, DeckLayout, SwiperLayout, MasonryLayout, ParallaxLayout, etc.) that use an `items`-mode slot — a single array slot derived by `deriveSlotConfig` when `array: true` is set in the registry. Currently, four UX gaps exist:

1. The drop zone (InsertZone) is invisible when an items-mode layout has no children, because `useStudioItems` replaces the empty array with generated placeholders before the InsertZone can render.
2. The LayersPanel tree shows no slot row for items-mode layouts, so users cannot identify, target, or drop into the items slot.
3. There is no UI to connect an items-mode layout directly to a data source (DATA mode); users must set `repeatBinding` on a child node instead.
4. The code generator must correctly emit `items={[...]}` for static children and `items={source.map(...)}` for data/template repeat on items-mode layouts.

## Glossary

- **ItemsRenderer**: The React component in `studio/app/src/renderer/ItemsRenderer.tsx` that renders multi-item layouts in the Studio canvas. Supports DATA, TEMPLATE, and STATIC modes.
- **InsertZone**: The drop-target UI element rendered inside the canvas when a slot is empty, allowing users to drag components into it.
- **useStudioItems**: The hook in `foundation/layout/hooks/useStudioItems.ts` that returns placeholder items when the `items` array is empty.
- **LayerRow**: The recursive component inside `LayersPanel.tsx` that renders a single node row in the layers tree.
- **LayersPanel**: The Studio panel (`studio/app/src/ui/LayersPanel.tsx`) showing the component tree and screen list.
- **LogicPanel**: The Studio panel (`studio/app/src/ui/logic/LogicPanel.tsx`) for configuring events, bindings, visibility, repeat, and state on a selected node.
- **RepeatSection**: The sub-component of LogicPanel (`studio/app/src/ui/logic/RepeatSection.tsx`) that configures `repeatBinding` on a node.
- **deriveSlotConfig**: The function in `studio/app/src/renderer/slotConfig.ts` that maps registry slot definitions to a `SlotConfig` (`mode: 'children' | 'items' | 'named'`).
- **SlotConfig**: The object returned by `deriveSlotConfig` — `{ mode, itemsProp?, slots? }`.
- **items-mode layout**: Any layout whose registry entry has exactly one slot with `array: true`, causing `deriveSlotConfig` to return `mode: 'items'`.
- **DATA mode**: ItemsRenderer mode where the layout node itself has `repeatBinding.source` set; items are resolved from a data source.
- **TEMPLATE mode**: ItemsRenderer mode where a single child node has `repeatBinding`; the child is repeated N times.
- **STATIC mode**: ItemsRenderer mode where N children are dropped manually; they are passed as-is.
- **repeatBinding**: The `{ source, keyProp, itemVar? }` object on a `TreeNode` that configures data-driven repetition.
- **generator.ts**: The code generator at `studio/engine/codegen/generator.ts` that emits React/TSX source from the Studio tree.
- **LayoutMeta**: The registry entry type for layouts, containing `id`, `slots`, `previewItemCount`, and `props`.

---

## Requirements

### Requirement 1: InsertZone visibility for empty items-mode layouts

**User Story:** As a Studio user, I want to see a drop zone when I add an items-mode layout with no children, so that I know where to drop components into it.

#### Acceptance Criteria

1. WHEN an items-mode layout node has zero children and is rendered in edit mode, THE InsertZone SHALL be rendered visibly inside the layout on the canvas.
2. WHEN the `items` prop passed to a layout component contains exactly one element that is an InsertZone element, THE `useStudioItems` hook SHALL return that array unchanged without replacing it with placeholder items.
3. THE `useStudioItems` hook SHALL detect an InsertZone element by checking for a non-null `$$insertZone` marker property on the element's type or props, so that detection does not depend on component display name strings.
4. WHEN an items-mode layout node has one or more real children (non-InsertZone), THE `useStudioItems` hook SHALL continue to return those children unchanged.
5. WHEN an items-mode layout node has zero children and is rendered in preview mode, THE ItemsRenderer SHALL NOT render an InsertZone and SHALL instead render placeholder items via `useStudioItems`.

---

### Requirement 2: Items slot row in LayersPanel

**User Story:** As a Studio user, I want to see a labeled "items" slot row in the layers tree for items-mode layouts, so that I can identify the slot, click to target it, and drop components into it.

#### Acceptance Criteria

1. WHEN a node's `SlotConfig` has `mode === 'items'`, THE LayerRow SHALL render a slot row labeled with the slot's label from the registry (e.g. "Items", "Cards", "Slides") at depth + 1, styled identically to named-slot rows.
2. WHEN the items slot row is pressed, THE LayersPanel SHALL call `selectSlot(node.id, itemsProp)` so that subsequent drops target the items slot.
3. WHEN the items slot row is the active drop target (i.e. `movingId` is set and `movingId !== node.id`), THE items slot row SHALL display a "Drop" button that calls `dropInto(node.id, children.length, itemsProp)`.
4. WHEN the items slot has zero children and no move is in progress, THE items slot row SHALL display the "vide" (empty) label, consistent with named-slot empty state.
5. WHEN the items slot has one or more children, THE LayerRow SHALL render each child as a nested LayerRow at depth + 2, below the items slot row.
6. WHEN the items slot row is rendered and the layout node has a `repeatBinding` set (DATA mode), THE items slot row SHALL display a database icon badge indicating the slot is data-driven.
7. THE LayerRow SHALL NOT render items-mode children as direct children of the layout row (i.e. children must appear under the items slot row, not at depth + 1 without a slot label).

---

### Requirement 3: Connect data source to items slot from the UI

**User Story:** As a Studio user, I want to connect an items-mode layout directly to a data source from the layers panel or logic panel, so that the layout renders one item per data record without manually configuring a child template.

#### Acceptance Criteria

1. WHEN the selected node is an items-mode layout, THE LogicPanel SHALL display a dedicated "Items data source" section that is distinct from the generic "List mode" section shown for non-items-mode nodes.
2. WHEN the "Items data source" section is displayed, THE LogicPanel SHALL hide the generic "List mode" (RepeatSection) section for that node, to avoid duplicate data-source configuration UI.
3. WHEN the user enters a `$state.alias` expression in the "Items data source" section, THE LogicPanel SHALL call `updateRepeat(node.id, { source, keyProp })` to persist the `repeatBinding` on the layout node.
4. WHEN the layout node has a `repeatBinding.source` set, THE "Items data source" section SHALL display the current source value and a "Remove" button.
5. WHEN the "Remove" button is pressed, THE LogicPanel SHALL call `updateRepeat(node.id, undefined)` to clear the `repeatBinding`.
6. WHEN the layout node has a `repeatBinding.source` set, THE items slot row in LayersPanel SHALL display a "Connect data" affordance (e.g. a database icon button) that opens the "Items data source" section in LogicPanel.
7. WHEN the "Items data source" section is active and a valid `$state.alias` is configured, THE ItemsRenderer SHALL enter DATA mode and render one template child per data record.
8. WHEN the "Items data source" section is active and the data source resolves to an empty array or is unavailable, THE ItemsRenderer SHALL render placeholder items so the layout remains visible in the canvas.

---

### Requirement 4: Code generator correctness for items-mode layouts

**User Story:** As a Studio user, I want the generated code for items-mode layouts to correctly use the `items` prop in all three modes, so that the exported code compiles and runs without modification.

#### Acceptance Criteria

1. WHEN an items-mode layout node has N static children (STATIC mode), THE generator SHALL emit `<LayoutName items={[<Child1 />, <Child2 />, ...]} />` using the correct `itemsProp` name from the registry.
2. WHEN an items-mode layout node has a `repeatBinding` set (DATA mode), THE generator SHALL emit `<LayoutName items={source.map((item) => (<TemplateChild key={item.id} />))} />` where `source` is the resolved expression and `item` is the derived loop variable.
3. WHEN an items-mode layout node has a single child with `repeatBinding` (TEMPLATE mode), THE generator SHALL emit `<LayoutName items={source.map((item) => (<TemplateChild key={item.id} />))} />` using the child's `repeatBinding` as the map source.
4. WHEN an items-mode layout node has zero children, THE generator SHALL emit `<LayoutName items={[]} />` rather than a self-closing tag with no items prop.
5. THE generator SHALL use `deriveSlotConfig(getLayoutMeta(node.registryId)?.slots)` to determine whether a node is items-mode, consistent with the runtime renderer.
6. WHEN a named-slot layout node (mode `named`) is generated, THE generator SHALL continue to emit named slot children as JSX props (e.g. `header={<Header />}`), unchanged from current behavior.
7. WHEN a standard children-mode layout node is generated, THE generator SHALL continue to emit children as JSX children inside the opening and closing tags, unchanged from current behavior.
8. FOR ALL items-mode layout nodes, parsing the generated TSX then re-generating from the parsed AST SHALL produce output equivalent to the original generation (round-trip stability).
