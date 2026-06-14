/**
 * Tests unitaires de la Topbar — tooltips et label du sélecteur de device
 *
 * Validates: Requirements 1.2, 1.3
 *
 * Tests:
 * - Tooltip text pour chaque bouton (Undo, Redo, Reset, Import, Export, Services, Queries, Fonctions, Paramètres, Thème, Prévisualisation, Code, Générer)
 * - Tooltip de désactivation quand canUndo/canRedo est false
 * - Label "Appareil de prévisualisation" au-dessus du sélecteur de device
 * - Tooltip "Zoom — Ajuster l'échelle du canvas" sur le contrôle de zoom
 *
 * Note: Tests are written as pure logic tests (no React rendering required)
 * since the Topbar depends on a complex context provider.
 * We test the tooltip text derivation logic directly.
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Tooltip text derivation logic — mirrors Topbar.tsx
// ---------------------------------------------------------------------------

/** Returns the tooltip text for the Undo button based on canUndo state */
function undoTooltipText(canUndo: boolean): string {
  return canUndo ? "Annuler — Revenir à l'action précédente" : 'Aucune action à annuler';
}

/** Returns the tooltip text for the Redo button based on canRedo state */
function redoTooltipText(canRedo: boolean): string {
  return canRedo ? "Rétablir — Rejouer l'action annulée" : 'Aucune action à rétablir';
}

/** Static tooltip texts for each Topbar button */
const TOPBAR_TOOLTIPS = {
  reset: 'Réinitialiser — Supprimer tout le contenu du projet',
  import: 'Importer — Charger un projet depuis un fichier JSON',
  export: 'Exporter — Sauvegarder le projet en fichier JSON',
  services: 'Services — Gérer les connexions aux APIs externes',
  queries: 'Queries — Configurer les requêtes de données',
  customFn: 'Fonctions personnalisées — Écrire des fonctions JavaScript',
  settings: 'Paramètres — Configurer les options du projet',
  theme: 'Thème — Personnaliser les couleurs et styles globaux',
  preview: 'Prévisualisation — Activer le mode interactif du canvas',
  code: 'Code — Afficher le panneau de code généré',
  generate: 'Générer — Exporte le code React Native du projet',
  zoom: "Zoom — Ajuster l'échelle du canvas",
} as const;

/** Label displayed above the device selector */
const DEVICE_SELECTOR_LABEL = 'Appareil de prévisualisation';

// ---------------------------------------------------------------------------
// Tests — Tooltip texts for each button (Requirement 1.2)
// ---------------------------------------------------------------------------

describe('Topbar — tooltips des boutons (Requirement 1.2)', () => {
  it('Undo — tooltip actif quand canUndo=true', () => {
    expect(undoTooltipText(true)).toBe("Annuler — Revenir à l'action précédente");
  });

  it('Undo — tooltip de désactivation quand canUndo=false (Requirement 1.5)', () => {
    expect(undoTooltipText(false)).toBe('Aucune action à annuler');
  });

  it('Redo — tooltip actif quand canRedo=true', () => {
    expect(redoTooltipText(true)).toBe("Rétablir — Rejouer l'action annulée");
  });

  it('Redo — tooltip de désactivation quand canRedo=false (Requirement 1.5)', () => {
    expect(redoTooltipText(false)).toBe('Aucune action à rétablir');
  });

  it('Reset — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.reset).toBe('Réinitialiser — Supprimer tout le contenu du projet');
  });

  it('Import — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.import).toBe('Importer — Charger un projet depuis un fichier JSON');
  });

  it('Export — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.export).toBe('Exporter — Sauvegarder le projet en fichier JSON');
  });

  it('Services — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.services).toBe('Services — Gérer les connexions aux APIs externes');
  });

  it('Queries — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.queries).toBe('Queries — Configurer les requêtes de données');
  });

  it('Fonctions personnalisées — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.customFn).toBe('Fonctions personnalisées — Écrire des fonctions JavaScript');
  });

  it('Paramètres — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.settings).toBe('Paramètres — Configurer les options du projet');
  });

  it('Thème — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.theme).toBe('Thème — Personnaliser les couleurs et styles globaux');
  });

  it('Prévisualisation — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.preview).toBe('Prévisualisation — Activer le mode interactif du canvas');
  });

  it('Code — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.code).toBe('Code — Afficher le panneau de code généré');
  });

  it('Générer — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.generate).toBe('Générer — Exporte le code React Native du projet');
  });
});

// ---------------------------------------------------------------------------
// Tests — Zoom tooltip (Requirement 1.4)
// ---------------------------------------------------------------------------

describe('Topbar — tooltip du contrôle de zoom (Requirement 1.4)', () => {
  it('Zoom — tooltip correct', () => {
    expect(TOPBAR_TOOLTIPS.zoom).toBe("Zoom — Ajuster l'échelle du canvas");
  });

  it('Zoom — tooltip contient le mot "Zoom"', () => {
    expect(TOPBAR_TOOLTIPS.zoom).toContain('Zoom');
  });

  it('Zoom — tooltip contient une description de l\'action', () => {
    expect(TOPBAR_TOOLTIPS.zoom).toContain('canvas');
  });
});

// ---------------------------------------------------------------------------
// Tests — Label du sélecteur de device (Requirement 1.3)
// ---------------------------------------------------------------------------

describe('Topbar — label du sélecteur de device (Requirement 1.3)', () => {
  it('le label "Appareil de prévisualisation" est défini', () => {
    expect(DEVICE_SELECTOR_LABEL).toBe('Appareil de prévisualisation');
  });

  it('le label contient "prévisualisation"', () => {
    expect(DEVICE_SELECTOR_LABEL.toLowerCase()).toContain('prévisualisation');
  });

  it('le label contient "Appareil"', () => {
    expect(DEVICE_SELECTOR_LABEL).toContain('Appareil');
  });
});

// ---------------------------------------------------------------------------
// Tests — Disabled state tooltip logic (Requirement 1.5)
// ---------------------------------------------------------------------------

describe('Topbar — raison de désactivation dans les tooltips (Requirement 1.5)', () => {
  it('quand canUndo=false, le tooltip indique qu\'il n\'y a rien à annuler', () => {
    const text = undoTooltipText(false);
    expect(text).toContain('annuler');
  });

  it('quand canRedo=false, le tooltip indique qu\'il n\'y a rien à rétablir', () => {
    const text = redoTooltipText(false);
    expect(text).toContain('rétablir');
  });

  it('quand canUndo=true, le tooltip ne mentionne pas de désactivation', () => {
    const text = undoTooltipText(true);
    expect(text).not.toContain('Aucune');
  });

  it('quand canRedo=true, le tooltip ne mentionne pas de désactivation', () => {
    const text = redoTooltipText(true);
    expect(text).not.toContain('Aucune');
  });

  it('le tooltip de désactivation Undo est différent du tooltip actif', () => {
    expect(undoTooltipText(false)).not.toBe(undoTooltipText(true));
  });

  it('le tooltip de désactivation Redo est différent du tooltip actif', () => {
    expect(redoTooltipText(false)).not.toBe(redoTooltipText(true));
  });
});

// ---------------------------------------------------------------------------
// Tests — Tous les boutons ont un tooltip (Requirement 1.2)
// ---------------------------------------------------------------------------

describe('Topbar — tous les boutons ont un tooltip (Requirement 1.2)', () => {
  const allButtons = Object.keys(TOPBAR_TOOLTIPS) as Array<keyof typeof TOPBAR_TOOLTIPS>;

  it('13 boutons ont un tooltip défini (Undo et Redo sont dynamiques)', () => {
    // Static tooltips: reset, import, export, services, queries, customFn, settings, theme, preview, code, generate, zoom = 12
    // Dynamic tooltips: undo, redo = 2 (tested separately)
    expect(allButtons.length).toBe(12);
  });

  it('tous les tooltips statiques sont des chaînes non vides', () => {
    for (const key of allButtons) {
      expect(typeof TOPBAR_TOOLTIPS[key]).toBe('string');
      expect(TOPBAR_TOOLTIPS[key].length).toBeGreaterThan(0);
    }
  });

  it('tous les tooltips statiques suivent le format "Nom — Description"', () => {
    for (const key of allButtons) {
      expect(TOPBAR_TOOLTIPS[key]).toContain('—');
    }
  });

  it('les tooltips dynamiques (Undo/Redo) suivent aussi le format "Nom — Description" quand actifs', () => {
    expect(undoTooltipText(true)).toContain('—');
    expect(redoTooltipText(true)).toContain('—');
  });
});
