/**
 * Tests unitaires du LogicPanel — messages d'état vide, bannière inRepeat et descriptions de section
 *
 * Validates: Requirements 5.2, 5.3, 5.7
 *
 * Tests:
 * - Message d'état vide en français (Requirement 5.2)
 * - Message aucun déclencheur (Requirement 5.3)
 * - Bannière inRepeat en français (Requirement 5.7)
 * - Descriptions courtes de chaque section (Requirement 5.1)
 * - Placeholder de binding selon le contexte (Requirement 5.4)
 * - Description Page variables (Requirement 5.5)
 * - Tooltips des types d'action (Requirement 5.6)
 *
 * Note: Tests are written as pure logic tests (no React rendering required)
 * following the same pattern as DesignPanel.test.ts.
 * We test the LOGIC_TEXTS constants exported from logicTexts.ts directly.
 */

import { describe, it, expect } from 'vitest';
import { LOGIC_TEXTS } from '../logic/logicTexts';

// ---------------------------------------------------------------------------
// Tests — Message d'état vide (Requirement 5.2)
// ---------------------------------------------------------------------------

describe('LogicPanel — message état vide (Requirement 5.2)', () => {
  it('le message est correct', () => {
    expect(LOGIC_TEXTS.emptyState).toBe(
      'Sélectionnez un composant sur le canvas pour configurer sa logique.'
    );
  });

  it('le message mentionne "canvas"', () => {
    expect(LOGIC_TEXTS.emptyState).toContain('canvas');
  });

  it('le message mentionne "logique"', () => {
    expect(LOGIC_TEXTS.emptyState).toContain('logique');
  });

  it('le message est en français', () => {
    expect(LOGIC_TEXTS.emptyState).toContain('Sélectionnez');
  });

  it('le message se termine par un point', () => {
    expect(LOGIC_TEXTS.emptyState.endsWith('.')).toBe(true);
  });

  it('le message est une chaîne non vide', () => {
    expect(LOGIC_TEXTS.emptyState.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — Message aucun déclencheur (Requirement 5.3)
// ---------------------------------------------------------------------------

describe('LogicPanel — message aucun déclencheur (Requirement 5.3)', () => {
  it('le message est correct', () => {
    expect(LOGIC_TEXTS.noTriggers).toBe(
      'Aucun déclencheur configuré. Ajoutez-en un pour rendre ce composant interactif.'
    );
  });

  it('le message mentionne "déclencheur"', () => {
    expect(LOGIC_TEXTS.noTriggers).toContain('déclencheur');
  });

  it('le message mentionne "interactif"', () => {
    expect(LOGIC_TEXTS.noTriggers).toContain('interactif');
  });

  it('le message est en français', () => {
    expect(LOGIC_TEXTS.noTriggers).toContain('Aucun');
  });

  it('le message se termine par un point', () => {
    expect(LOGIC_TEXTS.noTriggers.endsWith('.')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests — Bannière inRepeat (Requirement 5.7)
// ---------------------------------------------------------------------------

describe('LogicPanel — bannière inRepeat (Requirement 5.7)', () => {
  it('la bannière est correcte', () => {
    expect(LOGIC_TEXTS.inRepeatBanner).toBe(
      "Ce composant est dans une liste — les champs de l'élément courant sont disponibles."
    );
  });

  it('la bannière mentionne "liste"', () => {
    expect(LOGIC_TEXTS.inRepeatBanner).toContain('liste');
  });

  it('la bannière mentionne "champs"', () => {
    expect(LOGIC_TEXTS.inRepeatBanner).toContain('champs');
  });

  it('la bannière mentionne "disponibles"', () => {
    expect(LOGIC_TEXTS.inRepeatBanner).toContain('disponibles');
  });

  it('la bannière est en français', () => {
    expect(LOGIC_TEXTS.inRepeatBanner).toContain('Ce composant');
  });

  it('la bannière se termine par un point', () => {
    expect(LOGIC_TEXTS.inRepeatBanner.endsWith('.')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Tests — Placeholder de binding (Requirement 5.4)
// ---------------------------------------------------------------------------

describe('LogicPanel — placeholder de binding (Requirement 5.4)', () => {
  it('le placeholder inRepeat contient "item.champ"', () => {
    expect(LOGIC_TEXTS.bindingPlaceholderInRepeat).toContain('item.champ');
  });

  it('le placeholder inRepeat contient "$state.variable"', () => {
    expect(LOGIC_TEXTS.bindingPlaceholderInRepeat).toContain('$state.variable');
  });

  it('le placeholder par défaut contient "$state"', () => {
    expect(LOGIC_TEXTS.bindingPlaceholderDefault).toContain('$state');
  });

  it('les deux placeholders sont différents', () => {
    expect(LOGIC_TEXTS.bindingPlaceholderInRepeat).not.toBe(LOGIC_TEXTS.bindingPlaceholderDefault);
  });
});

// ---------------------------------------------------------------------------
// Tests — Descriptions de section (Requirement 5.1)
// ---------------------------------------------------------------------------

describe('LogicPanel — description section What happens (Requirement 5.1)', () => {
  it('la description mentionne "interagit"', () => {
    expect(LOGIC_TEXTS.sections.whatHappens).toContain('interagit');
  });

  it('la description se termine par ")"', () => {
    expect(LOGIC_TEXTS.sections.whatHappens.endsWith(')')).toBe(true);
  });

  it('la description est non vide', () => {
    expect(LOGIC_TEXTS.sections.whatHappens.length).toBeGreaterThan(0);
  });
});

describe('LogicPanel — description section What it shows (Requirement 5.1)', () => {
  it('la description mentionne "propriétés"', () => {
    expect(LOGIC_TEXTS.sections.whatItShows).toContain('propriétés');
  });

  it('la description mentionne "variables"', () => {
    expect(LOGIC_TEXTS.sections.whatItShows).toContain('variables');
  });

  it('la description se termine par un point', () => {
    expect(LOGIC_TEXTS.sections.whatItShows.endsWith('.')).toBe(true);
  });
});

describe('LogicPanel — description section When it shows (Requirement 5.1)', () => {
  it('la description mentionne "condition"', () => {
    expect(LOGIC_TEXTS.sections.whenItShows).toContain('condition');
  });

  it('la description se termine par un point', () => {
    expect(LOGIC_TEXTS.sections.whenItShows.endsWith('.')).toBe(true);
  });
});

describe('LogicPanel — description section List mode (Requirement 5.1)', () => {
  it('la description mentionne "liste"', () => {
    expect(LOGIC_TEXTS.sections.listMode).toContain('liste');
  });

  it('la description se termine par un point', () => {
    expect(LOGIC_TEXTS.sections.listMode.endsWith('.')).toBe(true);
  });
});

describe('LogicPanel — description section Page variables (Requirement 5.1 & 5.5)', () => {
  it('la description est correcte', () => {
    expect(LOGIC_TEXTS.sections.pageVariables).toBe(
      "Les variables stockent des données sur cette page : saisie utilisateur, réponses API, état de l'interface."
    );
  });

  it('la description mentionne "variables"', () => {
    expect(LOGIC_TEXTS.sections.pageVariables).toContain('variables');
  });

  it('la description mentionne "saisie utilisateur"', () => {
    expect(LOGIC_TEXTS.sections.pageVariables).toContain('saisie utilisateur');
  });

  it('la description mentionne "réponses API"', () => {
    expect(LOGIC_TEXTS.sections.pageVariables).toContain('réponses API');
  });

  it('la description se termine par un point', () => {
    expect(LOGIC_TEXTS.sections.pageVariables.endsWith('.')).toBe(true);
  });
});

describe('LogicPanel — description section Animation (Requirement 5.1)', () => {
  it('la description mentionne "animation"', () => {
    expect(LOGIC_TEXTS.sections.animation).toContain('animation');
  });

  it('la description se termine par un point', () => {
    expect(LOGIC_TEXTS.sections.animation.endsWith('.')).toBe(true);
  });
});

describe('LogicPanel — toutes les sections ont une description (Requirement 5.1)', () => {
  const sectionKeys = ['whatHappens', 'whatItShows', 'whenItShows', 'listMode', 'pageVariables', 'animation'] as const;

  it('toutes les 6 sections ont une description', () => {
    expect(Object.keys(LOGIC_TEXTS.sections).length).toBe(6);
  });

  for (const key of sectionKeys) {
    it(`la section "${key}" a une description non vide`, () => {
      expect(LOGIC_TEXTS.sections[key].length).toBeGreaterThan(0);
    });
  }
});

// ---------------------------------------------------------------------------
// Tests — Tooltips des types d'action (Requirement 5.6)
// ---------------------------------------------------------------------------

describe('LogicPanel — tooltips types d\'action (Requirement 5.6)', () => {
  it('tooltip setState contient "Set State"', () => {
    expect(LOGIC_TEXTS.actionTooltips.setState).toContain('Set State');
  });

  it('tooltip setState contient une description', () => {
    expect(LOGIC_TEXTS.actionTooltips.setState).toContain('variable');
  });

  it('tooltip navigate contient "Navigate"', () => {
    expect(LOGIC_TEXTS.actionTooltips.navigate).toContain('Navigate');
  });

  it('tooltip navigate contient une description', () => {
    expect(LOGIC_TEXTS.actionTooltips.navigate).toContain('écran');
  });

  it('tooltip callApi contient "Call API"', () => {
    expect(LOGIC_TEXTS.actionTooltips.callApi).toContain('Call API');
  });

  it('tooltip callCustomFn contient "Custom Function"', () => {
    expect(LOGIC_TEXTS.actionTooltips.callCustomFn).toContain('Custom Function');
  });

  it('tooltip openModal contient "Open Modal"', () => {
    expect(LOGIC_TEXTS.actionTooltips.openModal).toContain('Open Modal');
  });

  it('tooltip closeModal contient "Close Modal"', () => {
    expect(LOGIC_TEXTS.actionTooltips.closeModal).toContain('Close Modal');
  });

  it('tooltip alert contient "Alert"', () => {
    expect(LOGIC_TEXTS.actionTooltips.alert).toContain('Alert');
  });

  it('tooltip toast contient "Toast"', () => {
    expect(LOGIC_TEXTS.actionTooltips.toast).toContain('Toast');
  });

  it('tous les tooltips d\'action utilisent le séparateur " — "', () => {
    const tooltips = Object.values(LOGIC_TEXTS.actionTooltips);
    for (const t of tooltips) {
      expect(t).toContain(' — ');
    }
  });

  it('tous les 18 types d\'action ont un tooltip', () => {
    expect(Object.keys(LOGIC_TEXTS.actionTooltips).length).toBe(18);
  });
});
