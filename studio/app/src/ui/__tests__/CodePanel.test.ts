/**
 * Tests unitaires du CodePanel — messages d'état vide, de chargement et bannière mode édition
 *
 * Validates: Requirements 6.1, 6.2, 6.4
 *
 * Tests:
 * - Message d'état vide en français (Requirement 6.1)
 * - Message de chargement en français (Requirement 6.2)
 * - Bannière mode édition en français (Requirement 6.4)
 * - Tooltips des boutons (Requirement 6.3, 6.5)
 *
 * Note: Tests are written as pure logic tests (no React rendering required)
 * following the same pattern as DesignPanel.test.ts and LogicPanel.test.ts.
 * We test the CODE_TEXTS constants exported from CodePanel.tsx directly.
 */

import { describe, it, expect } from 'vitest';
import { CODE_TEXTS } from '../codeTexts';

// ---------------------------------------------------------------------------
// Tests — Message d'état vide (Requirement 6.1)
// ---------------------------------------------------------------------------

describe('CodePanel — message état vide (Requirement 6.1)', () => {
  it('le message est correct', () => {
    expect(CODE_TEXTS.emptyState).toBe(
      "Sélectionnez un fichier dans l'explorateur pour visualiser son code généré."
    );
  });

  it('le message mentionne "explorateur"', () => {
    expect(CODE_TEXTS.emptyState).toContain("explorateur");
  });

  it('le message mentionne "code généré"', () => {
    expect(CODE_TEXTS.emptyState).toContain('code généré');
  });

  it('le message est en français', () => {
    expect(CODE_TEXTS.emptyState).toContain('Sélectionnez');
  });

  it('le message se termine par un point', () => {
    expect(CODE_TEXTS.emptyState.endsWith('.')).toBe(true);
  });

  it('le message est une chaîne non vide', () => {
    expect(CODE_TEXTS.emptyState.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — Message de chargement (Requirement 6.2)
// ---------------------------------------------------------------------------

describe('CodePanel — message de chargement (Requirement 6.2)', () => {
  it('le message est correct', () => {
    expect(CODE_TEXTS.loading).toBe('Génération des fichiers du projet en cours…');
  });

  it('le message mentionne "Génération"', () => {
    expect(CODE_TEXTS.loading).toContain('Génération');
  });

  it('le message mentionne "fichiers"', () => {
    expect(CODE_TEXTS.loading).toContain('fichiers');
  });

  it('le message mentionne "projet"', () => {
    expect(CODE_TEXTS.loading).toContain('projet');
  });

  it('le message est en français', () => {
    expect(CODE_TEXTS.loading).toContain('en cours');
  });

  it('le message se termine par "…"', () => {
    expect(CODE_TEXTS.loading.endsWith('…')).toBe(true);
  });

  it('le message est une chaîne non vide', () => {
    expect(CODE_TEXTS.loading.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — Bannière mode édition (Requirement 6.4)
// ---------------------------------------------------------------------------

describe('CodePanel — bannière mode édition (Requirement 6.4)', () => {
  it('la bannière est correcte', () => {
    expect(CODE_TEXTS.editBanner).toBe(
      'Mode édition — Les modifications seront synchronisées avec le projet.'
    );
  });

  it('la bannière mentionne "Mode édition"', () => {
    expect(CODE_TEXTS.editBanner).toContain('Mode édition');
  });

  it('la bannière mentionne "synchronisées"', () => {
    expect(CODE_TEXTS.editBanner).toContain('synchronisées');
  });

  it('la bannière mentionne "projet"', () => {
    expect(CODE_TEXTS.editBanner).toContain('projet');
  });

  it('la bannière est en français', () => {
    expect(CODE_TEXTS.editBanner).toContain('Les modifications');
  });

  it('la bannière utilise le séparateur " — "', () => {
    expect(CODE_TEXTS.editBanner).toContain(' — ');
  });

  it('la bannière se termine par un point', () => {
    expect(CODE_TEXTS.editBanner.endsWith('.')).toBe(true);
  });

  it('la bannière est une chaîne non vide', () => {
    expect(CODE_TEXTS.editBanner.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — Tooltips des boutons (Requirement 6.3, 6.5)
// ---------------------------------------------------------------------------

describe('CodePanel — tooltip bouton copie (Requirement 6.3)', () => {
  it('le tooltip est correct', () => {
    expect(CODE_TEXTS.tooltips.copy).toBe('Copier le contenu');
  });

  it('le tooltip mentionne "Copier"', () => {
    expect(CODE_TEXTS.tooltips.copy).toContain('Copier');
  });

  it('le tooltip est en français', () => {
    expect(CODE_TEXTS.tooltips.copy).toContain('contenu');
  });

  it('le tooltip est une chaîne non vide', () => {
    expect(CODE_TEXTS.tooltips.copy.length).toBeGreaterThan(0);
  });
});

describe('CodePanel — tooltip bouton édition (Requirement 6.3)', () => {
  it('le tooltip est correct', () => {
    expect(CODE_TEXTS.tooltips.edit).toBe('Modifier ce fichier');
  });

  it('le tooltip mentionne "Modifier"', () => {
    expect(CODE_TEXTS.tooltips.edit).toContain('Modifier');
  });

  it('le tooltip mentionne "fichier"', () => {
    expect(CODE_TEXTS.tooltips.edit).toContain('fichier');
  });

  it('le tooltip est une chaîne non vide', () => {
    expect(CODE_TEXTS.tooltips.edit.length).toBeGreaterThan(0);
  });
});

describe('CodePanel — tooltip bouton rechargement (Requirement 6.5)', () => {
  it('le tooltip est correct', () => {
    expect(CODE_TEXTS.tooltips.refresh).toBe('Rafraîchir les fichiers générés');
  });

  it('le tooltip mentionne "Rafraîchir"', () => {
    expect(CODE_TEXTS.tooltips.refresh).toContain('Rafraîchir');
  });

  it('le tooltip mentionne "fichiers générés"', () => {
    expect(CODE_TEXTS.tooltips.refresh).toContain('fichiers générés');
  });

  it('le tooltip est une chaîne non vide', () => {
    expect(CODE_TEXTS.tooltips.refresh.length).toBeGreaterThan(0);
  });
});

describe('CodePanel — tous les tooltips sont définis', () => {
  it('les 3 tooltips sont présents', () => {
    expect(Object.keys(CODE_TEXTS.tooltips).length).toBe(3);
  });

  it('tous les tooltips sont des chaînes non vides', () => {
    for (const t of Object.values(CODE_TEXTS.tooltips)) {
      expect(t.length).toBeGreaterThan(0);
    }
  });
});
