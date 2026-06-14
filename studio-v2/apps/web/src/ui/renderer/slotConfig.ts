/**
 * Slot Configuration — derived from registry
 *
 * Reads the explicit `kind` field on each SlotDescriptor.
 * No heuristic — the registry is the single source of truth.
 *
 * kind mapping:
 *   "children"    → mode "children"  (standard React children)
 *   "items"       → mode "items"     (primary array prop, e.g. items={[...]})
 *   "named"       → mode "named"     (single ReactNode as named prop)
 *   "named-array" → mode "named"     (array of ReactNodes as named prop, exposed in secondaryArraySlots)
 *
 * Legacy fallback (no `kind` field):
 *   - single slot, name "children", no array → "children"
 *   - single slot, array:true → "items"
 *   - multiple slots → "named"
 */

export type SlotMode = 'children' | 'items' | 'named';

export interface SlotConfig {
  mode: SlotMode;
  /** Prop name for the primary items array (mode: 'items' only) */
  itemsProp?: string;
  /** Named slots for mode: 'named' */
  slots?: { prop: string; label: string; fallbackIndex: number }[];
  /**
   * Secondary array slots (kind: "named-array") — only set when mode === 'items'.
   * e.g. FlipLayout's `backContent` slot.
   */
  secondaryArraySlots?: { prop: string; label: string }[];
}

export function deriveSlotConfig(slots?: { name: string; label: string; required: boolean; kind?: string; array?: boolean }[]): SlotConfig {
  if (!slots || slots.length === 0) {
    return { mode: 'children' };
  }

  // ── Explicit kind path (new, preferred) ──────────────────────────────────

  const hasExplicitKind = slots.some(s => s.kind !== undefined);

  if (hasExplicitKind) {
    const primaryItems = slots.find(s => s.kind === 'items');
    const namedArraySlots = slots.filter(s => s.kind === 'named-array');
    const namedSlots = slots.filter(s => s.kind === 'named');
    const childrenSlot = slots.find(s => s.kind === 'children');

    if (primaryItems) {
      return {
        mode: 'items',
        itemsProp: primaryItems.name,
        secondaryArraySlots: namedArraySlots.map(s => ({ prop: s.name, label: s.label })),
      };
    }

    if (childrenSlot && namedSlots.length === 0) {
      return { mode: 'children' };
    }

    // named (with or without a children slot mixed in)
    return {
      mode: 'named',
      slots: slots
        .filter(s => s.kind === 'named' || s.kind === 'named-array')
        .map((s, i) => ({ prop: s.name, label: s.label, fallbackIndex: i })),
    };
  }

  // ── Legacy fallback (array?: boolean heuristic) ───────────────────────────

  if (slots.length === 1 && slots[0].name === 'children' && !slots[0].array) {
    return { mode: 'children' };
  }

  if (slots.length === 1 && slots[0].array) {
    return { mode: 'items', itemsProp: slots[0].name };
  }

  const allArray = slots.every(s => s.array);
  if (allArray && slots.length > 1) {
    const [primary, ...secondary] = slots;
    return {
      mode: 'items',
      itemsProp: primary.name,
      secondaryArraySlots: secondary.map(s => ({ prop: s.name, label: s.label })),
    };
  }

  const namedSlots = slots.filter(s => s.name !== 'children');
  if (namedSlots.length > 0) {
    return {
      mode: 'named',
      slots: slots.map((s, i) => ({ prop: s.name, label: s.label, fallbackIndex: i })),
    };
  }

  return { mode: 'children' };
}
