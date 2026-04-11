/**
 * Tests unitaires du DeviceCanvas — message d'état vide et badge PREVIEW
 *
 * Validates: Requirements 7.1, 7.3
 *
 * Tests:
 * - Message d'état vide en français (Requirement 7.1)
 * - Badge PREVIEW quand previewMode est actif (Requirement 7.3)
 *
 * Note: Tests are written as pure logic tests (no React rendering required)
 * following the same pattern as CodePanel.test.ts and DesignPanel.test.ts.
 * We test the CANVAS_TEXTS constants exported from DeviceCanvas.tsx directly.
 */

import { describe, it, expect } from 'vitest';
import { CANVAS_TEXTS } from '../canvasTexts';

// ---------------------------------------------------------------------------
// Tests — Message d'état vide (Requirement 7.1)
// ---------------------------------------------------------------------------

describe('DeviceCanvas — message état vide (Requirement 7.1)', () => {
  it('le message est correct', () => {
    expect(CANVAS_TEXTS.emptyState).toBe(
      'Aucun contenu — Ajoutez des composants depuis la bibliothèque.'
    );
  });

  it('le message mentionne "Aucun contenu"', () => {
    expect(CANVAS_TEXTS.emptyState).toContain('Aucun contenu');
  });

  it('le message mentionne "bibliothèque"', () => {
    expect(CANVAS_TEXTS.emptyState).toContain('bibliothèque');
  });

  it('le message mentionne "composants"', () => {
    expect(CANVAS_TEXTS.emptyState).toContain('composants');
  });

  it('le message est en français', () => {
    expect(CANVAS_TEXTS.emptyState).toContain('Ajoutez');
  });

  it('le message utilise le séparateur " — "', () => {
    expect(CANVAS_TEXTS.emptyState).toContain(' — ');
  });

  it('le message se termine par un point', () => {
    expect(CANVAS_TEXTS.emptyState.endsWith('.')).toBe(true);
  });

  it('le message est une chaîne non vide', () => {
    expect(CANVAS_TEXTS.emptyState.length).toBeGreaterThan(0);
  });

  it('le message ne contient pas "No content"', () => {
    expect(CANVAS_TEXTS.emptyState).not.toContain('No content');
  });
});

// ---------------------------------------------------------------------------
// Tests — Badge PREVIEW (Requirement 7.3)
// ---------------------------------------------------------------------------

describe('DeviceCanvas — badge PREVIEW (Requirement 7.3)', () => {
  it('le texte du badge est "PREVIEW"', () => {
    expect(CANVAS_TEXTS.previewBadge).toBe('PREVIEW');
  });

  it('le badge est en majuscules', () => {
    expect(CANVAS_TEXTS.previewBadge).toBe(CANVAS_TEXTS.previewBadge.toUpperCase());
  });

  it('le badge est une chaîne non vide', () => {
    expect(CANVAS_TEXTS.previewBadge.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — Structure de CANVAS_TEXTS
// ---------------------------------------------------------------------------

describe('DeviceCanvas — structure CANVAS_TEXTS', () => {
  it('CANVAS_TEXTS contient emptyState', () => {
    expect(CANVAS_TEXTS).toHaveProperty('emptyState');
  });

  it('CANVAS_TEXTS contient previewBadge', () => {
    expect(CANVAS_TEXTS).toHaveProperty('previewBadge');
  });

  it('toutes les valeurs sont des chaînes non vides', () => {
    for (const value of Object.values(CANVAS_TEXTS)) {
      expect(typeof value).toBe('string');
      expect(String(value).length).toBeGreaterThan(0);
    }
  });
});
