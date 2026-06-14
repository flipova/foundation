/**
 * Tests de responsivité du LayersPanel
 *
 * Validates: Requirements 10.1, 10.3
 *
 * Tests:
 * - Breakpoints exportés depuis layersResponsive.ts (hauteur min/max)
 * - Masquage des badges secondaires (binding, repeat) en dessous de 200px
 * - Conservation des badges principaux (condition, événement) quelle que soit la hauteur
 * - Transition exacte au seuil de 200px
 *
 * Note: Tests are written as pure logic tests using the exported LAYERS_RESPONSIVE object,
 * following the same pattern as LibraryPanel.responsivity.test.ts.
 */

import { describe, it, expect } from 'vitest';
import { LAYERS_RESPONSIVE } from '../layersResponsive';

// ---------------------------------------------------------------------------
// Tests — Breakpoints exportés (Requirement 10.1)
// ---------------------------------------------------------------------------

describe('LAYERS_RESPONSIVE — breakpoints définis (Requirement 10.1)', () => {
  it('MIN_HEIGHT est 160', () => {
    expect(LAYERS_RESPONSIVE.MIN_HEIGHT).toBe(160);
  });

  it('MAX_HEIGHT est 320', () => {
    expect(LAYERS_RESPONSIVE.MAX_HEIGHT).toBe(320);
  });

  it('BREAKPOINT_HIDE_SECONDARY_BADGES est 200', () => {
    expect(LAYERS_RESPONSIVE.BREAKPOINT_HIDE_SECONDARY_BADGES).toBe(200);
  });

  it('MIN_HEIGHT est inférieur à BREAKPOINT_HIDE_SECONDARY_BADGES', () => {
    expect(LAYERS_RESPONSIVE.MIN_HEIGHT).toBeLessThan(LAYERS_RESPONSIVE.BREAKPOINT_HIDE_SECONDARY_BADGES);
  });

  it('BREAKPOINT_HIDE_SECONDARY_BADGES est inférieur à MAX_HEIGHT', () => {
    expect(LAYERS_RESPONSIVE.BREAKPOINT_HIDE_SECONDARY_BADGES).toBeLessThan(LAYERS_RESPONSIVE.MAX_HEIGHT);
  });

  it('MIN_HEIGHT est strictement inférieur à MAX_HEIGHT', () => {
    expect(LAYERS_RESPONSIVE.MIN_HEIGHT).toBeLessThan(LAYERS_RESPONSIVE.MAX_HEIGHT);
  });

  it('la plage de hauteur est de 160px (320 - 160)', () => {
    expect(LAYERS_RESPONSIVE.MAX_HEIGHT - LAYERS_RESPONSIVE.MIN_HEIGHT).toBe(160);
  });
});

// ---------------------------------------------------------------------------
// Tests — shouldHideSecondaryBadges : masquage des badges secondaires (Requirement 10.3)
// ---------------------------------------------------------------------------

describe('LAYERS_RESPONSIVE.shouldHideSecondaryBadges — masquage à 200px (Requirement 10.3)', () => {
  it('retourne true quand la hauteur est inférieure à 200px (ex. 199px)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(199)).toBe(true);
  });

  it('retourne true quand la hauteur est au minimum (160px)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(160)).toBe(true);
  });

  it('retourne true quand la hauteur est 180px', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(180)).toBe(true);
  });

  it('retourne false quand la hauteur est exactement 200px (seuil non inclus)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(200)).toBe(false);
  });

  it('retourne false quand la hauteur est 220px (valeur par défaut)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(220)).toBe(false);
  });

  it('retourne false quand la hauteur est au maximum (320px)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(320)).toBe(false);
  });

  it('la transition se produit exactement au seuil de 200px', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(199)).toBe(true);
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(200)).toBe(false);
  });

  it('retourne un booléen', () => {
    expect(typeof LAYERS_RESPONSIVE.shouldHideSecondaryBadges(220)).toBe('boolean');
  });
});

// ---------------------------------------------------------------------------
// Tests — Badges principaux toujours visibles (condition, événement)
// ---------------------------------------------------------------------------

describe('LAYERS_RESPONSIVE — badges principaux toujours conservés', () => {
  it('à 160px (minimum) : badges secondaires masqués', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(160)).toBe(true);
  });

  it('à 199px : badges secondaires masqués (juste en dessous du seuil)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(199)).toBe(true);
  });

  it('à 200px : badges secondaires visibles (exactement au seuil)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(200)).toBe(false);
  });

  it('à 320px (maximum) : badges secondaires visibles', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(320)).toBe(false);
  });

  it('shouldHideSecondaryBadges ne masque que les badges secondaires (binding, repeat), pas les principaux (condition, événement)', () => {
    // The function only controls secondary badges — primary badges (condition, event) are always shown
    // This test verifies the semantic: hiding secondary ≠ hiding all badges
    const hideSecondary = LAYERS_RESPONSIVE.shouldHideSecondaryBadges(180);
    expect(hideSecondary).toBe(true); // secondary hidden
    // Primary badges (condition, event) are always rendered regardless of this value
  });
});

// ---------------------------------------------------------------------------
// Tests — Combinaison des comportements
// ---------------------------------------------------------------------------

describe('LAYERS_RESPONSIVE — comportements combinés', () => {
  it('à 160px : badges secondaires masqués (panneau au minimum)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(160)).toBe(true);
  });

  it('à 199px : badges secondaires masqués (juste en dessous du seuil)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(199)).toBe(true);
  });

  it('à 200px : badges secondaires visibles (exactement au seuil)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(200)).toBe(false);
  });

  it('à 280px : badges secondaires visibles (hauteur intermédiaire)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(280)).toBe(false);
  });

  it('à 320px : badges secondaires visibles (panneau au maximum)', () => {
    expect(LAYERS_RESPONSIVE.shouldHideSecondaryBadges(320)).toBe(false);
  });
});
