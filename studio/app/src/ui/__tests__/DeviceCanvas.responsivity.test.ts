/**
 * Tests de responsivité du DeviceCanvas
 *
 * Validates: Requirements 14.1, 14.4
 *
 * Tests:
 * - Calcul du zoom initial pour que le device soit entièrement visible (Requirement 14.1)
 * - Réduction automatique du zoom en dessous de 320px (Requirement 14.4)
 * - Breakpoints exportés depuis canvasResponsive.ts
 *
 * Note: Tests are written as pure logic tests using the exported CANVAS_RESPONSIVE object,
 * following the same pattern as CodePanel.responsivity.test.ts.
 */

import { describe, it, expect } from 'vitest';
import { CANVAS_RESPONSIVE } from '../canvasResponsive';

// ---------------------------------------------------------------------------
// Tests — Breakpoints exportés
// ---------------------------------------------------------------------------

describe('CANVAS_RESPONSIVE — breakpoints définis', () => {
  it('BREAKPOINT_REDUCE_ZOOM est 320', () => {
    expect(CANVAS_RESPONSIVE.BREAKPOINT_REDUCE_ZOOM).toBe(320);
  });

  it('CANVAS_PADDING est un nombre positif', () => {
    expect(CANVAS_RESPONSIVE.CANVAS_PADDING).toBeGreaterThan(0);
  });

  it('CANVAS_RESPONSIVE expose calculateInitialZoom', () => {
    expect(typeof CANVAS_RESPONSIVE.calculateInitialZoom).toBe('function');
  });

  it('CANVAS_RESPONSIVE expose shouldReduceZoom', () => {
    expect(typeof CANVAS_RESPONSIVE.shouldReduceZoom).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// Tests — calculateInitialZoom (Requirement 14.1)
// ---------------------------------------------------------------------------

describe('CANVAS_RESPONSIVE.calculateInitialZoom — zoom initial (Requirement 14.1)', () => {
  it('retourne 100 quand le canvas est suffisamment large pour le device', () => {
    // canvas 800px, device 390px → ratio ~1.8 → clamped to 100
    expect(CANVAS_RESPONSIVE.calculateInitialZoom(800, 390)).toBe(100);
  });

  it('retourne un zoom réduit quand le canvas est plus étroit que le device', () => {
    // canvas 400px, device 390px, padding 48*2=96 → available 304 → ratio ~0.78 → zoom 78
    const zoom = CANVAS_RESPONSIVE.calculateInitialZoom(400, 390);
    expect(zoom).toBeLessThan(100);
    expect(zoom).toBeGreaterThan(0);
  });

  it('le zoom est compris entre 10 et 100', () => {
    const cases = [
      [100, 390], [400, 390], [320, 390], [200, 390], [50, 390],
      [1920, 1280], [800, 820],
    ] as [number, number][];
    for (const [cw, dw] of cases) {
      const zoom = CANVAS_RESPONSIVE.calculateInitialZoom(cw, dw);
      expect(zoom).toBeGreaterThanOrEqual(10);
      expect(zoom).toBeLessThanOrEqual(100);
    }
  });

  it('retourne 100 quand le canvas est très large (1920px, device 390px)', () => {
    expect(CANVAS_RESPONSIVE.calculateInitialZoom(1920, 390)).toBe(100);
  });

  it('retourne 100 quand le canvas est exactement la taille du device + padding', () => {
    const padding = CANVAS_RESPONSIVE.CANVAS_PADDING * 2;
    const deviceWidth = 390;
    // available = deviceWidth → ratio = 1 → zoom = 100
    expect(CANVAS_RESPONSIVE.calculateInitialZoom(deviceWidth + padding, deviceWidth)).toBe(100);
  });

  it('retourne 10 (minimum) quand le canvas est très petit', () => {
    expect(CANVAS_RESPONSIVE.calculateInitialZoom(10, 390)).toBe(10);
  });

  it('retourne 100 quand deviceWidth est 0 (cas dégénéré)', () => {
    expect(CANVAS_RESPONSIVE.calculateInitialZoom(800, 0)).toBe(100);
  });

  it('retourne 100 quand canvasWidth est 0 (cas dégénéré)', () => {
    expect(CANVAS_RESPONSIVE.calculateInitialZoom(0, 390)).toBe(100);
  });

  it('retourne un nombre entier', () => {
    const zoom = CANVAS_RESPONSIVE.calculateInitialZoom(500, 390);
    expect(Number.isInteger(zoom)).toBe(true);
  });

  it('zoom plus petit pour un canvas plus étroit', () => {
    const zoomWide = CANVAS_RESPONSIVE.calculateInitialZoom(800, 390);
    const zoomNarrow = CANVAS_RESPONSIVE.calculateInitialZoom(400, 390);
    expect(zoomNarrow).toBeLessThanOrEqual(zoomWide);
  });

  it('zoom plus petit pour un device plus large', () => {
    const zoomSmallDevice = CANVAS_RESPONSIVE.calculateInitialZoom(600, 390);
    const zoomLargeDevice = CANVAS_RESPONSIVE.calculateInitialZoom(600, 820);
    expect(zoomLargeDevice).toBeLessThanOrEqual(zoomSmallDevice);
  });
});

// ---------------------------------------------------------------------------
// Tests — shouldReduceZoom (Requirement 14.4)
// ---------------------------------------------------------------------------

describe('CANVAS_RESPONSIVE.shouldReduceZoom — réduction en dessous de 320px (Requirement 14.4)', () => {
  it('retourne true quand la largeur est inférieure à 320px (ex. 319px)', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(319)).toBe(true);
  });

  it('retourne true quand la largeur est 200px', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(200)).toBe(true);
  });

  it('retourne true quand la largeur est 0px', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(0)).toBe(true);
  });

  it('retourne false quand la largeur est exactement 320px (seuil non inclus)', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(320)).toBe(false);
  });

  it('retourne false quand la largeur est 400px', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(400)).toBe(false);
  });

  it('retourne false quand la largeur est 768px', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(768)).toBe(false);
  });

  it('retourne false quand la largeur est 1024px', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(1024)).toBe(false);
  });

  it('la transition se produit exactement au seuil de 320px', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(319)).toBe(true);
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(320)).toBe(false);
  });

  it('retourne un booléen', () => {
    expect(typeof CANVAS_RESPONSIVE.shouldReduceZoom(400)).toBe('boolean');
  });
});

// ---------------------------------------------------------------------------
// Tests — Comportements combinés
// ---------------------------------------------------------------------------

describe('CANVAS_RESPONSIVE — comportements combinés', () => {
  it('à 319px : shouldReduceZoom=true et calculateInitialZoom retourne ≤ 100', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(319)).toBe(true);
    const zoom = CANVAS_RESPONSIVE.calculateInitialZoom(319, 390);
    expect(zoom).toBeLessThanOrEqual(100);
    expect(zoom).toBeGreaterThanOrEqual(10);
  });

  it('à 320px : shouldReduceZoom=false', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(320)).toBe(false);
  });

  it('à 1280px : shouldReduceZoom=false et zoom=100 pour un device 390px', () => {
    expect(CANVAS_RESPONSIVE.shouldReduceZoom(1280)).toBe(false);
    expect(CANVAS_RESPONSIVE.calculateInitialZoom(1280, 390)).toBe(100);
  });

  it('calculateInitialZoom tient compte du padding de chaque côté', () => {
    const padding = CANVAS_RESPONSIVE.CANVAS_PADDING;
    const deviceWidth = 390;
    // With exactly deviceWidth + 2*padding, zoom should be 100
    const exactFit = CANVAS_RESPONSIVE.calculateInitialZoom(deviceWidth + padding * 2, deviceWidth);
    expect(exactFit).toBe(100);
    // With 1px less, zoom should be < 100
    const tooNarrow = CANVAS_RESPONSIVE.calculateInitialZoom(deviceWidth + padding * 2 - 1, deviceWidth);
    expect(tooNarrow).toBeLessThan(100);
  });
});
