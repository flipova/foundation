# Plan d'implémentation : foundation-component-map-blocks

## Vue d'ensemble

Intégration complète des composants `foundation` dans le Studio visuel : enregistrement des 8 layouts manquants et des 23 nouveaux blocs fonctionnels dans le `COMPONENT_MAP`, création du fichier `blocks/new.ts` avec les `BlockMeta`, mise à jour de l'index des blocs, et extension des tests de propriétés.

## Tâches

- [x] 1. Créer `blocks/new.ts` avec les 23 BlockMeta
  - Créer `foundation/layout/registry/blocks/new.ts`
  - Exporter `newBlocks: BlockMeta[]` avec les 23 entrées complètes
  - Importer `BlockMeta` depuis `../../types`
  - Couvrir les 23 blocs : `SocialLinksBlock`, `ProductCardBlock`, `NotificationItemBlock`, `PricingCardBlock`, `TransactionItemBlock`, `OnboardingSlideBlock`, `ChatBubbleBlock`, `CalendarEventBlock`, `FileItemBlock`, `ContactCardBlock`, `MapPinBlock`, `PasswordStrengthBlock`, `MediaPickerBlock`, `BannerBlock`, `CommentBlock`, `OTPInputBlock`, `TagInputBlock`, `StepperBlock`, `RatingBlock`, `QuoteBlock`, `TimelineBlock`, `CounterBlock`, `SegmentedControlBlock`
  - Chaque `BlockMeta` doit avoir : `id`, `label`, `description`, `category`, `tags`, `themeMapping`, `components`, `slots`, `props` (sans callbacks)
  - Les props de type `"enum"` doivent avoir un champ `options` non-vide
  - Les props de type `"color"` doivent avoir `themeDefault` ou `default`
  - Aucune `PropMeta` ne doit avoir un `name` commençant par `"on"`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 1.1 Test de propriété — Intégrité structurelle des BlockMeta (Propriété 6)
    - **Propriété 6 : chaque `BlockMeta` de `newBlocks` a les champs obligatoires non-vides**
    - **Valide : Requirements 2.2**

  - [x] 1.2 Test de propriété — Typage des props visuelles et enum (Propriété 7)
    - **Propriété 7 : les props `enum` ont des `options`, les props `color` ont un `themeDefault` ou `default`**
    - **Valide : Requirements 2.4, 5.3, 5.5**

  - [x] 1.3 Test de propriété — Exclusion des callbacks (Propriété 8)
    - **Propriété 8 : aucune `PropMeta` de `newBlocks` ne commence par `"on"`**
    - **Valide : Requirements 5.4**

- [x] 2. Mettre à jour `blocks.ts` pour intégrer `newBlocks`
  - Modifier `foundation/layout/registry/blocks.ts`
  - Importer `existingBlocks` depuis `./blocks/existing`
  - Importer `newBlocks` depuis `./blocks/new`
  - Remplacer le tableau inline par `[...existingBlocks, ...newBlocks]`
  - Conserver la fonction `getBlockMeta`
  - _Requirements: 2.6, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 2.1 Test de propriété — Couverture du registre de blocs (Propriété 4)
    - **Propriété 4 : `getBlockMeta(id)` retourne le bon `BlockMeta` pour chaque `id` de `newBlocks`**
    - **Valide : Requirements 2.6, 6.1, 6.4**

  - [x] 2.2 Test de propriété — Absence de doublons dans le registre (Propriété 5)
    - **Propriété 5 : `blockRegistry` ne contient aucun doublon d'`id`**
    - **Valide : Requirements 6.3**

- [x] 3. Checkpoint — Vérifier le registre de blocs
  - S'assurer que tous les tests de propriétés du registre passent, poser des questions si nécessaire.

- [x] 4. Mettre à jour l'index des blocs
  - Modifier `foundation/layout/ui/blocks/index.ts`
  - Ajouter les 23 exports manquants après les 11 existants, avec la syntaxe `export { default as <NomDuBloc> } from "./<NomDuBloc>"`
  - Conserver les 11 exports existants sans modification
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 5. Ajouter les 8 layouts manquants dans `componentMap.ts`
  - Modifier `studio/app/src/renderer/componentMap.ts`
  - Importer les 8 layouts depuis `foundation/layout/ui/` :
    - `ParallaxLayout` (default export)
    - `SketchLayout` (default export)
    - `SwiperLayout` (default export)
    - `Swipe2ScreenLayout` (default export)
    - `import { SystemUIWrapper as SystemLayout }` depuis `SystemLayout`
    - `import { TutoLayout }` depuis `TutoLayout`
    - `DeckLayout` (default export)
    - `FlipLayout` (default export)
  - Ajouter dans `COMPONENT_MAP` via `safe()` en respectant l'ordre existant (section layouts)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 6. Ajouter les 23 nouveaux blocs dans `componentMap.ts`
  - Modifier `studio/app/src/renderer/componentMap.ts`
  - Importer les 23 nouveaux blocs depuis `foundation/layout/ui/blocks/<NomDuBloc>`
  - Ajouter dans `COMPONENT_MAP` via `safe()` en fin de section blocs
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.1 Ajouter les mocks des 8 layouts dans le fichier de test
    - Ajouter les `vi.mock` pour les 8 nouveaux layouts dans `componentMap.stubs.test.ts`
    - _Requirements: 1.1_

  - [x] 6.2 Ajouter les mocks des 23 blocs dans le fichier de test
    - Ajouter les `vi.mock` pour les 23 nouveaux blocs dans `componentMap.stubs.test.ts`
    - _Requirements: 4.1_

- [x] 7. Implémenter les tests de propriétés dans `componentMap.stubs.test.ts`
  - Étendre `studio/app/src/renderer/__tests__/componentMap.stubs.test.ts`
  - Utiliser `fast-check` avec minimum 100 itérations par test
  - Annoter chaque test avec `// Feature: foundation-component-map-blocks, Property N: <texte>`

  - [x] 7.1 Implémenter la Propriété 1 — Couverture complète du COMPONENT_MAP
    - Vérifier que tous les IDs des 8 layouts et 23 blocs sont présents dans `COMPONENT_MAP`
    - Utiliser `fc.constantFrom(...expectedIds)`
    - **Propriété 1 : tous les IDs attendus sont dans `COMPONENT_MAP`**
    - **Valide : Requirements 1.1, 4.1**

  - [x] 7.2 Implémenter la Propriété 2 — Absence de valeurs nulles dans le COMPONENT_MAP
    - Vérifier que toutes les entrées de `COMPONENT_MAP` sont définies et non-null
    - Utiliser `fc.constantFrom(...Object.keys(COMPONENT_MAP))`
    - **Propriété 2 : aucune entrée du `COMPONENT_MAP` ne vaut `undefined` ou `null`**
    - **Valide : Requirements 7.5**

  - [x] 7.3 Implémenter la Propriété 3 — Résilience au rendu (safe wrapper)
    - Vérifier que tout composant du `COMPONENT_MAP` peut être rendu avec `{}` sans lever d'exception
    - **Propriété 3 : rendu avec props vides ne propage pas d'exception**
    - **Valide : Requirements 1.3, 4.3, 7.1, 7.3**

  - [x] 7.4 Implémenter la Propriété 4 — Couverture du registre de blocs
    - Importer `newBlocks` et `getBlockMeta` depuis le registre
    - Vérifier que `getBlockMeta(id)` retourne le bon `BlockMeta` pour chaque `id` de `newBlocks`
    - **Propriété 4 : `getBlockMeta` couvre tous les nouveaux blocs**
    - **Valide : Requirements 2.6, 6.1, 6.4**

  - [x] 7.5 Implémenter la Propriété 5 — Absence de doublons dans le registre
    - Importer `blockRegistry` et vérifier l'absence de doublons d'`id`
    - **Propriété 5 : `blockRegistry` ne contient aucun doublon d'`id`**
    - **Valide : Requirements 6.3**

  - [x] 7.6 Implémenter la Propriété 6 — Intégrité structurelle des BlockMeta
    - Vérifier que chaque `BlockMeta` de `newBlocks` a les champs obligatoires non-vides
    - **Propriété 6 : tous les `BlockMeta` de `newBlocks` ont les champs obligatoires**
    - **Valide : Requirements 2.2**

  - [x] 7.7 Implémenter la Propriété 7 — Typage des props visuelles et enum
    - Vérifier que les props `enum` ont des `options` et les props `color` ont un `themeDefault` ou `default`
    - **Propriété 7 : props `enum` ont des `options`, props `color` ont un `themeDefault` ou `default`**
    - **Valide : Requirements 2.4, 5.3, 5.5**

  - [x] 7.8 Implémenter la Propriété 8 — Exclusion des callbacks
    - Vérifier qu'aucune `PropMeta` de `newBlocks` ne commence par `"on"`
    - **Propriété 8 : aucune `PropMeta` de `newBlocks` ne commence par `"on"`**
    - **Valide : Requirements 5.4**

  - [x] 7.9 Implémenter la Propriété 9 — Robustesse d'applyDefaults
    - Importer `applyDefaults` et vérifier qu'elle ne lève pas d'exception sur props vides pour tout `BlockMeta` de `newBlocks`
    - Vérifier que toutes les props avec `default` ont une valeur non-undefined dans le résultat
    - **Propriété 9 : `applyDefaults({}, meta, theme)` ne lève pas d'exception pour tout `BlockMeta` de `newBlocks`**
    - **Valide : Requirements 5.6, 7.2**

- [x] 8. Checkpoint final — S'assurer que tous les tests passent
  - S'assurer que tous les tests passent, poser des questions si nécessaire.

## Notes

- Les tâches marquées `*` sont optionnelles et peuvent être ignorées pour un MVP rapide
- Chaque tâche référence les requirements spécifiques pour la traçabilité
- Les checkpoints garantissent une validation incrémentale
- Les tests de propriétés valident des garanties universelles sur l'ensemble des données
- Les tests unitaires se concentrent sur les cas limites et les comportements d'erreur précis
