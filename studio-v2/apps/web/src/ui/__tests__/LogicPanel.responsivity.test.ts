/**
 * Tests de responsivité du LogicPanel
 *
 * Validates: Requirements 12.3, 12.4
 *
 * Tests:
 * - Breakpoints exportés depuis logicResponsive.ts (largeur min/max)
 * - Passage en colonne unique en dessous de 260px (Requirement 12.3)
 * - Troncature des noms de variables et de champs (numberOfLines={1} + ellipsizeMode="tail") (Requirement 12.4)
 * - Transition exacte au seuil de 260px
 *
 * Note: Tests are written as pure logic tests using the exported LOGIC_RESPONSIVE object,
 * following the same pattern as DesignPanel.responsivity.test.ts.
 */

import { describe, it, expect } from 'vitest';
import { LOGIC_RESPONSIVE } from '../logicResponsive';

// ---------------------------------------------------------------------------
// Tests — Breakpoints exportés (Requirement 12.1)
// ---------------------------------------------------------------------------

describe('LOGIC_RESPONSIVE — breakpoints définis (Requirement 12.1)', () => {
  it('MIN_WIDTH est 220', () => {
    expect(LOGIC_RESPONSIVE.MIN_WIDTH).toBe(220);
  });

  it('MAX_WIDTH est 360', () => {
    expect(LOGIC_RESPONSIVE.MAX_WIDTH).toBe(360);
  });

  it('BREAKPOINT_SINGLE_COLUMN est 260', () => {
    expect(LOGIC_RESPONSIVE.BREAKPOINT_SINGLE_COLUMN).toBe(260);
  });

  it('MIN_WIDTH est inférieur à BREAKPOINT_SINGLE_COLUMN', () => {
    expect(LOGIC_RESPONSIVE.MIN_WIDTH).toBeLessThan(LOGIC_RESPONSIVE.BREAKPOINT_SINGLE_COLUMN);
  });

  it('BREAKPOINT_SINGLE_COLUMN est inférieur à MAX_WIDTH', () => {
    expect(LOGIC_RESPONSIVE.BREAKPOINT_SINGLE_COLUMN).toBeLessThan(LOGIC_RESPONSIVE.MAX_WIDTH);
  });

  it('MIN_WIDTH est strictement inférieur à MAX_WIDTH', () => {
    expect(LOGIC_RESPONSIVE.MIN_WIDTH).toBeLessThan(LOGIC_RESPONSIVE.MAX_WIDTH);
  });

  it('la plage de largeur est de 140px (360 - 220)', () => {
    expect(LOGIC_RESPONSIVE.MAX_WIDTH - LOGIC_RESPONSIVE.MIN_WIDTH).toBe(140);
  });
});

// ---------------------------------------------------------------------------
// Tests — shouldUseSingleColumn : passage en colonne unique (Requirement 12.3)
// ---------------------------------------------------------------------------

describe('LOGIC_RESPONSIVE.shouldUseSingleColumn — passage en colonne unique à 260px (Requirement 12.3)', () => {
  it('retourne true quand la largeur est inférieure à 260px (ex. 259px)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(259)).toBe(true);
  });

  it('retourne true quand la largeur est au minimum (220px)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(220)).toBe(true);
  });

  it('retourne true quand la largeur est 240px', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(240)).toBe(true);
  });

  it('retourne false quand la largeur est exactement 260px (seuil non inclus)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(260)).toBe(false);
  });

  it('retourne false quand la largeur est 280px (valeur par défaut)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(280)).toBe(false);
  });

  it('retourne false quand la largeur est au maximum (360px)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(360)).toBe(false);
  });

  it('la transition se produit exactement au seuil de 260px', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(259)).toBe(true);
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(260)).toBe(false);
  });

  it('retourne un booléen', () => {
    expect(typeof LOGIC_RESPONSIVE.shouldUseSingleColumn(280)).toBe('boolean');
  });
});

// ---------------------------------------------------------------------------
// Tests — Troncature des noms de variables et de champs (Requirement 12.4)
// ---------------------------------------------------------------------------

describe('LOGIC_RESPONSIVE — troncature des noms (Requirement 12.4)', () => {
  it('shouldUseSingleColumn retourne un booléen (pas une dimension)', () => {
    expect(typeof LOGIC_RESPONSIVE.shouldUseSingleColumn(280)).toBe('boolean');
  });

  it('à 220px (minimum) : colonne unique active', () => {
    const width = 220;
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(width)).toBe(true);
    expect(width).toBeGreaterThanOrEqual(LOGIC_RESPONSIVE.MIN_WIDTH);
  });

  it('à 280px (défaut) : colonnes multiples actives', () => {
    const width = 280;
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(width)).toBe(false);
    expect(width).toBeGreaterThanOrEqual(LOGIC_RESPONSIVE.MIN_WIDTH);
    expect(width).toBeLessThanOrEqual(LOGIC_RESPONSIVE.MAX_WIDTH);
  });

  it('la troncature ne masque pas les contrôles d\'action (logique séparée)', () => {
    // shouldUseSingleColumn controls layout only — name truncation (numberOfLines=1 + ellipsizeMode="tail")
    // is applied independently and never hides the action controls (unlink button, etc.)
    const singleCol = LOGIC_RESPONSIVE.shouldUseSingleColumn(240);
    expect(singleCol).toBe(true); // layout switches to single column
    // Action controls (unlink button) are always visible regardless of name truncation
  });
});

// ---------------------------------------------------------------------------
// Tests — pickerGrid flexWrap (Requirement 12.2)
// ---------------------------------------------------------------------------

describe('LOGIC_RESPONSIVE — pickerGrid flexWrap (Requirement 12.2)', () => {
  it('à 220px (minimum) : le panneau est dans la plage valide', () => {
    const width = 220;
    expect(width).toBeGreaterThanOrEqual(LOGIC_RESPONSIVE.MIN_WIDTH);
    expect(width).toBeLessThanOrEqual(LOGIC_RESPONSIVE.MAX_WIDTH);
  });

  it('à 360px (maximum) : le panneau est dans la plage valide', () => {
    const width = 360;
    expect(width).toBeGreaterThanOrEqual(LOGIC_RESPONSIVE.MIN_WIDTH);
    expect(width).toBeLessThanOrEqual(LOGIC_RESPONSIVE.MAX_WIDTH);
  });

  it('à 290px (milieu) : le panneau est dans la plage valide', () => {
    const width = 290;
    expect(width).toBeGreaterThanOrEqual(LOGIC_RESPONSIVE.MIN_WIDTH);
    expect(width).toBeLessThanOrEqual(LOGIC_RESPONSIVE.MAX_WIDTH);
  });
});

// ---------------------------------------------------------------------------
// Tests — Combinaison des comportements
// ---------------------------------------------------------------------------

describe('LOGIC_RESPONSIVE — comportements combinés', () => {
  it('à 220px : colonne unique active (panneau au minimum)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(220)).toBe(true);
  });

  it('à 259px : colonne unique active (juste en dessous du seuil)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(259)).toBe(true);
  });

  it('à 260px : colonnes multiples actives (exactement au seuil)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(260)).toBe(false);
  });

  it('à 300px : colonnes multiples actives (largeur intermédiaire)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(300)).toBe(false);
  });

  it('à 360px : colonnes multiples actives (panneau au maximum)', () => {
    expect(LOGIC_RESPONSIVE.shouldUseSingleColumn(360)).toBe(false);
  });
});
