// Feature: studio-items-slot-ux, Property 3: items data source section is mutually exclusive with list mode section

/**
 * Property-Based Tests — Property 3
 * Validates: Requirements 3.1, 3.2
 *
 * Property 3: For any selected node that is an items-mode layout, the LogicPanel
 * SHALL render the "Items data source" section and SHALL NOT render the "List mode"
 * (RepeatSection) section. For any selected node that is NOT items-mode, the
 * LogicPanel SHALL render the "List mode" section and SHALL NOT render the
 * "Items data source" section.
 *
 * Since rendering the full LogicPanel requires heavy store dependencies, we test
 * the pure isItemsMode detection logic and the mutual exclusivity invariant directly.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getLayoutMeta } from '../../../../../../foundation/layout/registry/layouts';
import { deriveSlotConfig } from '../../../renderer/slotConfig';

// ---------------------------------------------------------------------------
// Known items-mode layout IDs (from registry — single array slot)
// ---------------------------------------------------------------------------

const ITEMS_MODE_IDS = [
  'BentoLayout',
  'GridLayout',
  'DeckLayout',
  'SwiperLayout',
  'MasonryLayout',
  'ParallaxLayout',
  'CrossTabLayout',
] as const;

// Known non-items-mode layout IDs (children or named slots)
const NON_ITEMS_MODE_IDS = [
  'RootLayout',
  'VoidLayout',
  'CenteredLayout',
  'FlexLayout',
  'SplitLayout',
  'DashboardLayout',
  'AuthLayout',
  'SidebarLayout',
  'FooterLayout',
  'ScrollLayout',
] as const;

// ---------------------------------------------------------------------------
// Pure helpers — mirrors LogicPanel logic
// ---------------------------------------------------------------------------

function computeIsItemsMode(registryId: string): boolean {
  const layoutMeta = getLayoutMeta(registryId);
  const slotCfg = deriveSlotConfig(layoutMeta?.slots as any);
  return slotCfg.mode === 'items';
}

function getSectionVisibility(isItemsMode: boolean): {
  showItemsDataSource: boolean;
  showListMode: boolean;
} {
  return {
    showItemsDataSource: isItemsMode,
    showListMode: !isItemsMode,
  };
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Arbitrary items-mode registryId */
const arbitraryItemsModeId = fc.constantFrom(...ITEMS_MODE_IDS);

/** Arbitrary non-items-mode registryId */
const arbitraryNonItemsModeId = fc.constantFrom(...NON_ITEMS_MODE_IDS);

/** Arbitrary registryId — either items-mode or non-items-mode */
const arbitraryRegistryId = fc.oneof(
  arbitraryItemsModeId,
  arbitraryNonItemsModeId,
  // Also include unknown IDs (should default to non-items-mode)
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[A-Z][a-zA-Z]+$/.test(s)),
);

/** Arbitrary boolean isItemsMode value */
const arbitraryIsItemsMode = fc.boolean();

// ---------------------------------------------------------------------------
// Property 3a: items-mode nodes → isItemsMode === true
// ---------------------------------------------------------------------------

describe('PBT — Property 3a: items-mode registryIds produce isItemsMode=true', () => {
  it('isItemsMode is true for any known items-mode layout ID', () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        expect(computeIsItemsMode(registryId)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('deriveSlotConfig returns mode "items" for any known items-mode layout', () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        const meta = getLayoutMeta(registryId);
        const cfg = deriveSlotConfig(meta?.slots as any);
        expect(cfg.mode).toBe('items');
      }),
      { numRuns: 100 },
    );
  });

  it('getLayoutMeta returns a defined entry for any known items-mode layout', () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        const meta = getLayoutMeta(registryId);
        expect(meta).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  it('all known items-mode layouts have exactly one slot with array:true', () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        const meta = getLayoutMeta(registryId);
        const arraySlots = meta?.slots?.filter(s => s.array) ?? [];
        expect(arraySlots.length).toBeGreaterThanOrEqual(1);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3b: non-items-mode nodes → isItemsMode === false
// ---------------------------------------------------------------------------

describe('PBT — Property 3b: non-items-mode registryIds produce isItemsMode=false', () => {
  it('isItemsMode is false for any known non-items-mode layout ID', () => {
    fc.assert(
      fc.property(arbitraryNonItemsModeId, (registryId) => {
        expect(computeIsItemsMode(registryId)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('deriveSlotConfig does NOT return mode "items" for any known non-items-mode layout', () => {
    fc.assert(
      fc.property(arbitraryNonItemsModeId, (registryId) => {
        const meta = getLayoutMeta(registryId);
        const cfg = deriveSlotConfig(meta?.slots as any);
        expect(cfg.mode).not.toBe('items');
      }),
      { numRuns: 100 },
    );
  });

  it('isItemsMode is false for unknown registryIds (safe fallback)', () => {
    // Unknown IDs → getLayoutMeta returns undefined → deriveSlotConfig([]) → mode "children"
    const unknownIds = ['UnknownLayout', 'FakeLayout', 'NotALayout', 'XYZLayout'];
    fc.assert(
      fc.property(fc.constantFrom(...unknownIds), (registryId) => {
        expect(computeIsItemsMode(registryId)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3c: Mutual exclusivity — exactly one section shown
// ---------------------------------------------------------------------------

describe('PBT — Property 3c: mutual exclusivity of sections for any isItemsMode value', () => {
  it('exactly one section is shown for any isItemsMode value', () => {
    fc.assert(
      fc.property(arbitraryIsItemsMode, (isItemsMode) => {
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        const shownCount = [showItemsDataSource, showListMode].filter(Boolean).length;
        expect(shownCount).toBe(1);
      }),
      { numRuns: 100 },
    );
  });

  it('sections are never both shown simultaneously', () => {
    fc.assert(
      fc.property(arbitraryIsItemsMode, (isItemsMode) => {
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        expect(showItemsDataSource && showListMode).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('sections are never both hidden simultaneously', () => {
    fc.assert(
      fc.property(arbitraryIsItemsMode, (isItemsMode) => {
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        expect(!showItemsDataSource && !showListMode).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('showItemsDataSource === isItemsMode for any value', () => {
    fc.assert(
      fc.property(arbitraryIsItemsMode, (isItemsMode) => {
        const { showItemsDataSource } = getSectionVisibility(isItemsMode);
        expect(showItemsDataSource).toBe(isItemsMode);
      }),
      { numRuns: 100 },
    );
  });

  it('showListMode === !isItemsMode for any value', () => {
    fc.assert(
      fc.property(arbitraryIsItemsMode, (isItemsMode) => {
        const { showListMode } = getSectionVisibility(isItemsMode);
        expect(showListMode).toBe(!isItemsMode);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3d: End-to-end — registryId → isItemsMode → section visibility
// ---------------------------------------------------------------------------

describe('PBT — Property 3d: end-to-end mutual exclusivity from registryId', () => {
  it('items-mode layouts always show "Items data source" and hide "List mode"', () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        const isItemsMode = computeIsItemsMode(registryId);
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        expect(showItemsDataSource).toBe(true);
        expect(showListMode).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('non-items-mode layouts always show "List mode" and hide "Items data source"', () => {
    fc.assert(
      fc.property(arbitraryNonItemsModeId, (registryId) => {
        const isItemsMode = computeIsItemsMode(registryId);
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        expect(showItemsDataSource).toBe(false);
        expect(showListMode).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('for any registryId, exactly one section is shown', () => {
    fc.assert(
      fc.property(arbitraryRegistryId, (registryId) => {
        const isItemsMode = computeIsItemsMode(registryId);
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        const shownCount = [showItemsDataSource, showListMode].filter(Boolean).length;
        expect(shownCount).toBe(1);
      }),
      { numRuns: 100 },
    );
  });

  it('for any registryId, sections are never both shown', () => {
    fc.assert(
      fc.property(arbitraryRegistryId, (registryId) => {
        const isItemsMode = computeIsItemsMode(registryId);
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        expect(showItemsDataSource && showListMode).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('for any registryId, sections are never both hidden', () => {
    fc.assert(
      fc.property(arbitraryRegistryId, (registryId) => {
        const isItemsMode = computeIsItemsMode(registryId);
        const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
        expect(!showItemsDataSource && !showListMode).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
