# Plan d'implémentation : studio-codegen

## Vue d'ensemble

Refactoriser et étendre le pipeline de génération de code de Flipova Studio en modules
spécialisés et testables. Le code existant dans `studio/engine/codegen/` sera réorganisé
selon l'architecture définie dans le document de conception, en ajoutant les nouveaux
émetteurs et résolveurs manquants.

## Tâches

- [ ] 1. Définir les types et interfaces partagés
  - Créer `studio/engine/codegen/types.ts` avec les interfaces `GeneratedFile`, `ImportCollector`, `HandlerCollector`, `AnimationCollector`, `CompileContext`, `ResolvedBinding`, `EmitContext`
  - Déplacer l'interface `GeneratedFile` de `project.ts` vers `types.ts` et mettre à jour les imports
  - Vérifier que tous les modules existants (`generator.ts`, `project.ts`) compilent sans erreur après la migration
  - _Exigences : 1.1, 1.7, 2.1, 3.1_

- [ ] 2. Implémenter l'ExpressionCompiler
  - [ ] 2.1 Créer `studio/engine/codegen/resolvers/expression.ts` avec la fonction `compile(expr, ctx)` et l'interface `CompileContext`
    - Implémenter la table de résolution complète (11 patterns : `$state`, `$global`, `$query`, `$const`, `$env`, `$theme`, `$node`, `item.field`, champ nu en contexte repeat, expressions booléennes composées)
    - Déléguer à `resolveForCodegen` de `studio/engine/tree/expressions.ts` pour les cas déjà couverts
    - Retourner toujours une chaîne non vide — jamais d'exception (dégradation gracieuse)
    - _Exigences : 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 2.2 Écrire le test de propriété P4 : Round-trip ExpressionCompiler
    - **Propriété 4 : Round-trip ExpressionCompiler**
    - **Valide : Exigences 3.1, 3.2, 3.3, 3.4, 3.5, 14.2**
    - Utiliser `fast-check` avec `fc.constantFrom` sur les préfixes valides (`$state.`, `$global.`, `$query.`, `$const.`, `item.`)
    - Vérifier que `compile(expr, ctx)` retourne une chaîne TypeScript non vide

  - [ ]* 2.3 Écrire le test de propriété P5 : Robustesse de l'ExpressionCompiler
    - **Propriété 5 : Robustesse de l'ExpressionCompiler**
    - **Valide : Exigence 3.7**
    - Utiliser `fc.string()` arbitraire — vérifier que `compile()` ne lève jamais d'exception

  - [ ]* 2.4 Écrire le test de propriété P6 : Idempotence de l'ExpressionCompiler
    - **Propriété 6 : Idempotence de l'ExpressionCompiler**
    - **Valide : Exigences 3.1–3.6**
    - Vérifier que `compile(compile(expr, ctx), ctx) === compile(expr, ctx)` pour toute expression valide

- [ ] 3. Implémenter le BindingResolver
  - [ ] 3.1 Créer `studio/engine/codegen/resolvers/binding.ts` avec la fonction `resolveBinding(prop, expr, ctx)` et l'interface `ResolvedBinding`
    - Implémenter la table d'inférence des setters (6 props : `value`, `text`, `checked`, `selectedValue`, `value` Switch, `data`/`source`)
    - Déléguer la résolution de l'expression au `compile()` de l'ExpressionCompiler
    - Émettre `{/* binding non résolu: {expr} */}` pour les expressions invalides
    - _Exigences : 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 3.2 Écrire le test de propriété P13 : Round-trip BindingResolver
    - **Propriété 13 : Round-trip BindingResolver**
    - **Valide : Exigences 2.1–2.6**
    - Pour tout binding `{prop: "$state.x"}`, vérifier que le getter contient `x` et que le setter contient `setX` si `prop` est une prop de saisie connue

- [ ] 4. Checkpoint — Vérifier que les résolveurs compilent et que les tests passent
  - S'assurer que tous les tests passent, poser des questions à l'utilisateur si nécessaire.

- [ ] 5. Implémenter le ScreenEmitter
  - [ ] 5.1 Créer `studio/engine/codegen/emitters/screen.ts` avec les fonctions `emitNode`, `emitScreen` et `emitHook`
    - Refactoriser la logique de `generator.ts` (fonctions `renderNode`, `generatePageCode`, `generatePageHook`) vers ce nouveau module
    - Intégrer `BindingResolver` pour la résolution des bindings dans `emitNode`
    - Intégrer `ExpressionCompiler` pour les expressions conditionnelles et les sources de repeat
    - Respecter l'ordre de traitement dans `emitNode` : repeat → conditionnel → animation → composant → enfants
    - _Exigences : 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ] 5.2 Implémenter la génération des `useState` dans `emitHook`
    - Générer exactement N appels `useState` pour N entrées dans `PageDocument.state`
    - Typer chaque `useState` selon `PageState.type` et initialiser avec `PageState.default`
    - Gérer le cas `scope: "app"` en référençant `useGlobalStore` au lieu de créer un `useState` local
    - _Exigences : 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 5.3 Implémenter la génération des handlers d'événements dans `emitHook`
    - Générer une fonction `handle{NodeId}_{eventName}` pour chaque événement non vide
    - Implémenter tous les types d'action : `navigate`, `setState`, `callApi`, `alert`, `toast`, `openURL`, `share`, `haptics`, `clipboard`, `sendSMS`, `biometrics`, `getLocation`
    - Générer les blocs `try/catch` avec `onSuccess`/`onError` pour les actions `callApi`
    - _Exigences : 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10_

  - [ ] 5.4 Implémenter le rendu conditionnel et le repeat dans `emitNode`
    - Générer `{expr && (...)}` pour `mode: "show"` et `{!expr && (...)}` pour `mode: "hide"`
    - Générer `.map((item, index) => (...))` avec la prop `key` issue de `repeatBinding.keyProp`
    - Passer la variable `item` (ou `repeatBinding.itemVar`) comme contexte aux enfants
    - _Exigences : 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4_

  - [ ] 5.5 Implémenter la génération des animations dans `emitNode`
    - Générer `Animated.Value`, `useEffect` pour `trigger: "onMount"`, handler pour `trigger: "onPress"`
    - Envelopper le composant animé dans `<Animated.View>` avec les styles d'interpolation
    - Respecter `animation.duration`, `animation.delay`, `animation.easing`
    - _Exigences : 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 5.6 Écrire le test de propriété P1 : Génération complète des fichiers d'écran
    - **Propriété 1 : Génération complète des fichiers d'écran**
    - **Valide : Exigences 1.1, 1.7**
    - Utiliser `arbProjectDocument` (N pages aléatoires) — vérifier que le résultat contient exactement N fichiers `.tsx` et N fichiers `.hook.ts`

  - [ ]* 5.7 Écrire le test de propriété P2 : Fidélité de l'arbre JSX
    - **Propriété 2 : Fidélité de l'arbre JSX**
    - **Valide : Exigences 1.2, 14.1**
    - Utiliser `arbTreeNode` (arbre aléatoire) — vérifier que chaque nœud apparaît exactement une fois dans le JSX généré

  - [ ]* 5.8 Écrire le test de propriété P3 : Mapping registryId → composant
    - **Propriété 3 : Mapping registryId → composant**
    - **Valide : Exigences 1.3, 1.4**
    - Pour tout `registryId` connu dans `COMPONENT_MAP`, vérifier que le JSX contient ce tag ; pour tout `registryId` inconnu, vérifier la présence de `<View>` et du commentaire

  - [ ]* 5.9 Écrire le test de propriété P7 : Génération correcte des useState
    - **Propriété 7 : Génération correcte des useState**
    - **Valide : Exigences 4.1, 4.2, 4.3**
    - Utiliser `arbPageState` (N entrées aléatoires) — vérifier que le hook contient exactement N appels `useState` avec les bons types et valeurs initiales

  - [ ]* 5.10 Écrire le test de propriété P8 : Génération des handlers d'événements
    - **Propriété 8 : Génération des handlers d'événements**
    - **Valide : Exigences 5.1, 5.2**
    - Pour tout `TreeNode` avec M événements non vides, vérifier que le hook contient M fonctions handler et que le JSX passe chaque handler comme prop

  - [ ]* 5.11 Écrire le test de propriété P9 : Round-trip des actions
    - **Propriété 9 : Round-trip des actions**
    - **Valide : Exigences 5.3–5.10**
    - Pour chaque type d'action connu, vérifier que le code généré contient le pattern TypeScript attendu

  - [ ]* 5.12 Écrire le test de propriété P10 : Génération correcte du repeat
    - **Propriété 10 : Génération correcte du repeat**
    - **Valide : Exigences 6.1–6.4, 14.3**
    - Pour tout `TreeNode` avec `repeatBinding`, vérifier la présence de `.map((item, index) => (...))`, de la prop `key`, et l'accès à `item` dans les enfants

  - [ ]* 5.13 Écrire le test de propriété P11 : Génération correcte du rendu conditionnel
    - **Propriété 11 : Génération correcte du rendu conditionnel**
    - **Valide : Exigences 7.1–7.3, 14.4**
    - Pour `mode: "show"`, vérifier `{expr && (...)}` ; pour `mode: "hide"`, vérifier `{!expr && (...)}`

- [ ] 6. Checkpoint — Vérifier que le ScreenEmitter compile et que les tests passent
  - S'assurer que tous les tests passent, poser des questions à l'utilisateur si nécessaire.

- [ ] 7. Implémenter le NavigationEmitter
  - [ ] 7.1 Créer `studio/engine/codegen/emitters/navigation.ts` avec les fonctions `emitNavigation`, `emitRootLayout` et `emitGroupLayout`
    - Refactoriser `generateRootLayout`, `generateTabsLayout`, `generateDrawerLayout`, `generateAuthGroupLayout`, `generateProtectedGroupLayout` de `project.ts` vers ce module
    - Implémenter le mapping `ScreenGroup.type` → structure Expo Router (tabs, stack, drawer, auth, protected)
    - Générer le `_layout.tsx` racine avec `FoundationProvider` et `SafeAreaProvider`
    - _Exigences : 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 8. Implémenter le ThemeEmitter
  - [ ] 8.1 Créer `studio/engine/codegen/emitters/theme.ts` avec les fonctions `emitThemeTokens` et `emitThemeIndex`
    - Refactoriser `generateFoundationConfig` de `project.ts` vers ce module
    - Résoudre les surcharges de thème (`ProjectDocument.themeOverrides`) et les fusionner avec les tokens de base
    - Générer `theme/tokens.ts` et `theme/index.ts` compatibles avec `FoundationProvider`
    - _Exigences : 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 9. Implémenter le ServiceEmitter
  - [ ] 9.1 Créer `studio/engine/codegen/emitters/service.ts` avec les fonctions `emitService`, `emitController` et `emitControllersIndex`
    - Refactoriser `generateServiceConfig` et `generateQueryController` de `project.ts` vers ce module
    - Générer un fichier `services/{serviceId}.ts` par `ServiceConfig` avec les méthodes `get`, `post`, `put`, `patch`, `del`
    - Générer un fichier `controllers/{queryName}.controller.ts` par `DataQuery` avec l'interface `{QueryName}State<T>`
    - Déclencher automatiquement la requête dans `useEffect` si `autoFetch: true`
    - Résoudre les expressions `$state.{name}` du corps de requête en paramètres du hook `refetch`
    - _Exigences : 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ]* 9.2 Écrire le test de propriété P12 : Génération complète des services et contrôleurs
    - **Propriété 12 : Génération complète des services et contrôleurs**
    - **Valide : Exigences 10.1–10.4**
    - Pour tout `ProjectDocument` avec S services et Q requêtes, vérifier que le `ServiceEmitter` produit exactement S fichiers `services/*.ts` et Q fichiers `controllers/*.controller.ts`

- [ ] 10. Refactoriser le CodeGenerator orchestrateur
  - [ ] 10.1 Mettre à jour `studio/engine/codegen/project.ts` pour déléguer aux nouveaux émetteurs
    - Remplacer les fonctions inline par des appels à `ScreenEmitter`, `NavigationEmitter`, `ThemeEmitter`, `ServiceEmitter`
    - Ajouter la génération du store global (`store/globalStore.ts`) avec `useGlobalStore` exposant toutes les `GlobalStateVar`
    - Gérer la persistance `AsyncStorage` pour `persist: "async"` et `expo-secure-store` pour `persist: "secure"`
    - Valider les imports générés avant de retourner le `FileSet`
    - _Exigences : 12.1, 12.2, 12.3, 12.4, 12.5, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [ ] 10.2 Mettre à jour `studio/engine/codegen/index.ts` pour exporter les nouveaux modules
    - Exporter `compile` depuis `resolvers/expression.ts`
    - Exporter `resolveBinding` depuis `resolvers/binding.ts`
    - Exporter `emitScreen`, `emitHook`, `emitNode` depuis `emitters/screen.ts`
    - Exporter `emitNavigation` depuis `emitters/navigation.ts`
    - Exporter `emitThemeTokens` depuis `emitters/theme.ts`
    - Exporter `emitService`, `emitController` depuis `emitters/service.ts`
    - _Exigences : 13.6, 13.7_

- [ ] 11. Intégrer le bouton "Générer" de la Topbar
  - [ ] 11.1 Vérifier que `studio/app/src/ui/Topbar.tsx` appelle correctement `generate()` depuis `useStudio`
    - La fonction `generate()` dans `StudioProvider.tsx` appelle déjà `POST /generate` — vérifier que le serveur (`studio/server/api.ts`) invoque bien `generateProject` du module refactorisé
    - Mettre à jour `studio/server/api.ts` si nécessaire pour utiliser le nouveau point d'entrée `generateProject` de `studio/engine/codegen/index.ts`
    - Vérifier que les fichiers générés sont écrits dans le dossier `generated/` du workspace
    - _Exigences : 13.7_

  - [ ] 11.2 Mettre à jour le label du bouton "Generate" en "Générer" dans `Topbar.tsx`
    - Modifier la chaîne `"Generate"` en `"Générer"` dans le composant `Topbar`
    - Mettre à jour le texte de chargement `"Génération…"` si nécessaire (déjà correct)
    - _Exigences : 13.7_

- [ ] 12. Checkpoint final — Vérifier l'intégration complète
  - S'assurer que tous les tests passent et que le bouton "Générer" produit un projet exécutable, poser des questions à l'utilisateur si nécessaire.

## Notes

- Les tâches marquées `*` sont optionnelles et peuvent être ignorées pour un MVP plus rapide
- Chaque tâche référence les exigences spécifiques pour la traçabilité
- Les tests de propriétés utilisent `fast-check` avec un minimum de 100 itérations par test
- Les tests unitaires et les tests de propriétés sont complémentaires — les deux sont nécessaires
- Le code existant dans `generator.ts` et `project.ts` doit être refactorisé, pas réécrit de zéro
