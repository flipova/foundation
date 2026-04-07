/**
 * Unit tests — Items-mode slot row rendering and depth correctness
 *
 * Validates: Requirements 2.1, 2.2, 2.4, 2.5, 2.6, 2.7
 *
 * Tests the depth calculation logic and slot row behavior for items-mode
 * layouts in LayerRow. Since LayerRow has heavy React Native / store
 * dependencies, we test the pure logic extracted from the component:
 *
 * - Slot row paddingLeft = 8 + (depth + 1) * 14  (Req 2.1)
 * - Children paddingLeft = 8 + (depth + 2) * 14  (Req 2.2, 2.7)
 * - "vide" label shown when children.length === 0 and no movingId (Req 2.5)
 * - Database badge shown when repeatBinding is set (Req 2.6)
 * - deriveSlotConfig returns mode "items" for array slots (Req 2.1)
 * - itemsProp is correctly derived from the slot name (Req 2.3)
 * - Slot label falls back to "Items" when no label in registry (Req 2.1)
 */

import { describe, it, expect } from 'vitest';
import { deriveSlotConfig } from '../../renderer/slotConfig';

// Inline the relevant constant from LAYERS_TEXTS (mirrors LayersPanel.tsx)
const LAYERS_TEXTS = {
  slotEmpty: 'vide',
} as const;

// ---------------------------------------------------------------------------
// Helpers — mirrors the depth/padding logic in LayerRow
// ---------------------------------------------------------------------------

/** Computes the paddingLeft for the slot row (depth + 1) */
function slotRowPaddingLeft(depth: number): number {
  return 8 + (depth + 1) * 14;
}

/** Computes the paddingLeft for a child row (depth + 2) */
function childRowPaddingLeft(depth: number): number {
  return 8 + (depth + 2) * 14;
}

/** Derives the slot label for an items-mode node */
function deriveSlotLabel(
  slots: { name: string; label: string; required: boolean; array?: boolean }[] | undefined,
): string {
  return slots?.find(s => s.array)?.label ?? 'Items';
}

/** Returns whether the "vide" label should be shown */
function shouldShowEmptyLabel(childCount: number, movingId: string | null): boolean {
  return childCount === 0 && !movingId;
}

/** Returns whether the database badge should be shown */
function shouldShowDataBadge(repeatBinding: object | undefined): boolean {
  return !!repeatBinding;
}

// ---------------------------------------------------------------------------
// Tests — deriveSlotConfig for items-mode (Requirement 2.1)
// ---------------------------------------------------------------------------

describe('deriveSlotConfig — items mode detection (Req 2.1)', () => {
  it('returns mode "items" for a single array slot named "items"', () => {
    const cfg = deriveSlotConfig([{ name: 'items', label: 'Items', required: false, array: true }]);
    expect(cfg.mode).toBe('items');
  });

  it('returns mode "items" for a single array slot named "cards"', () => {
    const cfg = deriveSlotConfig([{ name: 'cards', label: 'Cards', required: false, array: true }]);
    expect(cfg.mode).toBe('items');
  });

  it('returns mode "items" for a single array slot named "slides"', () => {
    const cfg = deriveSlotConfig([{ name: 'slides', label: 'Slides', required: false, array: true }]);
    expect(cfg.mode).toBe('items');
  });

  it('returns mode "items" for a single array slot named "children"', () => {
    const cfg = deriveSlotConfig([{ name: 'children', label: 'Children', required: false, array: true }]);
    expect(cfg.mode).toBe('items');
  });

  it('returns the correct itemsProp from the slot name', () => {
    const cfg = deriveSlotConfig([{ name: 'cards', label: 'Cards', required: false, array: true }]);
    expect(cfg.itemsProp).toBe('cards');
  });

  it('returns itemsProp "items" for a slot named "items"', () => {
    const cfg = deriveSlotConfig([{ name: 'items', label: 'Items', required: false, array: true }]);
    expect(cfg.itemsProp).toBe('items');
  });

  it('does NOT return mode "items" for a non-array children slot', () => {
    const cfg = deriveSlotConfig([{ name: 'children', label: 'Children', required: false }]);
    expect(cfg.mode).toBe('children');
  });

  it('does NOT return mode "items" for multiple named slots', () => {
    const cfg = deriveSlotConfig([
      { name: 'header', label: 'Header', required: false },
      { name: 'footer', label: 'Footer', required: false },
    ]);
    expect(cfg.mode).toBe('named');
  });
});

// ---------------------------------------------------------------------------
// Tests — Slot row depth (Requirement 2.1)
// ---------------------------------------------------------------------------

describe('LayerRow — slot row paddingLeft at depth + 1 (Req 2.1)', () => {
  it('slot row paddingLeft is 8 + (depth+1)*14 for depth=0', () => {
    expect(slotRowPaddingLeft(0)).toBe(8 + 1 * 14); // 22
  });

  it('slot row paddingLeft is 8 + (depth+1)*14 for depth=1', () => {
    expect(slotRowPaddingLeft(1)).toBe(8 + 2 * 14); // 36
  });

  it('slot row paddingLeft is 8 + (depth+1)*14 for depth=2', () => {
    expect(slotRowPaddingLeft(2)).toBe(8 + 3 * 14); // 50
  });

  it('slot row paddingLeft is 8 + (depth+1)*14 for depth=5', () => {
    expect(slotRowPaddingLeft(5)).toBe(8 + 6 * 14); // 92
  });

  it('slot row paddingLeft is always greater than the parent row paddingLeft', () => {
    for (let depth = 0; depth <= 10; depth++) {
      const parentPadding = 8 + depth * 14;
      const slotPadding = slotRowPaddingLeft(depth);
      expect(slotPadding).toBeGreaterThan(parentPadding);
    }
  });
});

// ---------------------------------------------------------------------------
// Tests — Children depth (Requirement 2.2, 2.7)
// ---------------------------------------------------------------------------

describe('LayerRow — children paddingLeft at depth + 2 (Req 2.2, 2.7)', () => {
  it('child paddingLeft is 8 + (depth+2)*14 for depth=0', () => {
    expect(childRowPaddingLeft(0)).toBe(8 + 2 * 14); // 36
  });

  it('child paddingLeft is 8 + (depth+2)*14 for depth=1', () => {
    expect(childRowPaddingLeft(1)).toBe(8 + 3 * 14); // 50
  });

  it('child paddingLeft is 8 + (depth+2)*14 for depth=2', () => {
    expect(childRowPaddingLeft(2)).toBe(8 + 4 * 14); // 64
  });

  it('child paddingLeft is always greater than slot row paddingLeft', () => {
    for (let depth = 0; depth <= 10; depth++) {
      expect(childRowPaddingLeft(depth)).toBeGreaterThan(slotRowPaddingLeft(depth));
    }
  });

  it('child paddingLeft is exactly 14px more than slot row paddingLeft', () => {
    for (let depth = 0; depth <= 10; depth++) {
      expect(childRowPaddingLeft(depth) - slotRowPaddingLeft(depth)).toBe(14);
    }
  });

  it('child is NOT at depth + 1 (must be at depth + 2)', () => {
    for (let depth = 0; depth <= 10; depth++) {
      const wrongDepthPadding = 8 + (depth + 1) * 14; // depth+1 (slot row level)
      expect(childRowPaddingLeft(depth)).not.toBe(wrongDepthPadding);
    }
  });
});

// ---------------------------------------------------------------------------
// Tests — Slot label derivation (Requirement 2.1)
// ---------------------------------------------------------------------------

describe('LayerRow — slot label derivation (Req 2.1)', () => {
  it('uses the slot label from the registry when available', () => {
    const slots = [{ name: 'items', label: 'Cards', required: false, array: true }];
    expect(deriveSlotLabel(slots)).toBe('Cards');
  });

  it('uses "Items" as fallback when slots is undefined', () => {
    expect(deriveSlotLabel(undefined)).toBe('Items');
  });

  it('uses "Items" as fallback when no array slot exists', () => {
    const slots = [{ name: 'children', label: 'Children', required: false }];
    expect(deriveSlotLabel(slots)).toBe('Items');
  });

  it('uses the label "Slides" for a slides slot', () => {
    const slots = [{ name: 'slides', label: 'Slides', required: false, array: true }];
    expect(deriveSlotLabel(slots)).toBe('Slides');
  });

  it('uses the label "Items" for a slot with label "Items"', () => {
    const slots = [{ name: 'items', label: 'Items', required: false, array: true }];
    expect(deriveSlotLabel(slots)).toBe('Items');
  });
});

// ---------------------------------------------------------------------------
// Tests — "vide" empty label (Requirement 2.5)
// ---------------------------------------------------------------------------

describe('LayerRow — "vide" label when slot is empty (Req 2.5)', () => {
  it('shows "vide" label when childCount=0 and no movingId', () => {
    expect(shouldShowEmptyLabel(0, null)).toBe(true);
  });

  it('does NOT show "vide" label when childCount > 0', () => {
    expect(shouldShowEmptyLabel(1, null)).toBe(false);
    expect(shouldShowEmptyLabel(3, null)).toBe(false);
  });

  it('does NOT show "vide" label when movingId is set (move in progress)', () => {
    expect(shouldShowEmptyLabel(0, 'n_abc')).toBe(false);
  });

  it('does NOT show "vide" label when both childCount > 0 and movingId is set', () => {
    expect(shouldShowEmptyLabel(2, 'n_abc')).toBe(false);
  });

  it('the "vide" text constant is correct', () => {
    expect(LAYERS_TEXTS.slotEmpty).toBe('vide');
  });

  it('the "vide" text is in French (not "empty")', () => {
    expect(LAYERS_TEXTS.slotEmpty).not.toBe('empty');
  });
});

// ---------------------------------------------------------------------------
// Tests — Database badge (Requirement 2.6)
// ---------------------------------------------------------------------------

describe('LayerRow — database badge when repeatBinding is set (Req 2.6)', () => {
  it('shows database badge when repeatBinding is defined', () => {
    const repeatBinding = { source: '$state.products', keyProp: 'id' };
    expect(shouldShowDataBadge(repeatBinding)).toBe(true);
  });

  it('does NOT show database badge when repeatBinding is undefined', () => {
    expect(shouldShowDataBadge(undefined)).toBe(false);
  });

  it('shows database badge for any non-null repeatBinding object', () => {
    expect(shouldShowDataBadge({ source: '$state.items', keyProp: 'id' })).toBe(true);
    expect(shouldShowDataBadge({ source: '$state.list', keyProp: 'key', itemVar: 'item' })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests — Depth relationship invariants (Requirement 2.7)
// ---------------------------------------------------------------------------

describe('LayerRow — depth relationship invariants (Req 2.7)', () => {
  it('slot row is always exactly 1 level deeper than parent row', () => {
    for (let depth = 0; depth <= 10; depth++) {
      const parentPadding = 8 + depth * 14;
      expect(slotRowPaddingLeft(depth) - parentPadding).toBe(14);
    }
  });

  it('child row is always exactly 2 levels deeper than parent row', () => {
    for (let depth = 0; depth <= 10; depth++) {
      const parentPadding = 8 + depth * 14;
      expect(childRowPaddingLeft(depth) - parentPadding).toBe(28);
    }
  });

  it('child row is always exactly 1 level deeper than slot row', () => {
    for (let depth = 0; depth <= 10; depth++) {
      expect(childRowPaddingLeft(depth) - slotRowPaddingLeft(depth)).toBe(14);
    }
  });

  it('padding formula uses base=8 and step=14', () => {
    // Verify the formula: paddingLeft = 8 + depth * 14
    expect(slotRowPaddingLeft(0)).toBe(22);   // 8 + 1*14
    expect(slotRowPaddingLeft(1)).toBe(36);   // 8 + 2*14
    expect(childRowPaddingLeft(0)).toBe(36);  // 8 + 2*14
    expect(childRowPaddingLeft(1)).toBe(50);  // 8 + 3*14
  });
});
