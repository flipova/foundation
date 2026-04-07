# Implementation Plan: `studio-codegen-app-router`

## Overview

Refactoring du module `studio/engine/codegen/` en trois étapes : mise à jour de la signature publique de `generateProject`, création du module `postprocess.ts` avec les trois post-processors, puis mise à jour des exports dans `index.ts`. Chaque étape est couverte par des tests PBT (fast-check) et des tests unitaires.

## Tasks

- [x] 1. Mettre à jour les types et la signature publique dans `project.ts`
  - Ajouter les interfaces `GeneratorOptions` et `GenerationResult` dans `project.ts`
  - Renommer la logique de génération existante en `generateCoreFiles(project)` (fonction interne)
  - Réécrire `generateProject` pour accepter `options?: GeneratorOptions` et retourner `GenerationResult`
  - Implémenter la validation des options (`foundationMode: "local"` sans `foundationSourcePath` → throw)
  - Appliquer le post-processing selon les options (délégation vers `postprocess.ts` — stub vide pour l'instant)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 2. Implémenter `RegistryFoundationPostProcessor` dans `postprocess.ts`
  - [x] 2.1 Créer `studio/engine/codegen/postprocess.ts` avec `applyRegistryFoundation(files)`
    - Ajouter le fichier `.npmrc` avec la config GitHub Packages
    - S'assurer que `@flipova/foundation: "latest"` est présent dans `package.json`
    - _Requirements: 3.1, 3.2, 5.4_

  - [ ]* 2.2 Écrire le test de propriété pour `applyRegistryFoundation`
    - **Property 12 : `.npmrc` présent en Registry Mode**
    - **Validates: Requirements 3.1, 3.2, 5.4**

  - [ ]* 2.3 Écrire le test de propriété pour la valeur par défaut de `foundationMode`
    - **Property 15 : `foundationMode` absent équivaut à `"registry"`**
    - **Validates: Requirements 3.8**

- [x] 3. Implémenter `SnackPostProcessor` dans `postprocess.ts`
  - [x] 3.1 Ajouter les constantes Snack (`SNACK_SDK_VERSION`, `SNACK_EXCLUDED_DEPS`, `SNACK_UNSUPPORTED_NATIVE`, `SNACK_COMPATIBLE_VERSIONS`) dans `postprocess.ts`
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Implémenter `applySnackMode(files, project)`
    - Remplacer les imports `@flipova/foundation` (et sous-chemins) par les chemins `_flipova_modules/` en respectant l'ordre des patterns `FOUNDATION_IMPORT_REPLACEMENTS`
    - Filtrer les dépendances incompatibles Snack du `package.json`
    - Appliquer les versions `SNACK_COMPATIBLE_VERSIONS` dans `package.json`
    - Générer `snack.json` avec `name`, `description`, `sdkVersion`, `dependencies`
    - Émettre des warnings pour les modules natifs non supportés (`SNACK_UNSUPPORTED_NATIVE`)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 2.4 Écrire le test de propriété pour `applySnackMode` — package.json compatible
    - **Property 7 : `package.json` Snack-compatible**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 2.5 Écrire le test de propriété pour la présence de `snack.json`
    - **Property 8 : `snack.json` présent en Snack Mode**
    - **Validates: Requirements 2.3, 5.3**

  - [ ]* 2.6 Écrire le test de propriété pour l'absence d'imports foundation en Snack Mode
    - **Property 9 : Aucun import `@flipova/foundation` en Snack Mode**
    - **Validates: Requirements 2.5, 2.6, 5.6**

  - [ ]* 2.7 Écrire le test de propriété pour les warnings modules natifs
    - **Property 10 : Warnings émis pour modules natifs non supportés en Snack Mode**
    - **Validates: Requirements 2.7**

- [x] 4. Implémenter `LocalFoundationPostProcessor` dans `postprocess.ts`
  - [x] 4.1 Implémenter `applyLocalFoundation(files, foundationSourcePath)`
    - Lire récursivement les fichiers du dossier `foundation/` via `fs.readdirSync`
    - Générer les `GeneratedFile` sous `_flipova_modules/@flipova/foundation/`
    - Générer `_flipova_modules/@flipova/foundation/package.json` avec les champs `name`, `version`, `main`, `exports`
    - Remplacer les imports `@flipova/foundation` (et sous-chemins) dans tous les fichiers `.ts`/`.tsx` en respectant l'ordre des patterns `FOUNDATION_IMPORT_REPLACEMENTS`
    - Retirer `@flipova/foundation` du `package.json` généré
    - Lever des erreurs descriptives si un fichier source ne peut pas être lu
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 4.2 Écrire le test de propriété pour la copie locale
    - **Property 13 : Copie locale présente en Local Mode**
    - **Validates: Requirements 3.3, 3.4, 3.6, 5.5**

  - [ ]* 4.3 Écrire le test de propriété pour l'absence d'imports foundation en Local Mode
    - **Property 14 : Aucun import `@flipova/foundation` en Local Mode**
    - **Validates: Requirements 3.5, 5.7**

- [x] 5. Checkpoint — Vérifier les post-processors
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Câbler `postprocess.ts` dans `generateProject` et couvrir les invariants globaux
  - [x] 6.1 Brancher les appels `applyRegistryFoundation`, `applyLocalFoundation`, `applySnackMode` dans `generateProject` selon les options
    - Respecter l'ordre du pipeline : registry/local d'abord, snack ensuite
    - _Requirements: 4.2, 4.5_

  - [ ]* 6.2 Écrire le test de propriété — Root Layout toujours présent
    - **Property 1 : Root Layout toujours présent**
    - **Validates: Requirements 1.1, 5.2**

  - [ ]* 6.3 Écrire le test de propriété — Paths uniques
    - **Property 2 : Paths uniques**
    - **Validates: Requirements 5.1**

  - [ ]* 6.4 Écrire le test de propriété — Navigation type → groupe implicite
    - **Property 3 : Navigation type → groupe implicite correct**
    - **Validates: Requirements 1.2, 1.3, 1.4**

  - [ ]* 6.5 Écrire le test de propriété — Tout ScreenGroup produit son layout
    - **Property 4 : Tout ScreenGroup produit son layout**
    - **Validates: Requirements 1.5, 1.6, 1.7, 1.8**

  - [ ]* 6.6 Écrire le test de propriété — `package.json` contient `"main": "expo-router/entry"`
    - **Property 5 : `package.json` main**
    - **Validates: Requirements 1.9**

  - [ ]* 6.7 Écrire le test de propriété — `app.json` contient `scheme` et `web.bundler`
    - **Property 6 : `app.json` scheme + bundler**
    - **Validates: Requirements 1.10**

  - [ ]* 6.8 Écrire le test de propriété — Rétrocompatibilité sans options
    - **Property 11 : Rétrocompatibilité**
    - **Validates: Requirements 2.8, 4.3**

- [ ] 7. Écrire les tests unitaires pour les cas d'erreur
  - [ ]* 7.1 Écrire les tests unitaires dans `studio/engine/codegen/__tests__/codegen.unit.test.ts`
    - Cas : `foundationMode: "local"` sans `foundationSourcePath` → throw avec message exact
    - Cas : `foundationSourcePath` pointe vers un dossier inexistant → throw avec message exact
    - Cas : vérification du contenu exact de `app/_layout.tsx`, `.npmrc`, `snack.json` sur un `ProjectDocument` représentatif
    - _Requirements: 4.6, 3.7_

- [x] 8. Mettre à jour `index.ts` pour exporter les nouveaux types
  - Exporter `GeneratorOptions`, `GenerationResult` depuis `studio/engine/codegen/index.ts`
  - Mettre à jour l'export de `generateProject` pour refléter la nouvelle signature
  - _Requirements: 4.1, 4.4_

- [x] 9. Checkpoint final — Tous les tests passent
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Les tâches marquées `*` sont optionnelles et peuvent être sautées pour un MVP rapide
- Les tests PBT utilisent fast-check (déjà présent dans le projet) avec `numRuns: 100` minimum
- Les fichiers de tests sont : `__tests__/codegen.pbt.test.ts` et `__tests__/codegen.unit.test.ts`
- Chaque test PBT doit référencer la propriété du design via un commentaire `// Feature: studio-codegen-app-router, Property N`
- L'ordre du pipeline dans `generateProject` : validation → core → registry/local → snack
