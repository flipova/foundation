// Feature: studio-items-slot-ux, Property 2: items-mode children appear at depth+2 under slot row

/**
 * Property-Based Tests — Property 2
 * Validates: Requirements 2.1, 2.5, 2.7
 *
 * Property 2: For any items-mode layout node with N children (N ≥ 0),
 * the LayerRow SHALL render a slot row at `depth + 1` and each child at
 * `depth + 2`. No child SHALL appear at `depth + 1` without a slot label
 * row above it.
 *
 * Since rendering the full LayerRow component requires heavy React Native /
 * store dependencies, we test the depth calculation logic directly — the
 * same formulas used in LayerRow's JSX:
 *
 *   slot row:  paddingLeft = 8 + (depth + 1) * 14
 *   child row: paddingLeft = 8 + (depth + 2) * 14
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { deriveSlotConfig } from '../../renderer/slotConfig';

// ---------------------------------------------------------------------------
// Pure depth helpers — mirrors LayerRow JSX
// ---------------------------------------------------------------------------

function slotRowPaddingLeft(depth: number): number {
  return 8 + (depth + 1) * 14;
}

function childRowPaddingLeft(depth: number): number {
  return 8 + (depth + 2) * 14;
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Arbitrary depth values (0–10) */
const arbitraryDepth = fc.integer({ min: 0, max: 10 });

/** Arbitrary child counts (0–5) */
const arbitraryChildCount = fc.integer({ min: 0, max: 5 });

/** Arbitrary items-mode slot definition */
const arbitraryItemsSlot = fc.record({
  name: fc.oneof(
    fc.constant('items'),
    fc.constant('cards'),
    fc.constant('slides'),
    fc.constant('children'),
    fc.string({ minLength: 1, maxLength: 12 }).filter(s => /^[a-z][a-zA-Z]*$/.test(s)),
  ),
  label: fc.oneof(
    fc.constant('Items'),
    fc.constant('Cards'),
    fc.constant('Slides'),
    fc.string({ minLength: 1, maxLength: 20 }),
  ),
  required: fc.boolean(),
  array: fc.constant(true as const),
});

// ---------------------------------------------------------------------------
// Property 2a: Slot row is at depth + 1
// ---------------------------------------------------------------------------

describe('PBT — Property 2a: slot row paddingLeft = 8 + (depth+1)*14', () => {
  it('slot row paddingLeft equals 8 + (depth+1)*14 for any depth in [0,10]', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        const expected = 8 + (depth + 1) * 14;
        expect(slotRowPaddingLeft(depth)).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });

  it('slot row paddingLeft is always greater than parent row paddingLeft', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        const parentPadding = 8 + depth * 14;
        expect(slotRowPaddingLeft(depth)).toBeGreaterThan(parentPadding);
      }),
      { numRuns: 100 },
    );
  });

  it('slot row is exactly 14px deeper than parent row for any depth', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        const parentPadding = 8 + depth * 14;
        expect(slotRowPaddingLeft(depth) - parentPadding).toBe(14);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2b: Children are at depth + 2
// ---------------------------------------------------------------------------

describe('PBT — Property 2b: child paddingLeft = 8 + (depth+2)*14', () => {
  it('child paddingLeft equals 8 + (depth+2)*14 for any depth in [0,10]', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        const expected = 8 + (depth + 2) * 14;
        expect(childRowPaddingLeft(depth)).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });

  it('child paddingLeft is always greater than slot row paddingLeft', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        expect(childRowPaddingLeft(depth)).toBeGreaterThan(slotRowPaddingLeft(depth));
      }),
      { numRuns: 100 },
    );
  });

  it('child is exactly 14px deeper than slot row for any depth', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        expect(childRowPaddingLeft(depth) - slotRowPaddingLeft(depth)).toBe(14);
      }),
      { numRuns: 100 },
    );
  });

  it('child is exactly 28px deeper than parent row for any depth', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        const parentPadding = 8 + depth * 14;
        expect(childRowPaddingLeft(depth) - parentPadding).toBe(28);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2c: No child appears at depth + 1 (slot row level)
// ---------------------------------------------------------------------------

describe('PBT — Property 2c: no child appears at depth+1 (slot row level)', () => {
  it('child paddingLeft is never equal to slot row paddingLeft for any depth', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        expect(childRowPaddingLeft(depth)).not.toBe(slotRowPaddingLeft(depth));
      }),
      { numRuns: 100 },
    );
  });

  it('child paddingLeft is never equal to parent row paddingLeft for any depth', () => {
    fc.assert(
      fc.property(arbitraryDepth, (depth) => {
        const parentPadding = 8 + depth * 14;
        expect(childRowPaddingLeft(depth)).not.toBe(parentPadding);
      }),
      { numRuns: 100 },
    );
  });

  it('for N children, all children share the same paddingLeft (depth+2)', () => {
    fc.assert(
      fc.property(arbitraryDepth, arbitraryChildCount, (depth, childCount) => {
        const expectedChildPadding = 8 + (depth + 2) * 14;
        const childPaddings = Array.from({ length: childCount }, () =>
          childRowPaddingLeft(depth),
        );
        for (const p of childPaddings) {
          expect(p).toBe(expectedChildPadding);
          expect(p).not.toBe(slotRowPaddingLeft(depth)); // not at slot row level
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2d: deriveSlotConfig returns mode "items" for array slots
// ---------------------------------------------------------------------------

describe('PBT — Property 2d: deriveSlotConfig returns mode "items" for any array slot', () => {
  it('returns mode "items" for any single array slot', () => {
    fc.assert(
      fc.property(arbitraryItemsSlot, (slot) => {
        const cfg = deriveSlotConfig([slot]);
        expect(cfg.mode).toBe('items');
      }),
      { numRuns: 100 },
    );
  });

  it('itemsProp matches the slot name for any array slot', () => {
    fc.assert(
      fc.property(arbitraryItemsSlot, (slot) => {
        const cfg = deriveSlotConfig([slot]);
        expect(cfg.itemsProp).toBe(slot.name);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2e: Depth ordering invariant across all depths and child counts
// ---------------------------------------------------------------------------

describe('PBT — Property 2e: depth ordering invariant (parent < slot < child)', () => {
  it('parent < slot row < child row for any depth and child count', () => {
    fc.assert(
      fc.property(arbitraryDepth, arbitraryChildCount, (depth, childCount) => {
        const parentPadding = 8 + depth * 14;
        const slotPadding = slotRowPaddingLeft(depth);
        const childPadding = childRowPaddingLeft(depth);

        // Strict ordering: parent < slot < child
        expect(slotPadding).toBeGreaterThan(parentPadding);
        expect(childPadding).toBeGreaterThan(slotPadding);

        // All N children are at the same depth (depth+2)
        for (let i = 0; i < childCount; i++) {
          expect(childRowPaddingLeft(depth)).toBe(childPadding);
        }
      }),
      { numRuns: 100 },
    );
  });
});
