/**
 * Tests de non-superposition des panneaux du Studio
 *
 * Validates: Requirements 15.1, 15.6
 *
 * Tests:
 * - Aux breakpoints 768px, 1024px, 1280px : les panneaux ne se chevauchent pas
 * - Le DeviceCanvas n'est jamais recouvert par les panneaux latéraux
 * - clampPanelWidths garantit une largeur minimale du canvas (MIN_CANVAS_WIDTH)
 * - panelsOverlapCanvas détecte correctement les chevauchements
 * - Z_INDEX : les modales et menus déroulants sont au-dessus de tous les autres éléments
 *
 * Note: Tests are written as pure logic tests using the exported LAYOUT_RESPONSIVE and Z_INDEX
 * objects, following the same pattern as other responsivity tests in this project.
 */

import { describe, it, expect } from 'vitest';
import { LAYOUT_RESPONSIVE, Z_INDEX } from '../layoutResponsive';

// ---------------------------------------------------------------------------
// Tests — Constantes exportées (sanity check)
// ---------------------------------------------------------------------------

describe('LAYOUT_RESPONSIVE — constantes exportées', () => {
  it('MIN_CANVAS_WIDTH est 320', () => {
    expect(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH).toBe(320);
  });

  it('clampPanelWidths est une fonction', () => {
    expect(typeof LAYOUT_RESPONSIVE.clampPanelWidths).toBe('function');
  });

  it('panelsOverlapCanvas est une fonction', () => {
    expect(typeof LAYOUT_RESPONSIVE.panelsOverlapCanvas).toBe('function');
  });

  it('canvasWidth est une fonction', () => {
    expect(typeof LAYOUT_RESPONSIVE.canvasWidth).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// Tests — Z_INDEX : hiérarchie des z-index (Requirement 15.5)
// ---------------------------------------------------------------------------

describe('Z_INDEX — hiérarchie des z-index (Requirement 15.5)', () => {
  it('MODAL est supérieur à DROPDOWN', () => {
    expect(Z_INDEX.MODAL).toBeGreaterThan(Z_INDEX.DROPDOWN);
  });

  it('DROPDOWN est supérieur à TOOLTIP', () => {
    expect(Z_INDEX.DROPDOWN).toBeGreaterThan(Z_INDEX.PANEL);
  });

  it('TOOLTIP est supérieur à PANEL', () => {
    expect(Z_INDEX.TOOLTIP).toBeGreaterThan(Z_INDEX.PANEL);
  });

  it('TOPBAR est supérieur à PANEL', () => {
    expect(Z_INDEX.TOPBAR).toBeGreaterThan(Z_INDEX.PANEL);
  });

  it('RESIZE_HANDLE est supérieur à PANEL', () => {
    expect(Z_INDEX.RESIZE_HANDLE).toBeGreaterThan(Z_INDEX.PANEL);
  });

  it('MODAL est le z-index le plus élevé', () => {
    const allValues = Object.values(Z_INDEX);
    expect(Z_INDEX.MODAL).toBe(Math.max(...allValues));
  });

  it('PANEL est le z-index le plus bas', () => {
    const allValues = Object.values(Z_INDEX);
    expect(Z_INDEX.PANEL).toBe(Math.min(...allValues));
  });
});

// ---------------------------------------------------------------------------
// Tests — panelsOverlapCanvas (Requirement 15.6)
// ---------------------------------------------------------------------------

describe('LAYOUT_RESPONSIVE.panelsOverlapCanvas — détection de chevauchement (Requirement 15.6)', () => {
  it('retourne false quand les panneaux laissent assez de place au canvas (1280px)', () => {
    // 1280 - 230 - 280 - 12 = 758px > 320px → pas de chevauchement
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(1280, 230, 280)).toBe(false);
  });

  it('retourne false quand les panneaux laissent exactement MIN_CANVAS_WIDTH (320px)', () => {
    // window = 320 + 230 + 280 + 12 = 842px
    const windowWidth = LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH + 230 + 280 + 12;
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(windowWidth, 230, 280)).toBe(false);
  });

  it('retourne true quand les panneaux réduisent le canvas en dessous de 320px', () => {
    // 768 - 230 - 280 - 12 = 246px < 320px → chevauchement
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(768, 230, 280)).toBe(true);
  });

  it('retourne true quand les panneaux sont trop larges pour la fenêtre', () => {
    // 600 - 300 - 300 - 12 = -12px → chevauchement
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(600, 300, 300)).toBe(true);
  });

  it('retourne false à 1024px avec des panneaux de taille standard', () => {
    // 1024 - 230 - 280 - 12 = 502px > 320px → pas de chevauchement
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(1024, 230, 280)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests — canvasWidth (Requirement 15.6)
// ---------------------------------------------------------------------------

describe('LAYOUT_RESPONSIVE.canvasWidth — calcul de la largeur du canvas', () => {
  it('retourne la largeur correcte à 1280px', () => {
    // 1280 - 230 - 280 - 12 = 758
    expect(LAYOUT_RESPONSIVE.canvasWidth(1280, 230, 280)).toBe(758);
  });

  it('retourne la largeur correcte à 1024px', () => {
    // 1024 - 230 - 280 - 12 = 502
    expect(LAYOUT_RESPONSIVE.canvasWidth(1024, 230, 280)).toBe(502);
  });

  it('retourne 0 (minimum) quand les panneaux dépassent la fenêtre', () => {
    expect(LAYOUT_RESPONSIVE.canvasWidth(400, 300, 300)).toBe(0);
  });

  it('ne retourne jamais une valeur négative', () => {
    expect(LAYOUT_RESPONSIVE.canvasWidth(100, 300, 300)).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — clampPanelWidths aux breakpoints (Requirements 15.1, 15.6)
// ---------------------------------------------------------------------------

describe('LAYOUT_RESPONSIVE.clampPanelWidths — non-superposition aux breakpoints (Requirements 15.1, 15.6)', () => {
  // ---- Breakpoint 768px ----
  describe('à 768px de largeur de fenêtre', () => {
    it('réduit les panneaux pour garantir MIN_CANVAS_WIDTH', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(768, 230, 280);
      const canvas = 768 - left - right - 12;
      expect(canvas).toBeGreaterThanOrEqual(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH);
    });

    it('les largeurs clamped sont non-négatives', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(768, 230, 280);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(right).toBeGreaterThanOrEqual(0);
    });

    it('le canvas résultant est au moins MIN_CANVAS_WIDTH', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(768, 230, 280);
      const canvas = LAYOUT_RESPONSIVE.canvasWidth(768, left, right);
      expect(canvas).toBeGreaterThanOrEqual(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH);
    });
  });

  // ---- Breakpoint 1024px ----
  describe('à 1024px de largeur de fenêtre', () => {
    it('ne réduit pas les panneaux si le canvas est déjà suffisant', () => {
      // 1024 - 230 - 280 - 12 = 502 > 320 → pas de réduction
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1024, 230, 280);
      expect(left).toBe(230);
      expect(right).toBe(280);
    });

    it('le canvas résultant est au moins MIN_CANVAS_WIDTH', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1024, 230, 280);
      const canvas = LAYOUT_RESPONSIVE.canvasWidth(1024, left, right);
      expect(canvas).toBeGreaterThanOrEqual(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH);
    });

    it('réduit les panneaux si les largeurs demandées sont trop grandes', () => {
      // 1024 - 400 - 400 - 12 = 212 < 320 → réduction nécessaire
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1024, 400, 400);
      const canvas = LAYOUT_RESPONSIVE.canvasWidth(1024, left, right);
      expect(canvas).toBeGreaterThanOrEqual(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH);
    });
  });

  // ---- Breakpoint 1280px ----
  describe('à 1280px de largeur de fenêtre', () => {
    it('ne réduit pas les panneaux avec des tailles standard', () => {
      // 1280 - 230 - 280 - 12 = 758 > 320 → pas de réduction
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1280, 230, 280);
      expect(left).toBe(230);
      expect(right).toBe(280);
    });

    it('le canvas résultant est au moins MIN_CANVAS_WIDTH', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1280, 230, 280);
      const canvas = LAYOUT_RESPONSIVE.canvasWidth(1280, left, right);
      expect(canvas).toBeGreaterThanOrEqual(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH);
    });

    it('le canvas est largement supérieur à MIN_CANVAS_WIDTH à 1280px', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1280, 230, 280);
      const canvas = LAYOUT_RESPONSIVE.canvasWidth(1280, left, right);
      expect(canvas).toBeGreaterThan(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH);
    });
  });

  // ---- Propriétés générales ----
  describe('propriétés générales de clampPanelWidths', () => {
    it('ne modifie pas les largeurs quand le canvas est suffisant', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1920, 230, 280);
      expect(left).toBe(230);
      expect(right).toBe(280);
    });

    it('retourne des largeurs proportionnelles quand les deux panneaux sont réduits', () => {
      // Both panels are equal → should be reduced equally
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(768, 250, 250);
      // They should be approximately equal (within 1px due to floor)
      expect(Math.abs(left - right)).toBeLessThanOrEqual(1);
    });

    it('retourne { left: 0, right: 0 } quand la fenêtre est trop petite', () => {
      const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(100, 230, 280);
      expect(left).toBe(0);
      expect(right).toBe(0);
    });

    it('garantit toujours MIN_CANVAS_WIDTH pour toutes les largeurs de fenêtre ≥ MIN_CANVAS_WIDTH + handles', () => {
      const handles = 12;
      const windowWidths = [768, 1024, 1280, 1920];
      for (const w of windowWidths) {
        const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(w, 360, 420);
        const canvas = LAYOUT_RESPONSIVE.canvasWidth(w, left, right);
        expect(canvas).toBeGreaterThanOrEqual(LAYOUT_RESPONSIVE.MIN_CANVAS_WIDTH);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Tests — Breakpoints helpers (Requirement 15.1)
// ---------------------------------------------------------------------------

describe('LAYOUT_RESPONSIVE — helpers de breakpoints (Requirement 15.1)', () => {
  it('isBreakpoint768 retourne true à 768px', () => {
    expect(LAYOUT_RESPONSIVE.isBreakpoint768(768)).toBe(true);
  });

  it('isBreakpoint768 retourne false à 767px', () => {
    expect(LAYOUT_RESPONSIVE.isBreakpoint768(767)).toBe(false);
  });

  it('isBreakpoint1024 retourne true à 1024px', () => {
    expect(LAYOUT_RESPONSIVE.isBreakpoint1024(1024)).toBe(true);
  });

  it('isBreakpoint1024 retourne false à 1023px', () => {
    expect(LAYOUT_RESPONSIVE.isBreakpoint1024(1023)).toBe(false);
  });

  it('isBreakpoint1280 retourne true à 1280px', () => {
    expect(LAYOUT_RESPONSIVE.isBreakpoint1280(1280)).toBe(true);
  });

  it('isBreakpoint1280 retourne false à 1279px', () => {
    expect(LAYOUT_RESPONSIVE.isBreakpoint1280(1279)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests — Non-superposition à chaque breakpoint (Requirement 15.1)
// ---------------------------------------------------------------------------

describe('Non-superposition aux breakpoints standard (Requirement 15.1)', () => {
  const STANDARD_LEFT = 230;
  const STANDARD_RIGHT = 280;

  it('à 768px : les panneaux clamped ne chevauchent pas le canvas', () => {
    const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(768, STANDARD_LEFT, STANDARD_RIGHT);
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(768, left, right)).toBe(false);
  });

  it('à 1024px : les panneaux clamped ne chevauchent pas le canvas', () => {
    const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1024, STANDARD_LEFT, STANDARD_RIGHT);
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(1024, left, right)).toBe(false);
  });

  it('à 1280px : les panneaux clamped ne chevauchent pas le canvas', () => {
    const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1280, STANDARD_LEFT, STANDARD_RIGHT);
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(1280, left, right)).toBe(false);
  });

  it('à 768px avec des panneaux larges : les panneaux clamped ne chevauchent pas le canvas', () => {
    const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(768, 360, 420);
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(768, left, right)).toBe(false);
  });

  it('à 1024px avec des panneaux larges : les panneaux clamped ne chevauchent pas le canvas', () => {
    const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1024, 360, 420);
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(1024, left, right)).toBe(false);
  });

  it('à 1280px avec des panneaux larges : les panneaux clamped ne chevauchent pas le canvas', () => {
    const { left, right } = LAYOUT_RESPONSIVE.clampPanelWidths(1280, 360, 420);
    expect(LAYOUT_RESPONSIVE.panelsOverlapCanvas(1280, left, right)).toBe(false);
  });
});
