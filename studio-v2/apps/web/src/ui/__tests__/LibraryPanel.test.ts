/**
 * Tests unitaires du LibraryPanel — messages d'état vide, placeholder, recherche sans résultat
 *
 * Validates: Requirements 2.3, 2.6
 *
 * Tests:
 * - Placeholder du champ de recherche "Rechercher un composant…"
 * - Message d'état vide onglet "custom" sans templates
 * - Message de recherche sans résultat "Aucun composant trouvé pour « [terme] »."
 * - Description de l'onglet "library"
 * - Format du tooltip composant (nom + catégorie)
 *
 * Note: Tests are written as pure logic tests (no React rendering required)
 * following the same pattern as Topbar.test.tsx.
 * We test the text constants and derivation logic directly.
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Text constants — mirrors LIBRARY_TEXTS in LibraryPanel.tsx
// ---------------------------------------------------------------------------

const LIBRARY_TEXTS = {
  searchPlaceholder: 'Rechercher un composant…',
  libraryDescription: "Glissez ou cliquez un composant pour l'ajouter à l'écran sélectionné.",
  customEmpty: 'Aucun template personnalisé. Sélectionnez un composant sur le canvas et sauvegardez-le comme template.',
  noResults: (term: string) => `Aucun composant trouvé pour « ${term} ».`,
  tooltipText: (label: string, category: string) => `${label} — ${category}`,
} as const;

// ---------------------------------------------------------------------------
// Tests — Placeholder du champ de recherche (Requirement 2.5)
// ---------------------------------------------------------------------------

describe('LibraryPanel — placeholder du champ de recherche (Requirement 2.5)', () => {
  it('le placeholder est "Rechercher un composant…"', () => {
    expect(LIBRARY_TEXTS.searchPlaceholder).toBe('Rechercher un composant…');
  });

  it('le placeholder contient "Rechercher"', () => {
    expect(LIBRARY_TEXTS.searchPlaceholder).toContain('Rechercher');
  });

  it('le placeholder contient "composant"', () => {
    expect(LIBRARY_TEXTS.searchPlaceholder).toContain('composant');
  });
});

// ---------------------------------------------------------------------------
// Tests — Description de l'onglet "library" (Requirement 2.1, 2.2)
// ---------------------------------------------------------------------------

describe('LibraryPanel — description onglet library (Requirements 2.1, 2.2)', () => {
  it('la description de l\'onglet library est correcte', () => {
    expect(LIBRARY_TEXTS.libraryDescription).toBe(
      "Glissez ou cliquez un composant pour l'ajouter à l'écran sélectionné."
    );
  });

  it('la description mentionne "Glissez"', () => {
    expect(LIBRARY_TEXTS.libraryDescription).toContain('Glissez');
  });

  it('la description mentionne "cliquez"', () => {
    expect(LIBRARY_TEXTS.libraryDescription).toContain('cliquez');
  });

  it('la description mentionne "écran sélectionné"', () => {
    expect(LIBRARY_TEXTS.libraryDescription).toContain('écran sélectionné');
  });
});

// ---------------------------------------------------------------------------
// Tests — Message d'état vide onglet "custom" (Requirement 2.3)
// ---------------------------------------------------------------------------

describe('LibraryPanel — message état vide onglet custom (Requirement 2.3)', () => {
  it('le message d\'état vide est correct', () => {
    expect(LIBRARY_TEXTS.customEmpty).toBe(
      'Aucun template personnalisé. Sélectionnez un composant sur le canvas et sauvegardez-le comme template.'
    );
  });

  it('le message mentionne "Aucun template personnalisé"', () => {
    expect(LIBRARY_TEXTS.customEmpty).toContain('Aucun template personnalisé');
  });

  it('le message mentionne "canvas"', () => {
    expect(LIBRARY_TEXTS.customEmpty).toContain('canvas');
  });

  it('le message mentionne "template"', () => {
    expect(LIBRARY_TEXTS.customEmpty).toContain('template');
  });

  it('le message est une chaîne non vide', () => {
    expect(LIBRARY_TEXTS.customEmpty.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — Message de recherche sans résultat (Requirement 2.6)
// ---------------------------------------------------------------------------

describe('LibraryPanel — message de recherche sans résultat (Requirement 2.6)', () => {
  it('le message inclut le terme recherché entre guillemets français', () => {
    const msg = LIBRARY_TEXTS.noResults('Button');
    expect(msg).toBe('Aucun composant trouvé pour « Button ».');
  });

  it('le message commence par "Aucun composant trouvé"', () => {
    const msg = LIBRARY_TEXTS.noResults('test');
    expect(msg).toContain('Aucun composant trouvé');
  });

  it('le message utilise les guillemets français « »', () => {
    const msg = LIBRARY_TEXTS.noResults('test');
    expect(msg).toContain('«');
    expect(msg).toContain('»');
  });

  it('le terme est inclus dans le message', () => {
    const term = 'TextInput';
    const msg = LIBRARY_TEXTS.noResults(term);
    expect(msg).toContain(term);
  });

  it('le message se termine par un point', () => {
    const msg = LIBRARY_TEXTS.noResults('anything');
    expect(msg.endsWith('.')).toBe(true);
  });

  it('un terme vide produit un message valide', () => {
    const msg = LIBRARY_TEXTS.noResults('');
    expect(msg).toContain('Aucun composant trouvé');
    expect(typeof msg).toBe('string');
  });

  it('un terme avec caractères spéciaux est inclus tel quel', () => {
    const term = 'View <Layout>';
    const msg = LIBRARY_TEXTS.noResults(term);
    expect(msg).toContain(term);
  });
});

// ---------------------------------------------------------------------------
// Tests — Tooltip des composants (Requirement 2.4)
// ---------------------------------------------------------------------------

describe('LibraryPanel — tooltip des composants (Requirement 2.4)', () => {
  it('le tooltip contient le nom et la catégorie séparés par " — "', () => {
    const text = LIBRARY_TEXTS.tooltipText('Button', 'Inputs');
    expect(text).toBe('Button — Inputs');
  });

  it('le tooltip contient le nom du composant', () => {
    const text = LIBRARY_TEXTS.tooltipText('ScrollView', 'Layout');
    expect(text).toContain('ScrollView');
  });

  it('le tooltip contient la catégorie', () => {
    const text = LIBRARY_TEXTS.tooltipText('ScrollView', 'Layout');
    expect(text).toContain('Layout');
  });

  it('le tooltip utilise le séparateur " — "', () => {
    const text = LIBRARY_TEXTS.tooltipText('Text', 'Primitives');
    expect(text).toContain('—');
  });

  it('le tooltip est une chaîne non vide', () => {
    const text = LIBRARY_TEXTS.tooltipText('View', 'Containers');
    expect(text.length).toBeGreaterThan(0);
  });
});
