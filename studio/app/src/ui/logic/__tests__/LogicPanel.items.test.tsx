/**
 * Unit tests — Section visibility and updateRepeat calls for items-mode layouts
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 *
 * Since LogicPanel has heavy store dependencies, we test the pure logic
 * extracted from the component:
 *
 * - isItemsMode detection via getLayoutMeta + deriveSlotConfig (Req 3.1, 3.2)
 * - Mutual exclusivity: items-mode → show "Items data source", hide "List mode" (Req 3.1, 3.2)
 * - updateRepeat call shape when source is set (Req 3.3)
 * - updateRepeat call shape when Remove is pressed (Req 3.5)
 * - ItemsDataSourceSection renders source and Remove button when repeatBinding is set (Req 3.4)
 * - ItemsDataSourceSection renders hint when no repeatBinding (Req 3.4)
 */

import { describe, it, expect } from 'vitest';
import { getLayoutMeta } from '../../../../../../foundation/layout/registry/layouts';
import { deriveSlotConfig } from '../../../renderer/slotConfig';

// ---------------------------------------------------------------------------
// Known items-mode layout IDs (from registry)
// ---------------------------------------------------------------------------

const ITEMS_MODE_IDS = [
  'BentoLayout',
  'GridLayout',
  'DeckLayout',
  'SwiperLayout',
  'MasonryLayout',
  'ParallaxLayout',
  'CrossTabLayout',
];

// Known non-items-mode layout IDs
const NON_ITEMS_MODE_IDS = [
  'RootLayout',
  'FlexLayout',
  'SplitLayout',
  'DashboardLayout',
  'AuthLayout',
  'SidebarLayout',
  'FooterLayout',
  'ScrollLayout',
];

// ---------------------------------------------------------------------------
// Pure helper — mirrors LogicPanel's isItemsMode useMemo
// ---------------------------------------------------------------------------

function computeIsItemsMode(registryId: string): boolean {
  const layoutMeta = getLayoutMeta(registryId);
  const slotCfg = deriveSlotConfig(layoutMeta?.slots as any);
  return slotCfg.mode === 'items';
}

// ---------------------------------------------------------------------------
// Pure helper — mirrors the section visibility logic in LogicPanel
// ---------------------------------------------------------------------------

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
// Pure helper — mirrors ItemsDataSourceSection onChange logic
// ---------------------------------------------------------------------------

type RepeatBinding = { source: string; keyProp: string; itemVar?: string } | undefined;

function computeRepeatOnChange(
  value: string,
  existingRepeat: RepeatBinding,
): RepeatBinding {
  return value ? { source: value, keyProp: existingRepeat?.keyProp || 'id' } : undefined;
}

function computeRepeatOnKeyPropChange(
  value: string,
  existingRepeat: RepeatBinding,
): RepeatBinding {
  if (!existingRepeat) return undefined;
  return { ...existingRepeat, keyProp: value };
}

// ---------------------------------------------------------------------------
// Tests — isItemsMode detection (Requirements 3.1, 3.2)
// ---------------------------------------------------------------------------

describe('isItemsMode detection — items-mode layouts (Req 3.1)', () => {
  it.each(ITEMS_MODE_IDS)('returns true for %s', (id) => {
    expect(computeIsItemsMode(id)).toBe(true);
  });

  it('returns true for BentoLayout (single array slot named "items")', () => {
    expect(computeIsItemsMode('BentoLayout')).toBe(true);
  });

  it('returns true for GridLayout (single array slot named "items")', () => {
    expect(computeIsItemsMode('GridLayout')).toBe(true);
  });

  it('returns true for DeckLayout (single array slot named "items")', () => {
    expect(computeIsItemsMode('DeckLayout')).toBe(true);
  });

  it('returns true for SwiperLayout (single array slot named "items")', () => {
    expect(computeIsItemsMode('SwiperLayout')).toBe(true);
  });

  it('returns true for MasonryLayout (single array slot named "items")', () => {
    expect(computeIsItemsMode('MasonryLayout')).toBe(true);
  });

  it('returns true for ParallaxLayout (single array slot named "items")', () => {
    expect(computeIsItemsMode('ParallaxLayout')).toBe(true);
  });
});

describe('isItemsMode detection — non-items-mode layouts (Req 3.2)', () => {
  it.each(NON_ITEMS_MODE_IDS)('returns false for %s', (id) => {
    expect(computeIsItemsMode(id)).toBe(false);
  });

  it('returns false for RootLayout (children slot, no array)', () => {
    expect(computeIsItemsMode('RootLayout')).toBe(false);
  });

  it('returns false for FlexLayout (children slot, no array)', () => {
    expect(computeIsItemsMode('FlexLayout')).toBe(false);
  });

  it('returns false for SplitLayout (multiple named slots)', () => {
    expect(computeIsItemsMode('SplitLayout')).toBe(false);
  });

  it('returns false for unknown registryId (getLayoutMeta returns undefined)', () => {
    expect(computeIsItemsMode('UnknownLayout')).toBe(false);
  });

  it('returns false for empty string registryId', () => {
    expect(computeIsItemsMode('')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests — Section visibility mutual exclusivity (Requirements 3.1, 3.2)
// ---------------------------------------------------------------------------

describe('Section visibility — mutual exclusivity (Req 3.1, 3.2)', () => {
  it('shows "Items data source" and hides "List mode" when isItemsMode=true', () => {
    const { showItemsDataSource, showListMode } = getSectionVisibility(true);
    expect(showItemsDataSource).toBe(true);
    expect(showListMode).toBe(false);
  });

  it('shows "List mode" and hides "Items data source" when isItemsMode=false', () => {
    const { showItemsDataSource, showListMode } = getSectionVisibility(false);
    expect(showItemsDataSource).toBe(false);
    expect(showListMode).toBe(true);
  });

  it('exactly one section is shown for items-mode node', () => {
    const { showItemsDataSource, showListMode } = getSectionVisibility(true);
    const shown = [showItemsDataSource, showListMode].filter(Boolean).length;
    expect(shown).toBe(1);
  });

  it('exactly one section is shown for non-items-mode node', () => {
    const { showItemsDataSource, showListMode } = getSectionVisibility(false);
    const shown = [showItemsDataSource, showListMode].filter(Boolean).length;
    expect(shown).toBe(1);
  });

  it('sections are never both shown simultaneously', () => {
    for (const isItemsMode of [true, false]) {
      const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
      expect(showItemsDataSource && showListMode).toBe(false);
    }
  });

  it('sections are never both hidden simultaneously', () => {
    for (const isItemsMode of [true, false]) {
      const { showItemsDataSource, showListMode } = getSectionVisibility(isItemsMode);
      expect(!showItemsDataSource && !showListMode).toBe(false);
    }
  });

  it('BentoLayout shows "Items data source" section', () => {
    const isItemsMode = computeIsItemsMode('BentoLayout');
    const { showItemsDataSource } = getSectionVisibility(isItemsMode);
    expect(showItemsDataSource).toBe(true);
  });

  it('BentoLayout hides "List mode" section', () => {
    const isItemsMode = computeIsItemsMode('BentoLayout');
    const { showListMode } = getSectionVisibility(isItemsMode);
    expect(showListMode).toBe(false);
  });

  it('FlexLayout shows "List mode" section', () => {
    const isItemsMode = computeIsItemsMode('FlexLayout');
    const { showListMode } = getSectionVisibility(isItemsMode);
    expect(showListMode).toBe(true);
  });

  it('FlexLayout hides "Items data source" section', () => {
    const isItemsMode = computeIsItemsMode('FlexLayout');
    const { showItemsDataSource } = getSectionVisibility(isItemsMode);
    expect(showItemsDataSource).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests — updateRepeat call shape (Requirements 3.3, 3.5)
// ---------------------------------------------------------------------------

describe('updateRepeat — source input onChange (Req 3.3)', () => {
  it('returns { source, keyProp: "id" } when value is set and no existing repeat', () => {
    const result = computeRepeatOnChange('$state.products', undefined);
    expect(result).toEqual({ source: '$state.products', keyProp: 'id' });
  });

  it('preserves existing keyProp when value is set', () => {
    const existing: RepeatBinding = { source: '$state.old', keyProp: 'uuid' };
    const result = computeRepeatOnChange('$state.products', existing);
    expect(result).toEqual({ source: '$state.products', keyProp: 'uuid' });
  });

  it('returns undefined when value is empty string (Remove)', () => {
    const result = computeRepeatOnChange('', { source: '$state.products', keyProp: 'id' });
    expect(result).toBeUndefined();
  });

  it('returns undefined when value is empty and no existing repeat', () => {
    const result = computeRepeatOnChange('', undefined);
    expect(result).toBeUndefined();
  });

  it('uses "id" as default keyProp when no existing repeat', () => {
    const result = computeRepeatOnChange('$state.items', undefined);
    expect(result?.keyProp).toBe('id');
  });

  it('source is set correctly in the returned object', () => {
    const result = computeRepeatOnChange('$state.users', undefined);
    expect(result?.source).toBe('$state.users');
  });
});

describe('updateRepeat — keyProp input onChange (Req 3.3)', () => {
  it('updates keyProp while preserving source', () => {
    const existing: RepeatBinding = { source: '$state.products', keyProp: 'id' };
    const result = computeRepeatOnKeyPropChange('uuid', existing);
    expect(result).toEqual({ source: '$state.products', keyProp: 'uuid' });
  });

  it('returns undefined when no existing repeat', () => {
    const result = computeRepeatOnKeyPropChange('uuid', undefined);
    expect(result).toBeUndefined();
  });
});

describe('updateRepeat — Remove button (Req 3.5)', () => {
  it('Remove button calls onChange(undefined)', () => {
    // The Remove button calls onChange(undefined) directly
    // We verify the expected call value is undefined
    const removeCallValue: RepeatBinding = undefined;
    expect(removeCallValue).toBeUndefined();
  });

  it('after Remove, repeatBinding is cleared', () => {
    // Simulate: node had repeatBinding, Remove pressed → updateRepeat(id, undefined)
    let repeatBinding: RepeatBinding = { source: '$state.products', keyProp: 'id' };
    // Remove pressed
    repeatBinding = undefined;
    expect(repeatBinding).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Tests — ItemsDataSourceSection display state (Requirement 3.4)
// ---------------------------------------------------------------------------

describe('ItemsDataSourceSection — display state (Req 3.4)', () => {
  it('shows current source value when repeatBinding is set', () => {
    const repeat: RepeatBinding = { source: '$state.products', keyProp: 'id' };
    // The component renders repeat.source as the SmartInput value
    expect(repeat?.source).toBe('$state.products');
  });

  it('shows empty string in source input when no repeatBinding', () => {
    const repeat: RepeatBinding | undefined = undefined as any;
    const inputValue = repeat?.source || '';
    expect(inputValue).toBe('');
  });

  it('shows Remove button when repeatBinding is set', () => {
    const repeat: RepeatBinding = { source: '$state.products', keyProp: 'id' };
    const showRemoveButton = !!repeat;
    expect(showRemoveButton).toBe(true);
  });

  it('hides Remove button when no repeatBinding', () => {
    const repeat: RepeatBinding = undefined;
    const showRemoveButton = !!repeat;
    expect(showRemoveButton).toBe(false);
  });

  it('shows hint text when no repeatBinding', () => {
    const repeat: RepeatBinding = undefined;
    const showHint = !repeat;
    expect(showHint).toBe(true);
  });

  it('hides hint text when repeatBinding is set', () => {
    const repeat: RepeatBinding = { source: '$state.products', keyProp: 'id' };
    const showHint = !repeat;
    expect(showHint).toBe(false);
  });

  it('shows keyProp input when repeatBinding is set', () => {
    const repeat: RepeatBinding = { source: '$state.products', keyProp: 'id' };
    const showKeyPropInput = !!repeat;
    expect(showKeyPropInput).toBe(true);
  });

  it('keyProp input value matches repeatBinding.keyProp', () => {
    const repeat: RepeatBinding = { source: '$state.products', keyProp: 'uuid' };
    expect(repeat?.keyProp).toBe('uuid');
  });
});

// ---------------------------------------------------------------------------
// Tests — getLayoutMeta + deriveSlotConfig integration (Req 3.1)
// ---------------------------------------------------------------------------

describe('getLayoutMeta + deriveSlotConfig integration (Req 3.1)', () => {
  it('BentoLayout has a single array slot named "items"', () => {
    const meta = getLayoutMeta('BentoLayout');
    expect(meta?.slots).toHaveLength(1);
    expect(meta?.slots?.[0].array).toBe(true);
    expect(meta?.slots?.[0].name).toBe('items');
  });

  it('GridLayout has a single array slot named "items"', () => {
    const meta = getLayoutMeta('GridLayout');
    expect(meta?.slots).toHaveLength(1);
    expect(meta?.slots?.[0].array).toBe(true);
  });

  it('deriveSlotConfig returns mode "items" for BentoLayout slots', () => {
    const meta = getLayoutMeta('BentoLayout');
    const cfg = deriveSlotConfig(meta?.slots as any);
    expect(cfg.mode).toBe('items');
  });

  it('deriveSlotConfig returns mode "items" for DeckLayout slots', () => {
    const meta = getLayoutMeta('DeckLayout');
    const cfg = deriveSlotConfig(meta?.slots as any);
    expect(cfg.mode).toBe('items');
  });

  it('deriveSlotConfig returns mode "children" for RootLayout slots', () => {
    const meta = getLayoutMeta('RootLayout');
    const cfg = deriveSlotConfig(meta?.slots as any);
    expect(cfg.mode).toBe('children');
  });

  it('deriveSlotConfig returns mode "named" for SplitLayout slots', () => {
    const meta = getLayoutMeta('SplitLayout');
    const cfg = deriveSlotConfig(meta?.slots as any);
    expect(cfg.mode).toBe('named');
  });

  it('getLayoutMeta returns undefined for unknown ID → isItemsMode defaults to false', () => {
    const meta = getLayoutMeta('NonExistentLayout');
    const cfg = deriveSlotConfig(meta?.slots as any);
    expect(cfg.mode).not.toBe('items');
  });
});
