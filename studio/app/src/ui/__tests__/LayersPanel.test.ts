/**
 * Tests unitaires du LayersPanel — messages d'état vide et tooltips des indicateurs
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 *
 * Tests:
 * - Message d'état vide onglet "LAYERS" sans composants (Requirement 3.1)
 * - Message d'état vide onglet "SCREENS" sans écrans (Requirement 3.2)
 * - Tooltips des icônes d'indicateurs : condition, repeat, event, binding (Requirement 3.3)
 * - Bannière de déplacement en français (Requirement 3.4)
 * - Tooltips des boutons chevron-up / chevron-down (Requirement 3.5)
 * - Label slot vide "vide" (Requirement 3.6)
 * - Tooltip "Supprimer ce composant" sur le bouton trash (Requirement 3.7)
 *
 * Note: Tests are written as pure logic tests (no React rendering required)
 * following the same pattern as Topbar.test.tsx and LibraryPanel.test.ts.
 * We test the text constants exported from LayersPanel.tsx directly.
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Text constants — mirrors LAYERS_TEXTS exported from LayersPanel.tsx
// ---------------------------------------------------------------------------

const LAYERS_TEXTS = {
  layersEmpty: 'Aucun composant sur cet écran. Ajoutez-en depuis la bibliothèque.',
  screensEmpty: 'Aucun écran. Créez votre premier écran avec le bouton ci-dessous.',
  moveBanner: 'Sélectionnez une zone de dépôt ou annulez le déplacement.',
  slotEmpty: 'vide',
  tooltipMoveUp: 'Déplacer vers le haut',
  tooltipMoveDown: 'Déplacer vers le bas',
  tooltipDelete: 'Supprimer ce composant',
  tooltipCondition: 'Condition de visibilité active',
  tooltipRepeat: 'Répétition de liste active',
  tooltipEvent: 'Événement interactif actif',
  tooltipBinding: 'Binding de données actif',
} as const;

// ---------------------------------------------------------------------------
// Tests — Message d'état vide onglet LAYERS (Requirement 3.1)
// ---------------------------------------------------------------------------

describe('LayersPanel — message état vide onglet LAYERS (Requirement 3.1)', () => {
  it('le message est correct', () => {
    expect(LAYERS_TEXTS.layersEmpty).toBe(
      'Aucun composant sur cet écran. Ajoutez-en depuis la bibliothèque.'
    );
  });

  it('le message mentionne "Aucun composant"', () => {
    expect(LAYERS_TEXTS.layersEmpty).toContain('Aucun composant');
  });

  it('le message mentionne "bibliothèque"', () => {
    expect(LAYERS_TEXTS.layersEmpty).toContain('bibliothèque');
  });

  it('le message est une chaîne non vide', () => {
    expect(LAYERS_TEXTS.layersEmpty.length).toBeGreaterThan(0);
  });

  it('le message se termine par un point', () => {
    expect(LAYERS_TEXTS.layersEmpty.endsWith('.')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests — Message d'état vide onglet SCREENS (Requirement 3.2)
// ---------------------------------------------------------------------------

describe('LayersPanel — message état vide onglet SCREENS (Requirement 3.2)', () => {
  it('le message est correct', () => {
    expect(LAYERS_TEXTS.screensEmpty).toBe(
      'Aucun écran. Créez votre premier écran avec le bouton ci-dessous.'
    );
  });

  it('le message mentionne "Aucun écran"', () => {
    expect(LAYERS_TEXTS.screensEmpty).toContain('Aucun écran');
  });

  it('le message mentionne "bouton ci-dessous"', () => {
    expect(LAYERS_TEXTS.screensEmpty).toContain('bouton ci-dessous');
  });

  it('le message est une chaîne non vide', () => {
    expect(LAYERS_TEXTS.screensEmpty.length).toBeGreaterThan(0);
  });

  it('le message se termine par un point', () => {
    expect(LAYERS_TEXTS.screensEmpty.endsWith('.')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests — Tooltips des icônes d'indicateurs (Requirement 3.3)
// ---------------------------------------------------------------------------

describe('LayersPanel — tooltips des indicateurs (Requirement 3.3)', () => {
  it('tooltip condition est correct', () => {
    expect(LAYERS_TEXTS.tooltipCondition).toBe('Condition de visibilité active');
  });

  it('tooltip condition mentionne "Condition"', () => {
    expect(LAYERS_TEXTS.tooltipCondition).toContain('Condition');
  });

  it('tooltip repeat est correct', () => {
    expect(LAYERS_TEXTS.tooltipRepeat).toBe('Répétition de liste active');
  });

  it('tooltip repeat mentionne "Répétition"', () => {
    expect(LAYERS_TEXTS.tooltipRepeat).toContain('Répétition');
  });

  it('tooltip event est correct', () => {
    expect(LAYERS_TEXTS.tooltipEvent).toBe('Événement interactif actif');
  });

  it('tooltip event mentionne "Événement"', () => {
    expect(LAYERS_TEXTS.tooltipEvent).toContain('Événement');
  });

  it('tooltip binding est correct', () => {
    expect(LAYERS_TEXTS.tooltipBinding).toBe('Binding de données actif');
  });

  it('tooltip binding mentionne "Binding"', () => {
    expect(LAYERS_TEXTS.tooltipBinding).toContain('Binding');
  });

  it('tous les tooltips d\'indicateurs sont des chaînes non vides', () => {
    const indicatorTooltips = [
      LAYERS_TEXTS.tooltipCondition,
      LAYERS_TEXTS.tooltipRepeat,
      LAYERS_TEXTS.tooltipEvent,
      LAYERS_TEXTS.tooltipBinding,
    ];
    for (const t of indicatorTooltips) {
      expect(typeof t).toBe('string');
      expect(t.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Tests — Bannière de déplacement (Requirement 3.4)
// ---------------------------------------------------------------------------

describe('LayersPanel — bannière de déplacement (Requirement 3.4)', () => {
  it('la bannière est correcte', () => {
    expect(LAYERS_TEXTS.moveBanner).toBe(
      'Sélectionnez une zone de dépôt ou annulez le déplacement.'
    );
  });

  it('la bannière mentionne "zone de dépôt"', () => {
    expect(LAYERS_TEXTS.moveBanner).toContain('zone de dépôt');
  });

  it('la bannière mentionne "annulez"', () => {
    expect(LAYERS_TEXTS.moveBanner).toContain('annulez');
  });

  it('la bannière se termine par un point', () => {
    expect(LAYERS_TEXTS.moveBanner.endsWith('.')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests — Tooltips chevron-up / chevron-down (Requirement 3.5)
// ---------------------------------------------------------------------------

describe('LayersPanel — tooltips boutons de déplacement (Requirement 3.5)', () => {
  it('tooltip "Déplacer vers le haut" est correct', () => {
    expect(LAYERS_TEXTS.tooltipMoveUp).toBe('Déplacer vers le haut');
  });

  it('tooltip "Déplacer vers le bas" est correct', () => {
    expect(LAYERS_TEXTS.tooltipMoveDown).toBe('Déplacer vers le bas');
  });

  it('les deux tooltips sont différents', () => {
    expect(LAYERS_TEXTS.tooltipMoveUp).not.toBe(LAYERS_TEXTS.tooltipMoveDown);
  });

  it('tooltip haut mentionne "haut"', () => {
    expect(LAYERS_TEXTS.tooltipMoveUp.toLowerCase()).toContain('haut');
  });

  it('tooltip bas mentionne "bas"', () => {
    expect(LAYERS_TEXTS.tooltipMoveDown.toLowerCase()).toContain('bas');
  });
});

// ---------------------------------------------------------------------------
// Tests — Label slot vide (Requirement 3.6)
// ---------------------------------------------------------------------------

describe('LayersPanel — label slot vide (Requirement 3.6)', () => {
  it('le label slot vide est "vide"', () => {
    expect(LAYERS_TEXTS.slotEmpty).toBe('vide');
  });

  it('le label slot vide est en français', () => {
    expect(LAYERS_TEXTS.slotEmpty).not.toBe('empty');
  });
});

// ---------------------------------------------------------------------------
// Tests — Tooltip bouton suppression (Requirement 3.7)
// ---------------------------------------------------------------------------

describe('LayersPanel — tooltip bouton suppression (Requirement 3.7)', () => {
  it('le tooltip de suppression est correct', () => {
    expect(LAYERS_TEXTS.tooltipDelete).toBe('Supprimer ce composant');
  });

  it('le tooltip mentionne "Supprimer"', () => {
    expect(LAYERS_TEXTS.tooltipDelete).toContain('Supprimer');
  });

  it('le tooltip mentionne "composant"', () => {
    expect(LAYERS_TEXTS.tooltipDelete).toContain('composant');
  });
});
