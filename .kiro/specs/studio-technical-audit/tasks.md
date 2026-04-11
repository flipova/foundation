# Plan d'implémentation : Audit Technique Studio Flipova

## Vue d'ensemble

Corrections ordonnées par priorité P0 (bloquant/sécurité) → P1 (correctness) → P2 (dette).
Chaque tâche référence les requirements et propriétés du design document.

## Tâches

- [x] 1. P0 — Supprimer le `require()` dynamique dans `generator.ts`
  - [x] 1.1 Dans `serializeProp()` (~L530 de `studio/engine/codegen/generator.ts`), remplacer l'appel `const { resolveForCodegen } = require("../tree/expressions")` par l'utilisation directe de l'import statique `resolveForCodegen` déjà présent en tête de fichier
    - L'import statique `import { resolveForCodegen, resolveForResponse } from "../tree/expressions"` est déjà présent — utiliser cette référence directement
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.2 Écrire un test de propriété pour l'absence de `require()` dans le module
    - **Property 6 : Pas de `require()` dans le code généré**
    - **Validates: Requirements 2.1, 2.4**

- [x] 2. P0 — Valider les URLs `openURL` (preview + codegen)
  - [x] 2.1 Ajouter la fonction `isSafeUrl(url: string): boolean` dans `studio/engine/tree/expressions.ts`
    - Autoriser uniquement les protocoles `https:`, `http:`, `mailto:`, `tel:`
    - Utiliser `new URL(url)` dans un try/catch pour parser l'URL
    - Exporter la fonction depuis le module
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 1.2 Écrire un test de propriété pour `isSafeUrl`
    - **Property 9 : `isSafeUrl` bloque les protocoles non autorisés**
    - **Validates: Requirements 3.2, 3.3**

  - [x] 2.2 Modifier le `case 'openURL'` dans `executeAction()` de `studio/app/src/renderer/NodeRenderer.tsx`
    - Importer `isSafeUrl` depuis `../../../engine/tree/expressions`
    - Appeler `isSafeUrl(url)` avant `window.open` — bloquer et émettre `console.warn` si false
    - _Requirements: 3.4, 3.5_

  - [x] 2.3 Écrire un test de propriété pour le blocage en preview
    - **Property 10 : `openURL` en preview ne déclenche pas `window.open` si URL non sécurisée**
    - **Validates: Requirements 3.4, 3.5**

  - [x] 2.4 Modifier le `case "openURL"` dans `renderAction()` de `studio/engine/codegen/generator.ts`
    - Entourer `Linking.openURL(...)` d'un guard `if (isSafeUrl(...))` dans le code généré
    - _Requirements: 3.6_

  - [x] 2.5 Écrire un test de propriété pour le guard dans le code généré
    - **Property 8 : `openURL` dans le code généré est toujours précédé d'une validation**
    - **Validates: Requirements 3.6**

- [x] 3. P0 — Unifier les types dans `StudioProvider.tsx`
  - [x] 3.1 Supprimer les re-déclarations locales de `TreeNode`, `ActionDef`, `PageState`, `DataQuery`, `AnimationConfig` dans `studio/app/src/store/StudioProvider.tsx`
    - Ajouter l'import `import type { TreeNode, ActionDef, PageState, DataQuery, AnimationConfig, PageDocument as PageDoc, ProjectDocument as ProjectDoc } from '../../../engine/tree/types'`
    - Conserver les interfaces propres au store (`Variable`, `ScreenGroup`, `GlobalStateVar`, `AppConstant`, `EnvVar`, `RegItem`, `Reg`, `CustomTemplate`) qui n'existent pas dans `engine/tree/types.ts`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4. Checkpoint P0 — Vérifier que les corrections bloquantes compilent
  - S'assurer que TypeScript ne rapporte aucune erreur dans `generator.ts`, `NodeRenderer.tsx`, `StudioProvider.tsx` et `expressions.ts`
  - Demander à l'utilisateur si des questions se posent avant de continuer.

- [x] 5. P1 — Rendre `canUndo`/`canRedo` réactifs dans `StudioProvider.tsx`
  - [x] 5.1 Ajouter un state réactif `historyLen` dans `StudioProvider.tsx`
    - Remplacer le calcul inline `const canUndo = (historyRef.current.past.length > 0)` par un `useState<{ past: number; future: number }>({ past: 0, future: 0 })`
    - Appeler `setHistoryLen(...)` dans `mut()`, `undo()` et `redo()` après chaque modification de `historyRef.current`
    - Dériver `canUndo` et `canRedo` depuis `historyLen.past > 0` et `historyLen.future > 0`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 5.2 Écrire un test de propriété pour la réactivité undo/redo
    - **Property 11 : `canUndo` est réactif après mutations**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**

- [x] 6. P1 — Compléter `collectApiCalls` pour détecter les bindings `$state.alias`
  - [x] 6.1 Dans `collectApiCalls()` de `studio/engine/codegen/generator.ts`, ajouter la détection des bindings `$state.*` qui référencent un alias de query
    - Après la boucle sur `node.bindings` pour `$query.*`, ajouter une boucle similaire pour `$state.*`
    - Pour chaque binding `$state.alias`, chercher si une `DataQuery` a `q.alias === alias`
    - Si trouvée, ajouter la query dans `out` avec `autoFetch: query.autoFetch ?? false`
    - Faire de même pour `node.repeatBinding?.source` commençant par `$state.`
    - _Requirements: 5.3, 5.4, 5.5_

  - [x] 6.2 Écrire un test de propriété pour la détection des aliases
    - **Property 7 : Toutes les queries `$state.alias` sont importées dans le hook généré**
    - **Validates: Requirements 5.3, 5.4, 5.5**

- [x] 7. P1 — Supprimer le `nodePropsContext` JSON figé dans `generatePageHook`
  - [x] 7.1 Dans `studio/engine/codegen/generator.ts`, modifier la génération du hook pour ne plus injecter un snapshot JSON statique de `nodePropsContext`
    - Identifier où `generatePageHook` injecte `const nodePropsContext = {...}` (snapshot figé)
    - Remplacer les références `$node.id.prop` par la variable d'état correspondante si elle existe dans `stateKeys`
    - Si aucune variable d'état ne correspond, émettre un commentaire `/* $node non résolu: expr */` plutôt qu'une valeur figée
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 7.2 Écrire un test de propriété pour la réactivité de `resolveNode`
    - **Property 15 : `resolveNode` après `setState` retourne la nouvelle valeur**
    - **Validates: Requirements 4.2**

- [x] 8. Checkpoint P1 — Vérifier la correctness des corrections
  - S'assurer que TypeScript ne rapporte aucune erreur dans les fichiers modifiés
  - Demander à l'utilisateur si des questions se posent avant de continuer.

- [x] 9. P2 — Sécuriser `resolveForPreview` bare fields dans `expressions.ts`
  - [x] 9.1 Dans `resolveForPreview()` de `studio/engine/tree/expressions.ts`, ajouter une constante `LITERAL_VALUES` et exclure ces valeurs de la résolution bare field
    - Définir `const LITERAL_VALUES = new Set(['true', 'false', 'null', 'undefined', '0', '1', 'none', 'auto'])`
    - Dans la condition de résolution bare field (`if (itemContext && !expr.startsWith('$') ...)`), ajouter `&& !LITERAL_VALUES.has(expr)`
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 9.2 Écrire un test de propriété pour les littéraux
    - **Property 3 : Les littéraux ne sont pas résolus comme bare fields**
    - **Validates: Requirements 9.1, 9.2**

- [x] 10. P2 — Ajouter la fonction `stub()` dans `componentMap.ts`
  - [x] 10.1 Dans `studio/app/src/renderer/componentMap.ts`, créer une fonction `stub(realName: string, FallbackComp: ComponentType<any>)` qui remplace `safe()` pour les composants non implémentés
    - En mode DEV (`__DEV__`), émettre `console.warn('[componentMap] ${realName} n\'est pas implémenté...')`
    - Rendre un `View` avec bordure dashed amber + label `[stub: ${realName}]` + le composant fallback
    - Remplacer `BlurView: safe(GradientComp)`, `LottieAnimation: safe(ImageComp)`, `Tabs: safe(Box)`, `FlatList: safe(Box)` par `stub(...)`
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 10.2 Écrire un test de propriété pour les warnings des stubs
    - **Property 14 : Les stubs émettent un warning en DEV**
    - **Validates: Requirements 10.1**

- [x] 11. P2 — Améliorer `gid()` dans `StudioProvider.tsx`
  - [x] 11.1 Remplacer l'implémentation de `gid()` dans `studio/app/src/store/StudioProvider.tsx` par une version utilisant `crypto.randomUUID()` avec fallback
    - Si `typeof crypto !== 'undefined' && crypto.randomUUID`, utiliser `'n_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16)`
    - Sinon, fallback : `'n_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11)`
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 11.2 Écrire un test de propriété pour l'unicité de `gid()`
    - **Property 12 : `gid()` ne produit pas de collisions**
    - **Validates: Requirements 11.3**

- [x] 12. P2 — Nettoyer les résidus de corruption dans `expressions.ts`
  - [x] 12.1 Dans `studio/engine/tree/expressions.ts`, identifier et corriger les fragments tronqués ou corrompus
    - Vérifier les conditions contenant des string literals tronquées (ex: `expr.startsWith('` sans fermeture correcte)
    - S'assurer que toutes les branches `if/else` sont syntaxiquement correctes et sémantiquement cohérentes
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 12.2 Écrire des tests de régression pour `resolveForPreview` et `resolveForCodegen`
    - **Property 1 : `resolveForCodegen` est déterministe**
    - **Property 2 : `resolveForPreview` retourne toujours une valeur définie**
    - **Property 4 : `$state.x` → `x` en codegen**
    - **Property 5 : `$query.x` → `x` en codegen**
    - **Validates: Requirements 12.2, 12.3, 7.2, 7.4**

- [x] 13. Checkpoint final — Vérifier l'ensemble des corrections
  - S'assurer que tous les fichiers modifiés compilent sans erreur TypeScript
  - Demander à l'utilisateur si des questions se posent.

## Notes

- Les tâches marquées `*` sont optionnelles et peuvent être sautées pour un MVP rapide
- L'ordre P0 → P1 → P2 reflète la priorité de correction — ne pas réordonner
- Les checkpoints permettent de valider chaque palier avant de continuer
- Les property tests référencent les propriétés numérotées du design document
- La tâche 3 (unification des types) peut générer des erreurs TypeScript temporaires à résoudre dans la même tâche
