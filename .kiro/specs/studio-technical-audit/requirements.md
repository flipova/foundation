# Document de Requirements — Audit Technique Studio Flipova

## Introduction

Ce document dérive les exigences fonctionnelles et non-fonctionnelles de l'audit technique du studio Flipova, à partir du design document approuvé. Il couvre 15 problèmes classés P0 (bloquant/sécurité), P1 (correctness critique) et P2 (dette architecturale) répartis sur les modules `engine/tree/types.ts`, `engine/tree/expressions.ts`, `engine/codegen/generator.ts`, `app/src/store/StudioProvider.tsx`, `app/src/renderer/` et `app/src/renderer/componentMap.ts`.

---

## Glossaire

- **StudioProvider** : Composant React fournissant le contexte global du studio (état, mutations, historique).
- **Engine** : Ensemble des modules partagés `studio/engine/` (types, expressions, générateur de code).
- **TreeNode** : Type représentant un nœud dans l'arbre de composants d'une page.
- **ActionDef** : Type représentant une action déclenchable (navigate, setState, openURL, etc.).
- **PageDocument** : Type représentant une page complète avec son arbre de nœuds.
- **ProjectDocument** : Type représentant un projet complet avec ses pages, queries et services.
- **DataQuery** : Type représentant une requête API configurée dans le studio.
- **AnimationConfig** : Type représentant une configuration d'animation.
- **resolveForPreview** : Fonction d'`expressions.ts` résolvant les expressions pour le preview web.
- **resolveForCodegen** : Fonction d'`expressions.ts` résolvant les expressions pour la génération de code.
- **serializeProp** : Fonction de `generator.ts` sérialisant une prop en JSX.
- **collectApiCalls** : Fonction de `generator.ts` collectant les appels API référencés dans un arbre.
- **generatePageHook** : Fonction de `generator.ts` générant le hook React d'une page.
- **generatePageCode** : Fonction de `generator.ts` générant le composant React d'une page.
- **nodePropsContext** : Snapshot des props de nœuds injecté dans le hook généré.
- **isSafeUrl** : Fonction de validation d'URL autorisant uniquement les protocoles sûrs.
- **gid** : Fonction de génération d'identifiants uniques pour les nœuds.
- **componentMap** : Registre associant les identifiants de composants à leurs implémentations React.
- **Stub** : Composant de remplacement utilisé quand l'implémentation réelle n'est pas disponible en preview.
- **mut** : Fonction de mutation de l'arbre de nœuds dans StudioProvider.
- **historyRef** : Référence React stockant l'historique undo/redo.
- **itemContext** : Contexte d'item courant dans un composant de liste (Repeat).
- **Bare field** : Expression sans préfixe `$` tentée comme clé d'objet dans `itemContext`.
- **DEV** : Mode développement (variable `__DEV__` ou `NODE_ENV === 'development'`).

---

## Requirements

### Requirement 1 — Unification des types (P0)

**User Story :** En tant que développeur du studio, je veux que `StudioProvider.tsx` importe ses types depuis `engine/tree/types.ts`, afin d'éliminer les divergences silencieuses entre les définitions locales avec `any` et la source de vérité stricte.

#### Acceptance Criteria

1. THE **StudioProvider** SHALL import `TreeNode`, `ActionDef`, `PageState`, `DataQuery`, `AnimationConfig`, `PageDocument` and `ProjectDocument` exclusively from `engine/tree/types`.
2. WHEN **StudioProvider** is compiled, THE **TypeScript_Compiler** SHALL report zero type errors related to `TreeNode`, `ActionDef`, `PageState`, `DataQuery` or `AnimationConfig`.
3. THE **StudioProvider** SHALL NOT contain local re-declarations of `TreeNode`, `ActionDef`, `PageState`, `DataQuery` or `AnimationConfig`.
4. WHEN a type in `engine/tree/types` is updated, THE **StudioProvider** SHALL reflect the change without requiring a separate local update.

---

### Requirement 2 — Suppression du `require()` dynamique (P0)

**User Story :** En tant que développeur, je veux que `generator.ts` utilise uniquement des imports statiques ESM, afin d'éviter les ruptures de build et de permettre le tree-shaking.

#### Acceptance Criteria

1. THE **generator** module SHALL NOT contain any `require()` call in its compiled output.
2. WHEN `serializeProp` is called with a value starting with `$`, THE **generator** SHALL resolve it using the statically imported `resolveForCodegen` function.
3. WHEN `serializeProp` is called with any string value, THE **generator** SHALL produce the same result as it would with a dynamic `require()` call.
4. THE **generator** SHALL use only static ESM `import` statements at the top of the file.

---

### Requirement 3 — Validation des URLs dans `openURL` (P0)

**User Story :** En tant qu'utilisateur du studio, je veux que les actions `openURL` soient validées avant exécution, afin de prévenir les attaques XSS et les redirections ouvertes.

#### Acceptance Criteria

1. THE **Studio** SHALL provide a centralized `isSafeUrl` function that accepts a URL string and returns a boolean.
2. WHEN `isSafeUrl` is called with a URL whose protocol is `https:`, `http:`, `mailto:` or `tel:`, THE **isSafeUrl** function SHALL return `true`.
3. IF a URL has a protocol other than `https:`, `http:`, `mailto:` or `tel:`, THEN THE **isSafeUrl** function SHALL return `false`.
4. WHEN an `openURL` action is executed in preview, THE **NodeRenderer** SHALL call `isSafeUrl` before calling `window.open`.
5. IF `isSafeUrl` returns `false` for an `openURL` action in preview, THEN THE **NodeRenderer** SHALL NOT call `window.open` AND SHALL emit a `console.warn` message identifying the blocked URL.
6. WHEN `openURL` code is generated, THE **generator** SHALL wrap the `Linking.openURL` call with an `isSafeUrl` guard.

---

### Requirement 4 — Réactivité de `$node.*` dans le code généré (P1)

**User Story :** En tant qu'utilisateur final de l'application générée, je veux que les bindings `$node.id.prop` reflètent les valeurs courantes après un `setState`, afin que les composants se mettent à jour correctement en production.

#### Acceptance Criteria

1. WHEN `generatePageHook` generates code for a page containing `$node.id.prop` bindings, THE **generator** SHALL NOT inject a static JSON snapshot as `nodePropsContext`.
2. WHEN a `setState` action updates a prop bound via `$node.id.prop`, THE **generated_component** SHALL re-render with the updated value.
3. WHEN `resolveForCodegen` encounters a `$node.id.prop` expression linked to a known state variable, THE **generator** SHALL emit the corresponding state variable reference.
4. IF a `$node.id.prop` expression cannot be resolved to a state variable, THEN THE **generator** SHALL emit a commented placeholder rather than a stale snapshot value.

---

### Requirement 5 — Sémantique claire `$state.*` vs `$query.*` (P1)

**User Story :** En tant que développeur du studio, je veux que `$state.x` et `$query.x` aient des sémantiques distinctes et documentées, afin que le preview et le code généré se comportent de manière cohérente.

#### Acceptance Criteria

1. THE **Engine** SHALL define that `$state.x` always resolves to a React `useState` variable (état local ou réponse stockée via alias).
2. THE **Engine** SHALL define that `$query.x` always resolves to a query hook variable (données brutes du hook).
3. WHEN `collectApiCalls` scans a page tree, THE **generator** SHALL detect `$state.alias` bindings where `alias` matches a `DataQuery.alias` field.
4. WHEN a `$state.alias` binding is detected and the alias matches a query, THE **generator** SHALL include that query in the `collectApiCalls` result.
5. WHEN `generatePageHook` generates a hook for a page referencing `$state.alias`, THE **generator** SHALL import the corresponding query hook `use{capitalize(normalizeQueryName(query.name))}`.

---

### Requirement 6 — Réactivité de l'undo/redo (P1)

**User Story :** En tant qu'utilisateur du studio, je veux que les boutons Undo et Redo reflètent l'état réel de l'historique à chaque render, afin de ne pas cliquer sur un bouton désactivé qui devrait être actif.

#### Acceptance Criteria

1. WHEN at least one mutation has been applied, THE **StudioProvider** SHALL expose `canUndo === true`.
2. WHEN `undo` is called after at least one mutation, THE **StudioProvider** SHALL expose `canRedo === true`.
3. WHEN `undo` has been called as many times as mutations were applied, THE **StudioProvider** SHALL expose `canUndo === false`.
4. WHEN `redo` has been called as many times as `undo` was called, THE **StudioProvider** SHALL expose `canRedo === false`.
5. WHEN `canUndo` or `canRedo` changes value, THE **StudioProvider** SHALL trigger a React re-render so that UI components reflect the updated state.
6. THE **StudioProvider** SHALL NOT use `useRef` alone to track undo/redo history length for the purpose of computing `canUndo` and `canRedo`.

---

### Requirement 7 — Équivalence sémantique Preview / Codegen (P1)

**User Story :** En tant que développeur du studio, je veux que le preview et le code généré produisent les mêmes valeurs effectives pour chaque préfixe d'expression, afin d'éviter les surprises lors du déploiement.

#### Acceptance Criteria

1. WHEN `resolveForPreview("$state.x", context)` is called with a context where `context.queryContext.x === v`, THE **expressions** module SHALL return `v`.
2. WHEN `resolveForCodegen("$state.x")` is called, THE **expressions** module SHALL return the string `"x"` (the bare variable name).
3. WHEN `resolveForPreview("$query.xData", context)` is called, THE **expressions** module SHALL return `context.queryContext.xData`.
4. WHEN `resolveForCodegen("$query.xData")` is called, THE **expressions** module SHALL return the string `"xData"`.
5. THE **Engine** SHALL provide a documented mapping of each expression prefix (`$state`, `$query`, `$global`, `$const`) to its preview resolution and its codegen resolution.
6. THE **Engine** SHALL include regression tests verifying that `resolveForPreview` and `resolveForCodegen` produce semantically equivalent results for each prefix.

---

### Requirement 8 — Découpage de StudioProvider et debounce du save (P2)

**User Story :** En tant que développeur du studio, je veux que `StudioProvider` soit découpé en contextes spécialisés et que les sauvegardes soient debouncées, afin de réduire la complexité et les appels API inutiles.

#### Acceptance Criteria

1. THE **StudioProvider** SHALL be split into at least the following contexts: `StudioContext` (UI state), `ProjectContext` (project data), `HistoryContext` (undo/redo), and `EditorContext` (mutations).
2. WHEN N `updateProp` calls are made within a 500ms window, THE **EditorContext** SHALL trigger at most 1 API save call.
3. WHEN N `updateProp` calls are made within a 500ms window, THE **ProjectContext** SHALL reflect the state of the last `updateProp` call.
4. THE **EditorContext** `mut` function SHALL use a debounce of at least 500ms before calling the save API.
5. THE **StudioProvider** file SHALL NOT exceed 200 lines after the split.

---

### Requirement 9 — Sécurisation de `resolveForPreview` bare fields (P2)

**User Story :** En tant que développeur du studio, je veux que `resolveForPreview` ne résolve pas les valeurs littérales communes comme des clés d'`itemContext`, afin d'éviter des résolutions incorrectes silencieuses.

#### Acceptance Criteria

1. THE **expressions** module SHALL define a set of literal values that are never resolved as bare fields: `"true"`, `"false"`, `"null"`, `"undefined"`, `"0"`, `"1"`, `"none"`, `"auto"`.
2. WHEN `resolveForPreview` is called with a literal value from that set and an `itemContext` containing a matching key, THE **expressions** module SHALL return the literal string unchanged.
3. WHEN `resolveForPreview` is called with a bare field expression not in the literal set and `itemContext` contains a matching key, THE **expressions** module SHALL return the value from `itemContext`.

---

### Requirement 10 — Stubs visibles dans `componentMap` (P2)

**User Story :** En tant que développeur utilisant le studio, je veux que les composants non implémentés affichent un indicateur visuel et émettent un warning, afin de détecter immédiatement les fallbacks silencieux.

#### Acceptance Criteria

1. WHEN a stub component (`BlurView`, `LottieAnimation`, `Tabs`, `FlatList`) is rendered in DEV mode, THE **componentMap** SHALL emit a `console.warn` message containing the stub component name.
2. WHEN a stub component is rendered, THE **componentMap** SHALL render a visible border indicator (dashed, amber) around the fallback component.
3. WHEN a stub component is rendered, THE **componentMap** SHALL display a label identifying the stub name (e.g., `[stub: BlurView]`).
4. WHEN `getComponent` is called with an unknown component ID, THE **componentMap** SHALL return `null` without throwing an exception.

---

### Requirement 11 — Entropie suffisante pour `gid()` (P2)

**User Story :** En tant que développeur du studio, je veux que `gid()` génère des identifiants avec une entropie suffisante pour éviter les collisions, afin de prévenir la corruption de l'arbre lors de copies multiples.

#### Acceptance Criteria

1. WHEN `crypto.randomUUID` is available in the runtime environment, THE **gid** function SHALL use it as the primary source of entropy.
2. IF `crypto.randomUUID` is not available, THEN THE **gid** function SHALL use a fallback combining `Date.now().toString(36)` and at least 9 characters of `Math.random().toString(36)`.
3. WHEN `gid` is called N times (N ≤ 10^6), THE **gid** function SHALL produce N distinct values with a collision probability below 1/10^12.
4. THE **gid** function SHALL return a string prefixed with `"n_"`.

---

### Requirement 12 — Nettoyage des résidus dans `expressions.ts` (P2)

**User Story :** En tant que développeur du studio, je veux qu'`expressions.ts` ne contienne aucun fragment corrompu ou tronqué, afin de garantir la lisibilité et la maintenabilité du module.

#### Acceptance Criteria

1. THE **expressions** module SHALL NOT contain any truncated string literals or corrupted conditional fragments resulting from merge conflicts.
2. WHEN `resolveForPreview` is called with any non-empty string expression, THE **expressions** module SHALL return a defined value (not `undefined`).
3. WHEN `resolveForCodegen` is called with any string expression, THE **expressions** module SHALL return the same value on repeated calls with the same input (determinism).
4. THE **Engine** SHALL include regression tests for `resolveForPreview` and `resolveForCodegen` covering all expression prefixes (`$state`, `$query`, `$global`, `$const`, `$node`).

