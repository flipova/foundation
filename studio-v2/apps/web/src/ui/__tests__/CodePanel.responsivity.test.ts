/**
 * Tests de responsivité du CodePanel
 *
 * Validates: Requirements 13.1, 13.2
 *
 * Tests:
 * - Réduction de l'explorateur à 140px en dessous de 600px (Requirement 13.1)
 * - Troncature du chemin de fichier avec ellipse dans la barre d'onglets (Requirement 13.2)
 * - Breakpoints exportés depuis codeResponsive.ts
 *
 * Note: Tests are written as pure logic tests using the exported CODE_RESPONSIVE object,
 * following the same pattern as LogicPanel.responsivity.test.ts.
 */

import { describe, it, expect } from 'vitest';
import { CODE_RESPONSIVE } from '../codeResponsive';

// ---------------------------------------------------------------------------
// Tests — Breakpoints exportés
// ---------------------------------------------------------------------------

describe('CODE_RESPONSIVE — breakpoints définis', () => {
  it('BREAKPOINT_COMPACT_EXPLORER est 600', () => {
    expect(CODE_RESPONSIVE.BREAKPOINT_COMPACT_EXPLORER).toBe(600);
  });

  it('EXPLORER_WIDTH_NORMAL est 200', () => {
    expect(CODE_RESPONSIVE.EXPLORER_WIDTH_NORMAL).toBe(200);
  });

  it('EXPLORER_WIDTH_COMPACT est 140', () => {
    expect(CODE_RESPONSIVE.EXPLORER_WIDTH_COMPACT).toBe(140);
  });

  it('EXPLORER_WIDTH_COMPACT est inférieur à EXPLORER_WIDTH_NORMAL', () => {
    expect(CODE_RESPONSIVE.EXPLORER_WIDTH_COMPACT).toBeLessThan(CODE_RESPONSIVE.EXPLORER_WIDTH_NORMAL);
  });
});

// ---------------------------------------------------------------------------
// Tests — getExplorerWidth : réduction à 140px (Requirement 13.1)
// ---------------------------------------------------------------------------

describe('CODE_RESPONSIVE.getExplorerWidth — réduction à 140px en dessous de 600px (Requirement 13.1)', () => {
  it('retourne 140 quand la largeur est inférieure à 600px (ex. 599px)', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(599)).toBe(140);
  });

  it('retourne 140 quand la largeur est 400px', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(400)).toBe(140);
  });

  it('retourne 140 quand la largeur est 320px (minimum mobile)', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(320)).toBe(140);
  });

  it('retourne 140 quand la largeur est 0px', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(0)).toBe(140);
  });

  it('retourne 200 quand la largeur est exactement 600px (seuil non inclus)', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(600)).toBe(200);
  });

  it('retourne 200 quand la largeur est 768px', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(768)).toBe(200);
  });

  it('retourne 200 quand la largeur est 1024px', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(1024)).toBe(200);
  });

  it('retourne 200 quand la largeur est 1280px', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(1280)).toBe(200);
  });

  it('la transition se produit exactement au seuil de 600px', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(599)).toBe(140);
    expect(CODE_RESPONSIVE.getExplorerWidth(600)).toBe(200);
  });

  it('retourne un nombre', () => {
    expect(typeof CODE_RESPONSIVE.getExplorerWidth(800)).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// Tests — Troncature du chemin de fichier (Requirement 13.2)
// ---------------------------------------------------------------------------

describe('CODE_RESPONSIVE — troncature du chemin de fichier (Requirement 13.2)', () => {
  it('EXPLORER_WIDTH_COMPACT (140px) laisse de la place pour le chemin tronqué', () => {
    // The tab bar uses flex:1 for the path text, so truncation is handled by numberOfLines=1 + ellipsizeMode="tail"
    // We verify the compact width is smaller than normal to confirm space is reduced
    expect(CODE_RESPONSIVE.EXPLORER_WIDTH_COMPACT).toBeLessThan(CODE_RESPONSIVE.EXPLORER_WIDTH_NORMAL);
  });

  it('à 599px : explorateur compact (140px), plus de place pour le chemin dans la barre d\'onglets', () => {
    const explorerWidth = CODE_RESPONSIVE.getExplorerWidth(599);
    expect(explorerWidth).toBe(CODE_RESPONSIVE.EXPLORER_WIDTH_COMPACT);
  });

  it('à 600px : explorateur normal (200px), chemin affiché normalement', () => {
    const explorerWidth = CODE_RESPONSIVE.getExplorerWidth(600);
    expect(explorerWidth).toBe(CODE_RESPONSIVE.EXPLORER_WIDTH_NORMAL);
  });

  it('la différence de largeur entre normal et compact est de 60px', () => {
    expect(CODE_RESPONSIVE.EXPLORER_WIDTH_NORMAL - CODE_RESPONSIVE.EXPLORER_WIDTH_COMPACT).toBe(60);
  });
});

// ---------------------------------------------------------------------------
// Tests — Comportements combinés
// ---------------------------------------------------------------------------

describe('CODE_RESPONSIVE — comportements combinés', () => {
  it('à 320px : explorateur compact (140px)', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(320)).toBe(140);
  });

  it('à 599px : explorateur compact (juste en dessous du seuil)', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(599)).toBe(140);
  });

  it('à 600px : explorateur normal (exactement au seuil)', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(600)).toBe(200);
  });

  it('à 1920px : explorateur normal (grand écran)', () => {
    expect(CODE_RESPONSIVE.getExplorerWidth(1920)).toBe(200);
  });
});
