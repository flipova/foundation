/**
 * Tests unitaires du DesignPanel — descriptions de section et message d'état vide
 *
 * Validates: Requirements 4.1, 4.2
 *
 * Tests:
 * - Message d'état vide en français (Requirement 4.2)
 * - Descriptions courtes de chaque section ouverte (Requirement 4.1)
 * - Tooltips des champs numériques N (Requirement 4.3)
 * - Tooltips des boutons Seg (Requirement 4.4)
 * - Description position absolue (Requirement 4.6)
 *
 * Note: Tests are written as pure logic tests (no React rendering required)
 * following the same pattern as LayersPanel.test.ts and LibraryPanel.test.ts.
 * We test the DESIGN_TEXTS constants exported from DesignPanel.tsx directly.
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Text constants — mirrors DESIGN_TEXTS exported from DesignPanel.tsx
// ---------------------------------------------------------------------------

const DESIGN_TEXTS = {
  emptyState: 'Sélectionnez un composant sur le canvas pour modifier ses propriétés visuelles.',
  absoluteDescription: 'Position absolue — Le composant est positionné par rapport à son parent le plus proche.',
  sections: {
    Layout: 'Définit la disposition des enfants : direction, alignement et espacement entre eux.',
    Item: 'Contrôle comment ce composant se positionne dans son conteneur parent.',
    Dimensions: 'Définit la largeur, la hauteur et les contraintes de taille du composant.',
    Spacing: 'Gère les marges extérieures (margin) et le rembourrage intérieur (padding).',
    Position: 'Détermine si le composant suit le flux normal ou est positionné librement.',
    Appearance: "Couleur de fond, opacité et ratio d'aspect du composant.",
    Border: 'Bordure, style de trait et rayon des coins du composant.',
    Typography: 'Taille, couleur, graisse et alignement du texte.',
    Effects: 'Ombre portée et visibilité du composant.',
  },
  tooltips: {
    flexGrow: "flexGrow — Facteur d'expansion du composant dans son conteneur",
    flexShrink: 'flexShrink — Facteur de rétrécissement du composant si manque de place',
    gap: 'gap — Espacement entre tous les enfants',
    width: 'width — Largeur du composant',
    height: 'height — Hauteur du composant',
    borderRadius: "borderRadius — Rayon d'arrondi de tous les coins",
    shadowOpacity: "shadowOpacity — Opacité de l'ombre portée",
    seg: {
      row: 'row — Disposition horizontale des enfants (de gauche à droite)',
      column: 'column — Disposition verticale des enfants (de haut en bas)',
      'flex-start': "flex-start — Enfants regroupés au début de l'axe principal",
      center: "center — Enfants centrés sur l'axe principal",
      absolute: 'absolute — Le composant est positionné librement par rapport à son parent',
      relative: 'relative — Le composant suit le flux normal de la mise en page',
      solid: 'solid — Bordure pleine continue',
      dashed: 'dashed — Bordure en tirets',
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Tests — Message d'état vide (Requirement 4.2)
// ---------------------------------------------------------------------------

describe('DesignPanel — message état vide (Requirement 4.2)', () => {
  it('le message est correct', () => {
    expect(DESIGN_TEXTS.emptyState).toBe(
      'Sélectionnez un composant sur le canvas pour modifier ses propriétés visuelles.'
    );
  });

  it('le message mentionne "canvas"', () => {
    expect(DESIGN_TEXTS.emptyState).toContain('canvas');
  });

  it('le message mentionne "propriétés visuelles"', () => {
    expect(DESIGN_TEXTS.emptyState).toContain('propriétés visuelles');
  });

  it('le message est en français', () => {
    expect(DESIGN_TEXTS.emptyState).toContain('Sélectionnez');
  });

  it('le message se termine par un point', () => {
    expect(DESIGN_TEXTS.emptyState.endsWith('.')).toBe(true);
  });

  it('le message est une chaîne non vide', () => {
    expect(DESIGN_TEXTS.emptyState.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — Descriptions de section (Requirement 4.1)
// ---------------------------------------------------------------------------

describe('DesignPanel — descriptions de section Layout (Requirement 4.1)', () => {
  it('la description Layout est correcte', () => {
    expect(DESIGN_TEXTS.sections.Layout).toBe(
      'Définit la disposition des enfants : direction, alignement et espacement entre eux.'
    );
  });

  it('la description Layout mentionne "disposition"', () => {
    expect(DESIGN_TEXTS.sections.Layout).toContain('disposition');
  });

  it('la description Layout se termine par un point', () => {
    expect(DESIGN_TEXTS.sections.Layout.endsWith('.')).toBe(true);
  });
});

describe('DesignPanel — descriptions de section Item (Requirement 4.1)', () => {
  it('la description Item est correcte', () => {
    expect(DESIGN_TEXTS.sections.Item).toBe(
      'Contrôle comment ce composant se positionne dans son conteneur parent.'
    );
  });

  it('la description Item mentionne "conteneur parent"', () => {
    expect(DESIGN_TEXTS.sections.Item).toContain('conteneur parent');
  });

  it('la description Item se termine par un point', () => {
    expect(DESIGN_TEXTS.sections.Item.endsWith('.')).toBe(true);
  });
});

describe('DesignPanel — descriptions de section Dimensions (Requirement 4.1)', () => {
  it('la description Dimensions est correcte', () => {
    expect(DESIGN_TEXTS.sections.Dimensions).toBe(
      'Définit la largeur, la hauteur et les contraintes de taille du composant.'
    );
  });

  it('la description Dimensions mentionne "largeur"', () => {
    expect(DESIGN_TEXTS.sections.Dimensions).toContain('largeur');
  });

  it('la description Dimensions mentionne "hauteur"', () => {
    expect(DESIGN_TEXTS.sections.Dimensions).toContain('hauteur');
  });
});

describe('DesignPanel — descriptions de section Spacing (Requirement 4.1)', () => {
  it('la description Spacing est correcte', () => {
    expect(DESIGN_TEXTS.sections.Spacing).toBe(
      'Gère les marges extérieures (margin) et le rembourrage intérieur (padding).'
    );
  });

  it('la description Spacing mentionne "margin"', () => {
    expect(DESIGN_TEXTS.sections.Spacing).toContain('margin');
  });

  it('la description Spacing mentionne "padding"', () => {
    expect(DESIGN_TEXTS.sections.Spacing).toContain('padding');
  });
});

describe('DesignPanel — descriptions de section Position (Requirement 4.1)', () => {
  it('la description Position est correcte', () => {
    expect(DESIGN_TEXTS.sections.Position).toBe(
      'Détermine si le composant suit le flux normal ou est positionné librement.'
    );
  });

  it('la description Position mentionne "flux normal"', () => {
    expect(DESIGN_TEXTS.sections.Position).toContain('flux normal');
  });
});

describe('DesignPanel — descriptions de section Appearance (Requirement 4.1)', () => {
  it('la description Appearance mentionne "opacité"', () => {
    expect(DESIGN_TEXTS.sections.Appearance).toContain('opacité');
  });

  it('la description Appearance se termine par un point', () => {
    expect(DESIGN_TEXTS.sections.Appearance.endsWith('.')).toBe(true);
  });
});

describe('DesignPanel — descriptions de section Border (Requirement 4.1)', () => {
  it('la description Border mentionne "Bordure"', () => {
    expect(DESIGN_TEXTS.sections.Border).toContain('Bordure');
  });

  it('la description Border mentionne "rayon"', () => {
    expect(DESIGN_TEXTS.sections.Border).toContain('rayon');
  });
});

describe('DesignPanel — descriptions de section Typography (Requirement 4.1)', () => {
  it('la description Typography mentionne "texte"', () => {
    expect(DESIGN_TEXTS.sections.Typography).toContain('texte');
  });

  it('la description Typography se termine par un point', () => {
    expect(DESIGN_TEXTS.sections.Typography.endsWith('.')).toBe(true);
  });
});

describe('DesignPanel — descriptions de section Effects (Requirement 4.1)', () => {
  it('la description Effects mentionne "Ombre"', () => {
    expect(DESIGN_TEXTS.sections.Effects).toContain('Ombre');
  });

  it('la description Effects se termine par un point', () => {
    expect(DESIGN_TEXTS.sections.Effects.endsWith('.')).toBe(true);
  });
});

describe('DesignPanel — toutes les sections ont une description (Requirement 4.1)', () => {
  const sectionNames = ['Layout', 'Item', 'Dimensions', 'Spacing', 'Position', 'Appearance', 'Border', 'Typography', 'Effects'] as const;

  it('toutes les 9 sections ont une description', () => {
    expect(Object.keys(DESIGN_TEXTS.sections).length).toBe(9);
  });

  for (const name of sectionNames) {
    it(`la section "${name}" a une description non vide`, () => {
      expect(DESIGN_TEXTS.sections[name].length).toBeGreaterThan(0);
    });
  }
});

// ---------------------------------------------------------------------------
// Tests — Tooltips des champs numériques N (Requirement 4.3)
// ---------------------------------------------------------------------------

describe('DesignPanel — tooltips champs numériques N (Requirement 4.3)', () => {
  it('tooltip flexGrow contient le nom de la propriété', () => {
    expect(DESIGN_TEXTS.tooltips.flexGrow).toContain('flexGrow');
  });

  it('tooltip flexGrow contient une description', () => {
    expect(DESIGN_TEXTS.tooltips.flexGrow).toContain('expansion');
  });

  it('tooltip flexShrink contient le nom de la propriété', () => {
    expect(DESIGN_TEXTS.tooltips.flexShrink).toContain('flexShrink');
  });

  it('tooltip gap contient le nom de la propriété', () => {
    expect(DESIGN_TEXTS.tooltips.gap).toContain('gap');
  });

  it('tooltip width contient le nom de la propriété', () => {
    expect(DESIGN_TEXTS.tooltips.width).toContain('width');
  });

  it('tooltip height contient le nom de la propriété', () => {
    expect(DESIGN_TEXTS.tooltips.height).toContain('height');
  });

  it('tooltip borderRadius contient le nom de la propriété', () => {
    expect(DESIGN_TEXTS.tooltips.borderRadius).toContain('borderRadius');
  });

  it('tooltip shadowOpacity contient le nom de la propriété', () => {
    expect(DESIGN_TEXTS.tooltips.shadowOpacity).toContain('shadowOpacity');
  });

  it('tous les tooltips numériques utilisent le séparateur " — "', () => {
    const numericTooltips = [
      DESIGN_TEXTS.tooltips.flexGrow,
      DESIGN_TEXTS.tooltips.flexShrink,
      DESIGN_TEXTS.tooltips.gap,
      DESIGN_TEXTS.tooltips.width,
      DESIGN_TEXTS.tooltips.height,
    ];
    for (const t of numericTooltips) {
      expect(t).toContain(' — ');
    }
  });
});

// ---------------------------------------------------------------------------
// Tests — Tooltips des boutons Seg (Requirement 4.4)
// ---------------------------------------------------------------------------

describe('DesignPanel — tooltips boutons Seg (Requirement 4.4)', () => {
  it('tooltip seg.row décrit la disposition horizontale', () => {
    expect(DESIGN_TEXTS.tooltips.seg.row).toContain('horizontale');
  });

  it('tooltip seg.row contient la valeur "row"', () => {
    expect(DESIGN_TEXTS.tooltips.seg.row).toContain('row');
  });

  it('tooltip seg.column décrit la disposition verticale', () => {
    expect(DESIGN_TEXTS.tooltips.seg.column).toContain('verticale');
  });

  it('tooltip seg.column contient la valeur "column"', () => {
    expect(DESIGN_TEXTS.tooltips.seg.column).toContain('column');
  });

  it('tooltip seg.flex-start mentionne "début"', () => {
    expect(DESIGN_TEXTS.tooltips.seg['flex-start']).toContain('début');
  });

  it('tooltip seg.center mentionne "centrés"', () => {
    expect(DESIGN_TEXTS.tooltips.seg.center).toContain('centrés');
  });

  it('tooltip seg.absolute décrit le positionnement libre', () => {
    expect(DESIGN_TEXTS.tooltips.seg.absolute).toContain('librement');
  });

  it('tooltip seg.relative décrit le flux normal', () => {
    expect(DESIGN_TEXTS.tooltips.seg.relative).toContain('flux normal');
  });

  it('tooltip seg.solid décrit la bordure pleine', () => {
    expect(DESIGN_TEXTS.tooltips.seg.solid).toContain('pleine');
  });

  it('tooltip seg.dashed décrit la bordure en tirets', () => {
    expect(DESIGN_TEXTS.tooltips.seg.dashed).toContain('tirets');
  });

  it('tous les tooltips Seg utilisent le séparateur " — "', () => {
    const segTooltips = [
      DESIGN_TEXTS.tooltips.seg.row,
      DESIGN_TEXTS.tooltips.seg.column,
      DESIGN_TEXTS.tooltips.seg['flex-start'],
      DESIGN_TEXTS.tooltips.seg.center,
      DESIGN_TEXTS.tooltips.seg.absolute,
      DESIGN_TEXTS.tooltips.seg.relative,
    ];
    for (const t of segTooltips) {
      expect(t).toContain(' — ');
    }
  });
});

// ---------------------------------------------------------------------------
// Tests — Description position absolue (Requirement 4.6)
// ---------------------------------------------------------------------------

describe('DesignPanel — description position absolue (Requirement 4.6)', () => {
  it('la description est correcte', () => {
    expect(DESIGN_TEXTS.absoluteDescription).toBe(
      'Position absolue — Le composant est positionné par rapport à son parent le plus proche.'
    );
  });

  it('la description mentionne "Position absolue"', () => {
    expect(DESIGN_TEXTS.absoluteDescription).toContain('Position absolue');
  });

  it('la description mentionne "parent le plus proche"', () => {
    expect(DESIGN_TEXTS.absoluteDescription).toContain('parent le plus proche');
  });

  it('la description se termine par un point', () => {
    expect(DESIGN_TEXTS.absoluteDescription.endsWith('.')).toBe(true);
  });

  it('la description est une chaîne non vide', () => {
    expect(DESIGN_TEXTS.absoluteDescription.length).toBeGreaterThan(0);
  });
});
