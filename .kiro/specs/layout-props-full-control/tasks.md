# Implementation Plan: layout-props-full-control

## Overview

Exposer toutes les valeurs hardcodées des layouts comme `PropDescriptor` dans leurs `LayoutMeta`, en trois axes : extension du type system (`"json"`), nouveaux registres (`Swipe2ScreenLayout`, `SystemLayout`), et props manquantes dans 13 layouts existants. Zéro breaking change garanti par des defaults reproduisant exactement les valeurs actuelles.

## Tasks

- [x] 1. Étendre `PropType` avec `"json"`
  - Ajouter `"json"` à l'union `PropType` dans `foundation/layout/types/index.ts`
  - Vérifier que `applyDefaults` traite déjà les valeurs de façon opaque (aucune modification nécessaire)
  - _Requirements: 1.1, 1.2_

  - [x] 1.1 Écrire le test unitaire de présence de `"json"` dans `PropType`
    - Vérifier à la compilation TypeScript que `"json"` est assignable à `PropType`
    - _Requirements: 1.1_

- [x] 2. Ajouter les entrées registre `Swipe2ScreenLayout` et `SystemLayout`
  - [x] 2.1 Ajouter `LayoutMeta` pour `Swipe2ScreenLayout` dans `foundation/layout/registry/layouts.ts`
    - Props : `containerBackground`, `screenBackground`, `swipeThreshold`, `projectedScale`, `animationDuration`, `slides` (json)
    - Catégorie `"special"`, `animated: true`
    - _Requirements: 2.1, 2.2, 1.3_

  - [x] 2.2 Ajouter `LayoutMeta` pour `SystemLayout` dans `foundation/layout/registry/layouts.ts`
    - Props : `rootBackgroundColor`, `statusBarContentStyle` (enum), `edges` (json), `navigationBarContentStyle` (enum)
    - Catégorie `"special"`, `animated: false`
    - _Requirements: 3.1, 3.2, 1.3_

  - [x] 2.3 Écrire les tests unitaires de présence des nouvelles entrées registre
    - Vérifier que `layoutRegistry` contient `Swipe2ScreenLayout` et `SystemLayout`
    - Vérifier que `slides` a `type: "json"` et `edges` a `type: "json"`
    - _Requirements: 2.1, 3.1, 1.3_

  - [x] 2.4 Écrire le test property — Property 4 : unicité des ids
    - **Property 4: Unicité des ids dans le registre**
    - **Validates: Requirements 2.1, 3.1**

- [x] 3. Ajouter les props manquantes dans les registres existants (groupe 1 : layouts simples)
  - [x] 3.1 `SketchLayout` — ajouter `background` (color, themeDefault: `"background"`)
    - Modifier `LayoutMeta` de `SketchLayout` dans `layouts.ts`
    - _Requirements: 4.1_

  - [x] 3.2 `ScrollLayout` — ajouter `headerPadding` et `footerPadding` (spacing, default: `4`)
    - Modifier `LayoutMeta` de `ScrollLayout` dans `layouts.ts`
    - _Requirements: 15.1_

  - [x] 3.3 `BentoLayout` — ajouter `cellConfig` (json, default: `[]`)
    - Modifier `LayoutMeta` de `BentoLayout` dans `layouts.ts`
    - _Requirements: 18.1, 1.3_

  - [x] 3.4 Écrire les tests unitaires de présence des nouvelles props (groupe 1)
    - Vérifier `SketchLayout.background`, `ScrollLayout.headerPadding/footerPadding`, `BentoLayout.cellConfig`
    - _Requirements: 4.1, 15.1, 18.1_

- [x] 4. Ajouter les props manquantes dans les registres existants (groupe 2 : layouts complexes)
  - [x] 4.1 `DeckLayout` — ajouter `cardBackground`, `cardBorderRadius`, `containerWidth`, `containerHeight`, `peekCount`
    - _Requirements: 5.1_

  - [x] 4.2 `FlipLayout` — ajouter `cardBorderRadius`, `cardAspectRatio`, `cardMaxHeight`, `dezoomDuration`, `flipDuration`, `slideOutDuration`
    - Retirer `dezoomDuration`, `flipDuration`, `slideOutDuration` de `constants`
    - _Requirements: 6.1, 6.5_

  - [x] 4.3 `DashboardLayout` — ajouter `headerBackground`, `sidebarBackground`, `contentBackground`, `footerBackground` (color, themeDefault: `"card"`)
    - _Requirements: 7.1_

  - [x] 4.4 `TutoLayout` — ajouter `accentColor`, `textBackground`, `textColor`, `mutedTextColor` (color, themeDefaults)
    - _Requirements: 8.1_

  - [x] 4.5 `ParallaxLayout` — ajouter `background` (themeDefault: `"background"`) et `rowBackground` (color)
    - _Requirements: 9.1_

  - [x] 4.6 Écrire les tests unitaires de présence des nouvelles props (groupe 2)
    - Vérifier les props de `DeckLayout`, `FlipLayout`, `DashboardLayout`, `TutoLayout`, `ParallaxLayout`
    - _Requirements: 5.1, 6.1, 7.1, 8.1, 9.1_

- [x] 5. Ajouter les props manquantes dans les registres existants (groupe 3 : drawers et animations)
  - [x] 5.1 `BottomDrawerLayout` — ajouter `handleColor`, `backdropOpacity`, `contentScaleWhenOpen`
    - _Requirements: 10.1_

  - [x] 5.2 `TopDrawerLayout` — ajouter `handleColor`, `backdropOpacity`, `contentScaleWhenOpen`, `closeButtonBackground`
    - _Requirements: 11.1_

  - [x] 5.3 `LeftDrawerLayout` — ajouter `handleColor`, `backdropOpacity`, `contentScaleWhenOpen`
    - _Requirements: 12.1_

  - [x] 5.4 `CrossTabLayout` — ajouter `springDamping`, `springStiffness`, `longPressDuration`, `dragScale`
    - Retirer `springDamping` et `springStiffness` de `constants.springConfig`
    - _Requirements: 13.1, 13.5_

  - [x] 5.5 `SwiperLayout` — ajouter `springDamping`, `springStiffness`, `cardCountBackground`, `cardCountTextColor`
    - _Requirements: 14.1_

  - [x] 5.6 Écrire les tests unitaires de présence des nouvelles props (groupe 3)
    - Vérifier les props de `BottomDrawerLayout`, `TopDrawerLayout`, `LeftDrawerLayout`, `CrossTabLayout`, `SwiperLayout`
    - _Requirements: 10.1, 11.1, 12.1, 13.1, 14.1_

- [x] 6. Checkpoint — Valider la cohérence du registre
  - Ensure all tests pass, ask the user if questions arise.

  - [x] 6.1 Écrire les tests property-based du registre dans `foundation/layout/registry/__tests__/layouts.registry.test.ts`
    - [x] 6.1.1 Property 1 : cohérence des defaults — `applyDefaults({}, META, mockTheme)` retourne les defaults déclarés
      - **Property 1: Cohérence des defaults**
      - **Validates: Requirements 1.2, 2.2, 2.4, 3.2, 17.1**

    - [x] 6.1.2 Property 5 : props `enum` ont des `options` non-vides
      - **Property 5: Props enum ont des options non-vides**
      - **Validates: Requirements 3.2**

    - [x] 6.1.3 Property 6 : `themeDefault` réservé aux types `color`/`background`
      - **Property 6: themeDefault uniquement sur color/background**
      - **Validates: Requirements 16.1**

- [x] 7. Migrer les TSX — groupe 1 : layouts simples
  - [x] 7.1 Migrer `SketchLayout.tsx` — lire `background` depuis `applyDefaults(rawProps, META, theme)`
    - Remplacer `bg={theme.background}` par `bg={background}`
    - _Requirements: 4.2_

  - [x] 7.2 Migrer `ScrollLayout.tsx` — lire `headerPadding` et `footerPadding` depuis `applyDefaults`
    - Remplacer `p={4}` dans `renderHeader` et `renderFooter`
    - _Requirements: 15.2, 15.3_

  - [x] 7.3 Migrer `BentoLayout.tsx` — s'assurer que `cellConfig` est lue depuis `applyDefaults`
    - Vérifier que le pattern `applyDefaults(rawProps, META, theme)` est en place
    - _Requirements: 18.2, 18.3_

  - [x] 7.4 Migrer `DashboardLayout.tsx` — remplacer les 4 occurrences de `bg={theme.card}`
    - `headerBackground`, `sidebarBackground`, `contentBackground`, `footerBackground`
    - _Requirements: 7.2_

- [x] 8. Migrer les TSX — groupe 2 : layouts avec animations
  - [x] 8.1 Migrer `DeckLayout.tsx` — remplacer les valeurs hardcodées par les props résolues
    - `cardBackground`, `cardBorderRadius`, `containerWidth`, `containerHeight`, `peekCount`
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [x] 8.2 Migrer `FlipLayout.tsx` — remplacer les constantes d'animation et les styles
    - `dezoomDuration`, `flipDuration`, `slideOutDuration`, `cardBorderRadius`, `cardAspectRatio`, `cardMaxHeight`
    - _Requirements: 6.2, 6.3, 6.4_

  - [x] 8.3 Migrer `TutoLayout.tsx` — remplacer les 4 valeurs thème hardcodées
    - `accentColor`, `textBackground`, `textColor`, `mutedTextColor`
    - Passer `theme` à `applyDefaults`
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 8.4 Migrer `ParallaxLayout.tsx` — ajouter `background` et `rowBackground`
    - Wrapper racine avec `bg={background}`, passer `rowBackground` à `ParallaxRow`
    - Passer `theme` à `applyDefaults`
    - _Requirements: 9.2, 9.3, 9.4_

- [x] 9. Migrer les TSX — groupe 3 : drawers
  - [x] 9.1 Migrer `BottomDrawerLayout.tsx`
    - `theme.primary` → `handleColor`, `0.4` → `backdropOpacity`, `0.95` → `contentScaleWhenOpen`
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 9.2 Migrer `TopDrawerLayout.tsx`
    - `theme.border` → `handleColor`, `0.4` → `backdropOpacity`, `0.95` → `contentScaleWhenOpen`, `${theme.muted}20` → `closeButtonBackground`
    - _Requirements: 11.2, 11.3, 11.4, 11.5_

  - [x] 9.3 Migrer `LeftDrawerLayout.tsx`
    - `theme.primary` → `handleColor`, `0.4` → `backdropOpacity`, `0.98` → `contentScaleWhenOpen`
    - _Requirements: 12.2, 12.3, 12.4_

- [x] 10. Migrer les TSX — groupe 4 : layouts avec spring config
  - [x] 10.1 Migrer `CrossTabLayout.tsx`
    - Construire `const SPRING = { damping: springDamping, stiffness: springStiffness, mass: 0.5 }` depuis `applyDefaults`
    - `activateAfterLongPress(250)` → `activateAfterLongPress(longPressDuration)`
    - `scale: 1.05` → `scale: dragScale`
    - _Requirements: 13.2, 13.3, 13.4_

  - [x] 10.2 Migrer `SwiperLayout.tsx`
    - Construire `springConfig` depuis `springDamping` et `springStiffness`
    - `rgba(0,0,0,0.6)` → `cardCountBackground`, `color: '#fff'` → `cardCountTextColor`
    - _Requirements: 14.2, 14.3_

- [x] 11. Migrer les TSX — groupe 5 : nouveaux layouts
  - [x] 11.1 Migrer `Swipe2ScreenLayout.tsx` — appeler `applyDefaults(rawProps, META, theme)`
    - `backgroundColor: '#000'` → `containerBackground`
    - `backgroundColor: '#fff'` → `screenBackground`
    - `translationY < -100` → `translationY < -swipeThreshold`
    - `withSpring(0.8)` → `withSpring(projectedScale)`
    - `duration: 300` → `duration: animationDuration`
    - _Requirements: 2.3, 2.4_

  - [x] 11.2 Migrer `SystemLayout.tsx` (`SystemUIWrapper`) — appeler `applyDefaults(rawProps, META)`
    - Utiliser `rootBackgroundColor`, `statusBarContentStyle`, `edges`, `navigationBarContentStyle`
    - _Requirements: 3.3_

- [x] 12. Uniformiser le passage de `theme` à `applyDefaults` (Requirement 16)
  - Auditer tous les layouts ayant des `themeDefault` dans leur `LayoutMeta`
  - S'assurer que chacun passe `theme` comme troisième argument à `applyDefaults`
  - _Requirements: 16.2, 16.3_

  - [x] 12.1 Écrire les tests property-based de résolution
    - [x] 12.1.1 Property 2 : priorité de résolution `applyDefaults` (valeur explicite > themeDefault > default)
      - **Property 2: Priorité de résolution applyDefaults**
      - **Validates: Requirements 16.4**

    - [x] 12.1.2 Property 3 : opacité des valeurs `json`
      - **Property 3: Opacité des valeurs json**
      - **Validates: Requirements 1.2**

- [x] 13. Checkpoint final — Valider zéro breaking change
  - Ensure all tests pass, ask the user if questions arise.
  - Vérifier que tous les layouts sans nouvelles props fournies produisent un rendu identique à l'état précédent
  - _Requirements: 17.1, 17.2, 17.3_

## Notes

- Les tâches marquées `*` sont optionnelles et peuvent être sautées pour un MVP rapide
- Chaque tâche référence les requirements pour la traçabilité
- L'ordre des groupes (registre avant TSX) garantit que `getLayoutMeta("LayoutId")!` ne lève jamais d'erreur au runtime
- Les property tests utilisent `fast-check` avec `numRuns: 100`
