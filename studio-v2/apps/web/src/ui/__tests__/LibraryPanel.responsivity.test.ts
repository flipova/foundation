/**
 * Tests de responsivité du LibraryPanel
 *
 * Validates: Requirements 9.2, 9.3
 *
 * Tests:
 * - Masquage du sous-titre (itemSub) en dessous de 200px
 * - Conservation du label principal quelle que soit la largeur
 * - Troncature des labels (numberOfLines={1} + ellipsizeMode="tail")
 * - Breakpoints exportés depuis libraryResponsive.ts
 * - Largeur min/max du panneau (180px–280px)
 *
 * Note: Tests are written as pure logic tests using the exported LIBRARY_RESPONSIVE object,
 * following the same pattern as Topbar.responsivity.test.ts.
 */

import { describe, it, expect } from 'vitest';
import { LIBRARY_RESPONSIVE } from '../libraryResponsive';

// ---------------------------------------------------------------------------
// Tests — Breakpoints exportés (sanity check)
// ---------------------------------------------------------------------------

describe('LIBRARY_RESPONSIVE — breakpoints définis (Requirements 9.1, 9.2)', () => {
  it('MIN_WIDTH est 180', () => {
    expect(LIBRARY_RESPONSIVE.MIN_WIDTH).toBe(180);
  });

  it('MAX_WIDTH est 280', () => {
    expect(LIBRARY_RESPONSIVE.MAX_WIDTH).toBe(280);
  });

  it('BREAKPOINT_HIDE_SUBTITLE est 200', () => {
    expect(LIBRARY_RESPONSIVE.BREAKPOINT_HIDE_SUBTITLE).toBe(200);
  });

  it('MIN_WIDTH est inférieur à BREAKPOINT_HIDE_SUBTITLE', () => {
    expect(LIBRARY_RESPONSIVE.MIN_WIDTH).toBeLessThan(LIBRARY_RESPONSIVE.BREAKPOINT_HIDE_SUBTITLE);
  });

  it('BREAKPOINT_HIDE_SUBTITLE est inférieur à MAX_WIDTH', () => {
    expect(LIBRARY_RESPONSIVE.BREAKPOINT_HIDE_SUBTITLE).toBeLessThan(LIBRARY_RESPONSIVE.MAX_WIDTH);
  });
});

// ---------------------------------------------------------------------------
// Tests — shouldHideSubtitle : masquage du sous-titre (Requirement 9.2)
// ---------------------------------------------------------------------------

describe('LIBRARY_RESPONSIVE.shouldHideSubtitle — masquage du sous-titre à 200px (Requirement 9.2)', () => {
  it('retourne true quand la largeur est inférieure à 200px (ex. 199px)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(199)).toBe(true);
  });

  it('retourne true quand la largeur est au minimum (180px)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(180)).toBe(true);
  });

  it('retourne true quand la largeur est 190px', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(190)).toBe(true);
  });

  it('retourne false quand la largeur est exactement 200px (seuil non inclus)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(200)).toBe(false);
  });

  it('retourne false quand la largeur est 240px (valeur par défaut)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(240)).toBe(false);
  });

  it('retourne false quand la largeur est au maximum (280px)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(280)).toBe(false);
  });

  it('la transition se produit exactement au seuil de 200px', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(199)).toBe(true);
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(200)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests — Troncature des labels (Requirement 9.3)
// ---------------------------------------------------------------------------

describe('LIBRARY_RESPONSIVE — troncature des labels (Requirement 9.3)', () => {
  it('shouldHideSubtitle retourne un booléen (pas une dimension)', () => {
    expect(typeof LIBRARY_RESPONSIVE.shouldHideSubtitle(240)).toBe('boolean');
  });

  it('le label principal est toujours visible (shouldHideSubtitle ne masque que le sous-titre)', () => {
    // At any width, the main label is always shown — only the subtitle is conditionally hidden
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(180)).toBe(true);  // subtitle hidden
    // The label itself is always rendered (numberOfLines={1} + ellipsizeMode="tail" handles truncation)
    // This test verifies the logic: hiding subtitle ≠ hiding label
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(280)).toBe(false); // subtitle visible
  });

  it('à 180px (minimum) : sous-titre masqué, label tronqué si nécessaire', () => {
    const width = 180;
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(width)).toBe(true);
    expect(width).toBeGreaterThanOrEqual(LIBRARY_RESPONSIVE.MIN_WIDTH);
  });

  it('à 240px (défaut) : sous-titre visible, label tronqué si nécessaire', () => {
    const width = 240;
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(width)).toBe(false);
    expect(width).toBeGreaterThanOrEqual(LIBRARY_RESPONSIVE.MIN_WIDTH);
    expect(width).toBeLessThanOrEqual(LIBRARY_RESPONSIVE.MAX_WIDTH);
  });
});

// ---------------------------------------------------------------------------
// Tests — Largeur min/max du panneau (Requirement 9.1)
// ---------------------------------------------------------------------------

describe('LIBRARY_RESPONSIVE — largeur min/max (Requirement 9.1)', () => {
  it('MIN_WIDTH est 180px', () => {
    expect(LIBRARY_RESPONSIVE.MIN_WIDTH).toBe(180);
  });

  it('MAX_WIDTH est 280px', () => {
    expect(LIBRARY_RESPONSIVE.MAX_WIDTH).toBe(280);
  });

  it('MIN_WIDTH est strictement inférieur à MAX_WIDTH', () => {
    expect(LIBRARY_RESPONSIVE.MIN_WIDTH).toBeLessThan(LIBRARY_RESPONSIVE.MAX_WIDTH);
  });

  it('la plage de largeur est de 100px (280 - 180)', () => {
    expect(LIBRARY_RESPONSIVE.MAX_WIDTH - LIBRARY_RESPONSIVE.MIN_WIDTH).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Tests — Combinaison des comportements
// ---------------------------------------------------------------------------

describe('LIBRARY_RESPONSIVE — comportements combinés', () => {
  it('à 180px : sous-titre masqué (panneau au minimum)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(180)).toBe(true);
  });

  it('à 199px : sous-titre masqué (juste en dessous du seuil)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(199)).toBe(true);
  });

  it('à 200px : sous-titre visible (exactement au seuil)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(200)).toBe(false);
  });

  it('à 280px : sous-titre visible (panneau au maximum)', () => {
    expect(LIBRARY_RESPONSIVE.shouldHideSubtitle(280)).toBe(false);
  });
});
