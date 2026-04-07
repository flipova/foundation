# Tasks — Studio Items Slot UX

## Task List

- [x] 1. Fix InsertZone visibility for empty items-mode layouts
  - [x] 1.1 Add `$insertZone` static marker to the InsertZone component definition
  - [x] 1.2 Update `useStudioItems` to detect and pass through an InsertZone element unchanged
  - [x] 1.3 Update `ItemsRenderer` EMPTY branch to render InsertZone as an overlay outside the Component
  - [x] 1.4 Write unit tests for `useStudioItems` passthrough behavior
  - [x] 1.5 Write PBT for Property 1 (useStudioItems passthrough for non-empty arrays)

- [x] 2. Add items slot row in LayersPanel
  - [x] 2.1 Add items-mode branch in `LayerRow` that renders a slot row at `depth + 1`
  - [x] 2.2 Render items-mode children at `depth + 2` under the slot row (not at `depth + 1`)
  - [x] 2.3 Wire slot row press to `selectSlot(node.id, itemsProp)`
  - [x] 2.4 Wire Drop button to `dropInto(node.id, children.length, itemsProp)` when `isDropTarget`
  - [x] 2.5 Show "vide" label when slot has zero children and no move in progress
  - [x] 2.6 Show database icon badge when `node.repeatBinding` is set
  - [x] 2.7 Write unit tests for slot row rendering and depth correctness
  - [x] 2.8 Write PBT for Property 2 (items-mode children appear at depth+2 under slot row)

- [x] 3. Add Items data source section in LogicPanel
  - [x] 3.1 Create `ItemsDataSourceSection` component in `studio/app/src/ui/logic/`
  - [x] 3.2 Add `isItemsMode` detection in `LogicPanel` using `getLayoutMeta` + `deriveSlotConfig`
  - [x] 3.3 Replace "List mode" section with "Items data source" section when `isItemsMode` is true
  - [x] 3.4 Wire source input to `updateRepeat(node.id, { source, keyProp })`
  - [x] 3.5 Wire Remove button to `updateRepeat(node.id, undefined)`
  - [x] 3.6 Write unit tests for section visibility and updateRepeat calls
  - [x] 3.7 Write PBT for Property 3 (items data source section mutually exclusive with list mode)

- [x] 4. Fix code generator for all items-mode cases
  - [x] 4.1 Fix empty case: emit `items={[]}` when items-mode node has 0 children and no repeatBinding
  - [x] 4.2 Fix DATA mode: emit `items={source.map((item) => (<Child key={item.id} />))}` when layout has `repeatBinding`
  - [x] 4.3 Verify TEMPLATE mode already works correctly (single child with repeatBinding)
  - [x] 4.4 Write unit tests for all 4 modes (empty, static, template, data) using a known registry layout
  - [x] 4.5 Write PBT for Property 4 (generator emits items prop for all items-mode nodes)
  - [x] 4.6 Write PBT for Property 5 (generator emits map expression for repeatBinding nodes)
  - [x] 4.7 Write PBT for Property 6 (generator non-regression for non-items-mode nodes)
  - [x] 4.8 Write PBT for Property 7 (generator round-trip stability for items-mode nodes)
