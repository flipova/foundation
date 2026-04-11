# Document de Spécifications — Génération de Code (studio-codegen)

## Introduction

Le système de génération de code de Flipova Studio produit un projet Expo/React Native
complet, autonome et immédiatement exécutable à partir de l'état courant du studio.
Le projet généré reproduit fidèlement toutes les pages, la navigation, les liaisons de
données, la logique événementielle, les animations, les services et le thème configurés
dans le studio. Il ne dépend d'aucun runtime studio et peut être lancé directement avec
`npx expo start`.

## Glossaire

- **CodeGenerator** : module principal qui orchestre la génération de l'ensemble des fichiers.
- **ScreenEmitter** : sous-module responsable de la génération d'un fichier `.tsx` par page.
- **BindingResolver** : sous-module qui traduit les expressions de liaison en getters/setters TypeScript.
- **ExpressionCompiler** : sous-module qui compile les expressions (`$state.x`, `$global.x`, `item.field`, etc.) en code TypeScript valide.
- **NavigationEmitter** : sous-module qui génère les fichiers `_layout.tsx` pour chaque groupe d'écrans Expo Router.
- **ThemeEmitter** : sous-module qui génère le fichier de tokens de thème utilisé dans les styles générés.
- **ServiceEmitter** : sous-module qui génère les fichiers de service typés et les hooks de requête.
- **TreeNode** : nœud de l'arbre de composants d'une page, tel que défini dans `engine/tree/types.ts`.
- **PageDocument** : document représentant une page, contenant un `TreeNode` racine et un tableau de `PageState`.
- **ProjectDocument** : document racine du projet, contenant les pages, services, requêtes, navigation, thème et état global.
- **PageState** : variable d'état locale à une page, typée (`string | number | boolean | object | array`).
- **GlobalStateVar** : variable d'état partagée entre toutes les pages.
- **DataQuery** : requête HTTP configurée dans le studio, associée à un service et à un alias d'état.
- **ScreenGroup** : groupe d'écrans Expo Router (`stack`, `tabs`, `drawer`, `auth`, `protected`).
- **Binding** : association entre une prop d'un composant et une expression dynamique (ex. `value → $state.email`).
- **RepeatBinding** : configuration d'itération sur un tableau pour rendre un nœud N fois.
- **ConditionalRender** : configuration d'affichage conditionnel d'un nœud selon une expression booléenne.
- **AnimationConfig** : configuration d'animation (preset, trigger, durée, easing).
- **ActionDef** : définition d'une action déclenchée par un événement (navigate, setState, callApi, etc.).
- **DesignToken** : valeur de style issue du système de thème (couleur, espacement, rayon, typographie, etc.).
- **ExpoRouter** : système de navigation basé sur le système de fichiers utilisé dans le projet généré.

---

## Exigences

### Exigence 1 : Génération des fichiers d'écran

**User Story :** En tant que développeur, je veux qu'un fichier `.tsx` soit généré pour chaque page du studio, afin d'obtenir un écran React Native fonctionnel et autonome.

#### Critères d'acceptation

1. THE **CodeGenerator** SHALL produire un fichier `app/{route}.tsx` pour chaque `PageDocument` du `ProjectDocument`.
2. WHEN un `TreeNode` possède des enfants, THE **ScreenEmitter** SHALL générer récursivement le JSX correspondant en respectant la hiérarchie de l'arbre.
3. THE **ScreenEmitter** SHALL mapper chaque `registryId` de `TreeNode` vers le composant `@flipova/foundation` correspondant.
4. IF un `registryId` ne correspond à aucun composant connu, THEN THE **ScreenEmitter** SHALL émettre un composant `<View>` de substitution avec un commentaire `{/* unknown: {registryId} */}`.
5. THE **ScreenEmitter** SHALL transmettre les `props` statiques résolues du `TreeNode` directement en tant que props JSX du composant généré.
6. THE **ScreenEmitter** SHALL transmettre les `styles` du `TreeNode` via la prop `style` du composant généré.
7. THE **CodeGenerator** SHALL générer un fichier `{route}.hook.ts` associé à chaque écran, contenant toute la logique d'état et les handlers.

---

### Exigence 2 : Système de liaisons (Bindings)

**User Story :** En tant que développeur, je veux que les liaisons entre les composants et l'état soient générées sous forme de getters et setters TypeScript, afin que les données circulent correctement dans l'application générée.

#### Critères d'acceptation

1. WHEN un `TreeNode` possède un champ `bindings`, THE **BindingResolver** SHALL générer pour chaque entrée `{prop: expression}` un getter JSX de la forme `{prop}={resolvedValue}`.
2. WHEN une liaison cible une prop de saisie (ex. `value`, `text`), THE **BindingResolver** SHALL également générer le setter correspondant (ex. `onChangeText={v => setState({email: v})}`).
3. THE **BindingResolver** SHALL résoudre les expressions `$state.{name}` en références à la variable d'état locale de la page correspondante.
4. THE **BindingResolver** SHALL résoudre les expressions `$global.{name}` en références à l'état global partagé.
5. THE **BindingResolver** SHALL résoudre les expressions `$query.{alias}` et `$state.{alias}` en références aux données de requête stockées dans l'état.
6. THE **BindingResolver** SHALL résoudre les expressions `item.{field}` en références à la variable d'item courant dans un contexte de répétition.
7. IF une expression de liaison est invalide ou non résoluble, THEN THE **BindingResolver** SHALL émettre un commentaire `{/* binding non résolu: {expression} */}` à la place de la prop.

---

### Exigence 3 : Compilation des expressions

**User Story :** En tant que développeur, je veux que toutes les expressions dynamiques du studio soient compilées en code TypeScript valide, afin que les conditions, les sources de répétition et les liaisons fonctionnent à l'exécution.

#### Critères d'acceptation

1. THE **ExpressionCompiler** SHALL compiler les expressions `$state.{name}` en accès à la variable d'état locale correspondante.
2. THE **ExpressionCompiler** SHALL compiler les expressions `$global.{name}` en accès à l'état global.
3. THE **ExpressionCompiler** SHALL compiler les expressions `$const.{key}` en références aux constantes du projet.
4. THE **ExpressionCompiler** SHALL compiler les expressions `item.{field}` en accès au champ de l'item courant dans un contexte de répétition.
5. THE **ExpressionCompiler** SHALL compiler les expressions `$node.{id}.{prop}` en références aux props résolues du nœud cible.
6. WHEN une expression contient un opérateur de comparaison ou logique (ex. `$state.count > 0`, `$state.isLogged && $state.hasProfile`), THE **ExpressionCompiler** SHALL la compiler en expression TypeScript booléenne équivalente.
7. IF une expression ne correspond à aucun pattern connu, THEN THE **ExpressionCompiler** SHALL l'émettre telle quelle entre accolades JSX avec un commentaire d'avertissement.

---

### Exigence 4 : Variables d'état de page → hooks useState

**User Story :** En tant que développeur, je veux que les variables d'état de page soient générées sous forme de hooks `useState` typés, afin que l'état local de chaque écran soit correctement initialisé.

#### Critères d'acceptation

1. THE **ScreenEmitter** SHALL générer un hook `useState` pour chaque entrée du tableau `PageDocument.state`.
2. THE **ScreenEmitter** SHALL typer chaque `useState` selon le champ `type` de la `PageState` (`string`, `number`, `boolean`, `object`, `array`).
3. THE **ScreenEmitter** SHALL initialiser chaque `useState` avec la valeur du champ `default` de la `PageState`.
4. WHEN le champ `scope` d'une `PageState` est `"app"`, THE **ScreenEmitter** SHALL référencer la variable depuis l'état global plutôt que de créer un `useState` local.
5. THE **ScreenEmitter** SHALL exporter les setters d'état depuis le hook de l'écran afin qu'ils soient accessibles dans les handlers d'événements.

---

### Exigence 5 : Événements et triggers → fonctions handler

**User Story :** En tant que développeur, je veux que les événements configurés sur les nœuds soient générés sous forme de fonctions handler TypeScript, afin que les interactions utilisateur déclenchent les bonnes actions dans l'application générée.

#### Critères d'acceptation

1. WHEN un `TreeNode` possède un champ `events`, THE **ScreenEmitter** SHALL générer une fonction handler nommée `handle{NodeId}_{eventName}` pour chaque événement non vide.
2. THE **ScreenEmitter** SHALL passer chaque handler comme prop JSX au composant correspondant (ex. `onPress={handle{NodeId}_onPress}`).
3. WHEN une `ActionDef` est de type `navigate`, THE **ScreenEmitter** SHALL générer un appel `router.push('{route}')` en utilisant le hook `useRouter` d'Expo Router.
4. WHEN une `ActionDef` est de type `setState`, THE **ScreenEmitter** SHALL générer un appel au setter d'état correspondant (ex. `setEmail(value)`).
5. WHEN une `ActionDef` est de type `callApi`, THE **ScreenEmitter** SHALL générer un appel au hook de contrôleur correspondant avec le corps de requête résolu.
6. WHEN une `ActionDef` est de type `toast`, THE **ScreenEmitter** SHALL générer un appel à la fonction de notification appropriée de la fondation.
7. WHEN une `ActionDef` est de type `alert`, THE **ScreenEmitter** SHALL générer un appel à `Alert.alert()` de React Native.
8. WHEN une `ActionDef` est de type `openURL`, THE **ScreenEmitter** SHALL générer un appel à `Linking.openURL()` de React Native.
9. WHEN une `ActionDef` de type `callApi` possède un champ `onSuccess`, THE **ScreenEmitter** SHALL générer les actions de succès dans le bloc `.then()` du contrôleur.
10. WHEN une `ActionDef` de type `callApi` possède un champ `onError`, THE **ScreenEmitter** SHALL générer les actions d'erreur dans le bloc `.catch()` du contrôleur.

---

### Exigence 6 : Répétition (RepeatBinding) → `.map()`

**User Story :** En tant que développeur, je veux que les nœuds configurés en mode répétition soient générés sous forme de `.map()` typé, afin que les listes de données soient rendues correctement dans l'application générée.

#### Critères d'acceptation

1. WHEN un `TreeNode` possède un champ `repeatBinding`, THE **ScreenEmitter** SHALL envelopper le rendu du nœud dans un appel `.map((item, index) => (...))` sur la source de données résolue.
2. THE **ScreenEmitter** SHALL résoudre le champ `repeatBinding.source` via l'**ExpressionCompiler** pour obtenir le tableau à itérer.
3. THE **ScreenEmitter** SHALL utiliser le champ `repeatBinding.keyProp` pour générer la prop `key` de chaque élément rendu (ex. `key={item.id}`).
4. THE **ScreenEmitter** SHALL passer la variable `item` comme contexte aux enfants du nœud répété, de sorte que les expressions `item.{field}` soient résolues correctement.
5. WHEN le champ `repeatBinding.itemVar` est défini, THE **ScreenEmitter** SHALL utiliser cette valeur comme nom de variable d'item à la place de `item`.
6. IF la source de données résolue n'est pas un tableau, THEN THE **ScreenEmitter** SHALL émettre un commentaire d'avertissement et rendre un fragment vide.

---

### Exigence 7 : Rendu conditionnel (ConditionalRender)

**User Story :** En tant que développeur, je veux que les conditions d'affichage configurées sur les nœuds soient générées sous forme de rendu conditionnel JSX, afin que les composants s'affichent ou se masquent selon l'état de l'application.

#### Critères d'acceptation

1. WHEN un `TreeNode` possède un champ `conditionalRender` avec `mode: "show"`, THE **ScreenEmitter** SHALL envelopper le rendu du nœud dans `{expression && (<Component .../>)}`.
2. WHEN un `TreeNode` possède un champ `conditionalRender` avec `mode: "hide"`, THE **ScreenEmitter** SHALL envelopper le rendu du nœud dans `{!expression && (<Component .../>)}`.
3. THE **ScreenEmitter** SHALL compiler l'expression du champ `conditionalRender.expression` via l'**ExpressionCompiler**.
4. IF l'expression conditionnelle est vide ou invalide, THEN THE **ScreenEmitter** SHALL rendre le nœud sans condition et émettre un commentaire d'avertissement.

---

### Exigence 8 : Animations → API Animated / Reanimated

**User Story :** En tant que développeur, je veux que les animations configurées sur les nœuds soient générées sous forme de code d'animation React Native, afin que les transitions visuelles fonctionnent dans l'application générée.

#### Critères d'acceptation

1. WHEN un `TreeNode` possède un champ `animation` avec `preset` différent de `"none"`, THE **ScreenEmitter** SHALL générer le code d'animation correspondant en utilisant l'API `Animated` de React Native.
2. THE **ScreenEmitter** SHALL générer une valeur `Animated.Value` initialisée à `0` pour chaque nœud animé.
3. WHEN le champ `animation.trigger` est `"onMount"`, THE **ScreenEmitter** SHALL déclencher l'animation dans un `useEffect` sans dépendances.
4. WHEN le champ `animation.trigger` est `"onPress"`, THE **ScreenEmitter** SHALL déclencher l'animation dans le handler `onPress` du nœud.
5. THE **ScreenEmitter** SHALL respecter les champs `animation.duration`, `animation.delay` et `animation.easing` dans la configuration de l'animation générée.
6. THE **ScreenEmitter** SHALL envelopper le composant animé dans un `Animated.View` avec les styles d'interpolation correspondant au preset.
7. WHERE le projet utilise `react-native-reanimated`, THE **ScreenEmitter** SHALL générer le code d'animation en utilisant les hooks `useSharedValue` et `useAnimatedStyle` de Reanimated à la place de l'API `Animated`.

---

### Exigence 9 : Structure de navigation → fichiers `_layout.tsx` Expo Router

**User Story :** En tant que développeur, je veux que la structure de navigation du studio soit générée sous forme de fichiers `_layout.tsx` Expo Router, afin que la navigation entre écrans fonctionne correctement dans l'application générée.

#### Critères d'acceptation

1. THE **NavigationEmitter** SHALL générer un fichier `app/_layout.tsx` racine contenant le `Stack` ou `Tabs` principal selon le type de navigation du `ProjectDocument`.
2. WHEN le `ProjectDocument` contient des `ScreenGroup`, THE **NavigationEmitter** SHALL générer un sous-dossier `app/{groupName}/` avec un fichier `_layout.tsx` pour chaque groupe.
3. WHEN un `ScreenGroup` est de type `"tabs"`, THE **NavigationEmitter** SHALL générer un `<Tabs>` Expo Router avec un `<Tabs.Screen>` par écran du groupe.
4. WHEN un `ScreenGroup` est de type `"stack"`, THE **NavigationEmitter** SHALL générer un `<Stack>` Expo Router avec un `<Stack.Screen>` par écran du groupe.
5. WHEN un `ScreenGroup` est de type `"auth"` ou `"protected"`, THE **NavigationEmitter** SHALL générer la logique de redirection appropriée dans le `_layout.tsx` du groupe.
6. THE **NavigationEmitter** SHALL placer chaque fichier d'écran dans le sous-dossier correspondant à son groupe de navigation.
7. THE **NavigationEmitter** SHALL générer le fichier `app/_layout.tsx` racine avec le `FoundationProvider` et le `SafeAreaProvider` encapsulant le navigateur principal.

---

### Exigence 10 : Services et requêtes → fichiers de service et hooks

**User Story :** En tant que développeur, je veux que les services et requêtes configurés dans le studio soient générés sous forme de fichiers de service typés et de hooks React, afin que les appels API fonctionnent dans l'application générée.

#### Critères d'acceptation

1. THE **ServiceEmitter** SHALL générer un fichier `services/{serviceId}.ts` pour chaque `ServiceConfig` du `ProjectDocument`.
2. THE **ServiceEmitter** SHALL générer les méthodes `get`, `post`, `put`, `patch` et `del` dans chaque fichier de service, avec l'URL de base et les en-têtes configurés.
3. THE **ServiceEmitter** SHALL générer un fichier `controllers/{queryName}.controller.ts` pour chaque `DataQuery` du `ProjectDocument`.
4. THE **ServiceEmitter** SHALL typer le hook de contrôleur avec une interface `{QueryName}State<T>` exposant `data`, `loading`, `error` et `refetch`.
5. WHEN une `DataQuery` possède `autoFetch: true`, THE **ServiceEmitter** SHALL déclencher automatiquement la requête dans un `useEffect` sans dépendances dans le hook de contrôleur.
6. WHEN une `DataQuery` possède un champ `body`, THE **ServiceEmitter** SHALL résoudre les expressions `$state.{name}` du corps de requête en paramètres du hook `refetch`.
7. THE **ServiceEmitter** SHALL générer un fichier `controllers/index.ts` exportant tous les hooks de contrôleur.

---

### Exigence 11 : Export du thème → tokens utilisés dans les styles générés

**User Story :** En tant que développeur, je veux que le thème configuré dans le studio soit exporté sous forme de tokens utilisables dans les styles générés, afin que l'apparence visuelle de l'application générée corresponde à celle du studio.

#### Critères d'acceptation

1. THE **ThemeEmitter** SHALL générer un fichier `theme/tokens.ts` exportant tous les tokens de design résolus pour le thème actif du `ProjectDocument`.
2. THE **ThemeEmitter** SHALL résoudre les surcharges de thème (`ProjectDocument.themeOverrides`) et les fusionner avec les tokens de base avant l'export.
3. WHEN un `TreeNode` possède une prop ou un style dont la valeur est un token de design (ex. `$color.primary`, `$spacing.4`), THE **ScreenEmitter** SHALL remplacer cette valeur par la référence au token exporté correspondant.
4. THE **ThemeEmitter** SHALL générer un fichier `theme/index.ts` exportant la configuration de thème complète compatible avec le `FoundationProvider`.
5. THE **CodeGenerator** SHALL importer et passer la configuration de thème générée au `FoundationProvider` dans le `_layout.tsx` racine.

---

### Exigence 12 : État global → store partagé

**User Story :** En tant que développeur, je veux que les variables d'état global du studio soient générées sous forme d'un store partagé, afin que les données accessibles depuis toutes les pages soient correctement initialisées et persistées.

#### Critères d'acceptation

1. THE **CodeGenerator** SHALL générer un fichier `store/globalStore.ts` contenant un hook `useGlobalStore` exposant toutes les `GlobalStateVar` du `ProjectDocument`.
2. THE **CodeGenerator** SHALL typer et initialiser chaque variable du store global selon les champs `type` et `default` de la `GlobalStateVar`.
3. WHEN une `GlobalStateVar` possède `persist: "async"`, THE **CodeGenerator** SHALL générer la logique de persistance via `AsyncStorage`.
4. WHEN une `GlobalStateVar` possède `persist: "secure"`, THE **CodeGenerator** SHALL générer la logique de persistance via `expo-secure-store`.
5. THE **ScreenEmitter** SHALL importer et utiliser `useGlobalStore` dans les écrans qui référencent des variables `$global.{name}`.

---

### Exigence 13 : Intégrité et exécutabilité du projet généré

**User Story :** En tant que développeur, je veux que le projet généré soit immédiatement exécutable avec `npx expo start`, afin de ne pas avoir à corriger manuellement des erreurs de compilation ou de configuration.

#### Critères d'acceptation

1. THE **CodeGenerator** SHALL générer un fichier `package.json` valide avec toutes les dépendances nécessaires à l'exécution du projet.
2. THE **CodeGenerator** SHALL générer un fichier `tsconfig.json` valide compatible avec Expo et React Native.
3. THE **CodeGenerator** SHALL générer un fichier `app.json` valide avec le `slug`, le `bundleId` et l'`orientation` issus du `ProjectDocument`.
4. THE **CodeGenerator** SHALL générer un fichier `babel.config.js` valide incluant le preset `babel-preset-expo`.
5. IF le `ProjectDocument` contient des `envVars`, THEN THE **CodeGenerator** SHALL générer un fichier `.env` avec les variables d'environnement non secrètes.
6. THE **CodeGenerator** SHALL s'assurer que tous les imports générés dans les fichiers `.tsx` et `.ts` sont valides et résolus.
7. WHEN la génération est terminée, THE **CodeGenerator** SHALL retourner la liste des fichiers générés avec leur chemin relatif.

---

### Exigence 14 : Propriété de round-trip (cohérence studio ↔ code généré)

**User Story :** En tant que développeur, je veux que le code généré soit sémantiquement équivalent à ce que le renderer du studio affiche, afin d'avoir la garantie que l'application générée se comporte comme la prévisualisation.

#### Critères d'acceptation

1. FOR ALL `TreeNode` rendus par le `NodeRenderer` du studio, THE **ScreenEmitter** SHALL générer un JSX produisant le même arbre de composants visuels.
2. FOR ALL expressions de liaison résolues par le `BindingResolver` du studio en prévisualisation, THE **ExpressionCompiler** SHALL générer du code TypeScript produisant la même valeur à l'exécution.
3. FOR ALL `RepeatBinding` rendus par le `RepeatRenderer` du studio, THE **ScreenEmitter** SHALL générer un `.map()` itérant sur la même source de données.
4. FOR ALL `ConditionalRender` évalués par le `NodeRenderer` du studio, THE **ScreenEmitter** SHALL générer une condition JSX produisant le même résultat booléen.
