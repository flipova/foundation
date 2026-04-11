# Requirements: Studio Right Panel Redesign

## Introduction

Ce document définit les exigences fonctionnelles et visuelles pour aligner le panneau droit du studio (PropertiesPanel, DesignPanel, LogicPanel) sur le design moderne du Topbar.

---

## Requirements

### 1. Palette de couleurs unifiée

**User Story** : En tant qu'utilisateur du studio, je veux que le panneau droit utilise la même palette sombre que la barre d'outils, afin d'avoir une interface cohérente.

#### Acceptance Criteria

1.1 — `PropertiesPanel`, `DesignPanel` et `LogicPanel` DOIVENT utiliser `C.bg = '#07090f'` pour les surfaces principales (header, tab bar, section headers).

1.2 — Les bodies de sections DOIVENT utiliser `C.surface = '#0d1220'`.

1.3 — Les inputs, boutons et code blocks DOIVENT utiliser `C.surface2 = '#131a2e'`.

1.4 — Toutes les bordures et séparateurs DOIVENT utiliser `C.border = '#1a2240'`.

1.5 — Le texte principal DOIT utiliser `C.text = '#d0d8f0'` et les labels secondaires `C.muted = '#4a5470'`.

---

### 2. NodeHeader (PropertiesPanel)

**User Story** : En tant qu'utilisateur, je veux voir clairement le type et le nom du nœud sélectionné dans un header compact et lisible.

#### Acceptance Criteria

2.1 — Le header DOIT avoir `backgroundColor: '#07090f'` et une bordure bottom `#1a2240`.

2.2 — L'icône de kind DOIT être dans un badge 22×22 px, `borderRadius: 6`, avec `backgroundColor` semi-transparent basé sur `C.primary`.

2.3 — Le nom du nœud DOIT être affiché en `fontSize: 13`, `fontWeight: '700'`, `letterSpacing: -0.2`.

2.4 — Le badge de kind DOIT être en `fontSize: 9`, `fontWeight: '600'`, `textTransform: 'uppercase'`, `letterSpacing: 0.8`, `color: C.muted`.

2.5 — Les variant pills DOIVENT avoir `backgroundColor: '#131a2e'`, `borderColor: '#1a2240'`, `borderRadius: 5`, padding compact (7×3).

2.6 — La variant pill active DOIT avoir `backgroundColor: '#3b82f6'`, `borderColor: '#3b82f6'`, texte blanc.

---

### 3. TabBar (PropertiesPanel)

**User Story** : En tant qu'utilisateur, je veux naviguer entre les onglets Properties, Design, Logic et Code avec des indicateurs visuels clairs.

#### Acceptance Criteria

3.1 — La tab bar DOIT avoir `backgroundColor: '#07090f'` et `borderBottomWidth: 1`, `borderBottomColor: '#1a2240'`.

3.2 — Chaque onglet DOIT avoir `paddingVertical: 9`, `paddingHorizontal: 10`.

3.3 — L'onglet actif DOIT afficher un indicateur bottom de hauteur 2 px, `backgroundColor: '#3b82f6'`, `borderRadius: 1`.

3.4 — Le texte d'onglet inactif DOIT être `color: '#4a5470'`, `fontSize: 11`, `fontWeight: '500'`.

3.5 — Le texte d'onglet actif DOIT être `color: '#3b82f6'`, `fontWeight: '600'`.

---

### 4. Sections collapsibles — PropertiesPanel

**User Story** : En tant qu'utilisateur, je veux que les sections de propriétés soient visuellement distinctes et faciles à parcourir.

#### Acceptance Criteria

4.1 — Chaque section DOIT avoir `borderBottomWidth: 1`, `borderBottomColor: '#1a2240'`.

4.2 — Le header de section DOIT avoir `backgroundColor: '#07090f'`, `paddingHorizontal: 12`, `paddingVertical: 9`.

4.3 — L'icône de groupe DOIT être dans un badge 20×20 px, `borderRadius: 5`.

4.4 — Le titre de section DOIT être `fontSize: 11`, `fontWeight: '600'`, `color: '#d0d8f0'`, `letterSpacing: -0.1`.

4.5 — Le body de section DOIT avoir `backgroundColor: '#0d1220'`, `paddingHorizontal: 12`, `paddingBottom: 12`, `paddingTop: 6`.

---

### 5. PropEditor

**User Story** : En tant qu'utilisateur, je veux éditer les props d'un composant dans des champs bien délimités et lisibles.

#### Acceptance Criteria

5.1 — Chaque prop DOIT être dans un conteneur `backgroundColor: '#0d1220'`, `borderRadius: 6`, `padding: 8`, `marginBottom: 4`.

5.2 — Le label de prop DOIT être `fontSize: 10`, `fontWeight: '600'`, `color: '#4a5470'`, `marginBottom: 4`.

5.3 — Le bound indicator DOIT avoir `backgroundColor: 'rgba(167,139,250,0.12)'`, `borderRadius: 4`, `paddingHorizontal: 5`.

5.4 — Les boutons auto et reset DOIVENT avoir `borderRadius: 5`, hauteur 22 px, style cohérent avec les icon buttons du Topbar.

---

### 6. DesignPanel — Sections

**User Story** : En tant qu'utilisateur, je veux que les sections du panneau Design soient visuellement cohérentes avec le reste du studio.

#### Acceptance Criteria

6.1 — Le header de section DOIT avoir `backgroundColor: '#07090f'`, `paddingHorizontal: 12`, `paddingVertical: 9`.

6.2 — L'icône de section DOIT être dans un badge 22×22 px, `borderRadius: 6`.

6.3 — Le titre DOIT être `fontSize: 11`, `fontWeight: '700'`, `color: '#d0d8f0'`, `letterSpacing: -0.1`.

6.4 — La description DOIT être `fontSize: 10`, `color: '#4a5470'`, `lineHeight: 14`, `marginBottom: 8`.

6.5 — Le body DOIT avoir `backgroundColor: '#0d1220'`, `paddingHorizontal: 12`, `paddingTop: 8`, `paddingBottom: 14`.

---

### 7. DesignPanel — Seg buttons

**User Story** : En tant qu'utilisateur, je veux que les boutons de sélection (direction, alignement, etc.) soient compacts et lisibles.

#### Acceptance Criteria

7.1 — Les Seg buttons DOIVENT avoir `backgroundColor: '#131a2e'`, `borderRadius: 6`, `borderWidth: 1`, `borderColor: '#1a2240'`.

7.2 — Le padding DOIT être `paddingHorizontal: 8`, `paddingVertical: 5`.

7.3 — Le texte DOIT être `fontSize: 10`, `fontWeight: '500'`, `color: '#4a5470'`.

7.4 — Le bouton actif DOIT avoir `backgroundColor: color`, `borderColor: color`, texte `color: '#fff'`, `fontWeight: '600'`.

7.5 — Les Seg buttons DOIVENT wrapper naturellement en colonne sans débordement horizontal.

---

### 8. DesignPanel — Champs numériques

**User Story** : En tant qu'utilisateur, je veux saisir des valeurs numériques dans des champs compacts et bien délimités.

#### Acceptance Criteria

8.1 — Le container `nWrap` DOIT avoir `backgroundColor: '#131a2e'`, `borderRadius: 6`, `borderWidth: 1`, `borderColor: '#1a2240'`, `paddingHorizontal: 8`, `paddingVertical: 5`.

8.2 — Le label DOIT être `fontSize: 9`, `fontWeight: '500'`, `color: '#4a5470'`, `marginBottom: 2`.

8.3 — L'input DOIT être `fontSize: 11`, `color: '#d0d8f0'`, `fontWeight: '500'`.

---

### 9. DesignPanel — Sub labels

**User Story** : En tant qu'utilisateur, je veux que les sous-titres de groupe soient discrets mais lisibles.

#### Acceptance Criteria

9.1 — Les sub labels DOIVENT être `fontSize: 9`, `fontWeight: '700'`, `color: '#4a5470'`, `letterSpacing: 0.6`, `textTransform: 'uppercase'`.

9.2 — Le margin top DOIT être 10 px et le margin bottom 4 px.

---

### 10. LogicPanel — Sections

**User Story** : En tant qu'utilisateur, je veux que les sections du panneau Logic soient visuellement cohérentes avec le reste du studio.

#### Acceptance Criteria

10.1 — Le header de section DOIT avoir `backgroundColor: '#07090f'`, `paddingHorizontal: 12`, `paddingVertical: 9`.

10.2 — L'icône DOIT être dans un badge 22×22 px, `borderRadius: 6`.

10.3 — Le titre DOIT être `fontSize: 11`, `fontWeight: '700'`, `color: '#d0d8f0'` (actif) ou `'#4a5470'` (inactif).

10.4 — Le body DOIT avoir `backgroundColor: '#0d1220'`, `paddingHorizontal: 12`, `paddingBottom: 14`, `paddingTop: 6`.

10.5 — Une section active DOIT afficher `borderLeftWidth: 2`, `borderLeftColor: color` (couleur de la section).

---

### 11. LogicPanel — Bouton "Add trigger"

**User Story** : En tant qu'utilisateur, je veux que le bouton d'ajout de trigger soit visible et cohérent avec le style du studio.

#### Acceptance Criteria

11.1 — Le bouton DOIT avoir `borderRadius: 7`, `paddingVertical: 9`, `borderStyle: 'dashed'`.

11.2 — Le texte DOIT être `fontSize: 11`, `fontWeight: '600'`.

---

### 12. Disposition en colonne

**User Story** : En tant qu'utilisateur, je veux que le panneau droit reste lisible quelle que soit sa largeur, sans débordement horizontal.

#### Acceptance Criteria

12.1 — Aucun élément du panneau droit NE DOIT utiliser de largeur fixe en pixels qui pourrait causer un débordement horizontal.

12.2 — Tous les éléments DOIVENT utiliser `flex`, `flexWrap`, ou `width: '100%'` pour s'adapter à la largeur du conteneur.

12.3 — La disposition DOIT rester fonctionnelle à une largeur minimale de 240 px.

---

### 13. Cohérence des icônes

**User Story** : En tant qu'utilisateur, je veux que les icônes soient cohérentes avec celles utilisées dans le Topbar.

#### Acceptance Criteria

13.1 — Toutes les icônes DOIVENT provenir de `@expo/vector-icons` (Feather).

13.2 — Les tailles d'icônes DOIVENT être cohérentes : 11 px pour les icônes de section, 12-13 px pour les icônes d'action.

---

### 14. Non-régression fonctionnelle

**User Story** : En tant que développeur, je veux que le redesign ne casse aucune fonctionnalité existante.

#### Acceptance Criteria

14.1 — Toute la logique existante (updateProp, updateStyles, updateEvents, updateBindings, etc.) DOIT rester inchangée.

14.2 — Les sections collapsibles DOIVENT conserver leur comportement de toggle.

14.3 — Le `PropEditor` DOIT conserver la gestion des bindings, des valeurs auto et des resets.

14.4 — Le `DesignPanel` DOIT conserver la persistance de l'état ouvert/fermé des sections via `sectionState.current`.

14.5 — Le `LogicPanel` DOIT conserver la persistance de l'état des sections et le tracking `manuallyToggled`.
