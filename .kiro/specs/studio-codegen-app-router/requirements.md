# Requirements Document

## Introduction

Le générateur de code du studio Flipova (`studio/engine/codegen/`) produit actuellement des projets Expo Router avec une structure "tabs" par défaut. Cette refonte couvre trois axes :

1. **App Router** : migrer la structure générée vers un App Router standard (fichier `app/_layout.tsx` racine + `Stack` par défaut, sans groupe `(tabs)` imposé), en conservant le support des groupes de navigation configurés.
2. **Compatibilité Snack Expo** : le projet généré doit pouvoir être chargé et exécuté dans [snack.expo.dev](https://snack.expo.dev) sans modification manuelle.
3. **Gestion de `@flipova/foundation`** : le package est publié sur GitHub Packages (registre privé). Le générateur doit produire soit une configuration `.npmrc` pointant vers ce registre, soit copier les sources `foundation/` dans un dossier `_flipova_modules/` comme fallback local.

## Glossaire

- **Generator** : le module `studio/engine/codegen/` (fichiers `generator.ts`, `project.ts`).
- **ProjectDocument** : la structure de données décrivant un projet Flipova (pages, navigation, services, etc.).
- **GeneratedFile** : un objet `{ path: string; content: string }` produit par le Generator.
- **App Router** : structure de navigation Expo Router basée sur le système de fichiers `app/`, avec `_layout.tsx` à chaque niveau.
- **Root Layout** : le fichier `app/_layout.tsx` racine qui enveloppe toute l'application dans les providers.
- **Screen Group** : un groupe de pages partageant un layout commun (`tabs`, `stack`, `drawer`, `auth`, `protected`).
- **Snack** : l'environnement d'exécution en ligne [snack.expo.dev](https://snack.expo.dev).
- **Snack Mode** : un flag de génération activant les contraintes de compatibilité Snack.
- **Foundation Package** : le package `@flipova/foundation` publié sur GitHub Packages.
- **Foundation Local Copy** : une copie des sources `foundation/` placée dans `_flipova_modules/@flipova/foundation/` dans le projet généré.
- **npmrc** : fichier `.npmrc` configurant le registre npm pour résoudre `@flipova/foundation`.

---

## Requirements

### Requirement 1 : Structure App Router par défaut

**User Story :** En tant que développeur utilisant Flipova Studio, je veux que le projet généré utilise une structure App Router standard, afin de pouvoir l'ouvrir directement dans un projet Expo sans configuration supplémentaire.

#### Acceptance Criteria

1. THE Generator SHALL produire un fichier `app/_layout.tsx` racine contenant un composant `RootLayout` qui enveloppe l'application dans `SafeAreaProvider` et `FoundationProvider`.
2. WHEN `ProjectDocument.navigation.type` est `"stack"` ou qu'aucun `screenGroup` n'est défini, THE Generator SHALL placer les fichiers de pages directement dans `app/` sans créer de groupe de navigation implicite.
3. WHEN `ProjectDocument.navigation.type` est `"tabs"` et qu'aucun `screenGroup` n'est défini, THE Generator SHALL créer un groupe `app/(tabs)/_layout.tsx` avec un composant `TabsLayout` utilisant `<Tabs>` d'expo-router.
4. WHEN `ProjectDocument.navigation.type` est `"drawer"` et qu'aucun `screenGroup` n'est défini, THE Generator SHALL créer un groupe `app/(drawer)/_layout.tsx` avec un composant `DrawerLayout` utilisant `<Drawer>` d'expo-router/drawer.
5. WHEN un `ScreenGroup` de type `"tabs"` est défini dans `ProjectDocument.screenGroups`, THE Generator SHALL créer `app/({groupName})/_layout.tsx` avec un `TabsLayout` listant uniquement les pages du groupe.
6. WHEN un `ScreenGroup` de type `"stack"` est défini, THE Generator SHALL créer `app/({groupName})/_layout.tsx` avec un `<Stack screenOptions={{ headerShown: false }} />`.
7. WHEN un `ScreenGroup` de type `"auth"` est défini, THE Generator SHALL créer `app/({groupName})/_layout.tsx` avec un `<Stack screenOptions={{ headerShown: false }} />` sans logique de redirection.
8. WHEN un `ScreenGroup` de type `"protected"` est défini, THE Generator SHALL créer `app/({groupName})/_layout.tsx` avec une vérification `useAuth()` et une redirection vers la page de login si l'utilisateur n'est pas authentifié.
9. THE Generator SHALL produire un `package.json` avec `"main": "expo-router/entry"` pour activer le système de fichiers App Router d'Expo.
10. THE Generator SHALL produire un `app.json` avec `"scheme"` défini et `"web": { "bundler": "metro", "output": "static" }`.

---

### Requirement 2 : Compatibilité Snack Expo

**User Story :** En tant que développeur, je veux pouvoir tester le projet généré directement dans Snack Expo, afin de partager un prototype fonctionnel sans avoir à installer de dépendances localement.

#### Acceptance Criteria

1. WHEN `GeneratorOptions.snackMode` est `true`, THE Generator SHALL produire un `package.json` dont toutes les versions de dépendances sont compatibles avec les versions supportées par Snack Expo (SDK 52 ou 53).
2. WHEN `GeneratorOptions.snackMode` est `true`, THE Generator SHALL exclure du `package.json` généré toute dépendance qui n'est pas disponible dans l'environnement Snack (ex. : `expo-secure-store`, `expo-file-system` si non supportés).
3. WHEN `GeneratorOptions.snackMode` est `true`, THE Generator SHALL produire un fichier `snack.json` contenant les métadonnées du projet (name, description, sdkVersion, dependencies).
4. WHEN `GeneratorOptions.snackMode` est `true` et que `@flipova/foundation` est résolu via le registre GitHub Packages, THE Generator SHALL utiliser la Foundation Local Copy à la place de l'import du registre privé.
5. WHEN `GeneratorOptions.snackMode` est `true`, THE Generator SHALL remplacer tous les imports `from "@flipova/foundation"` dans les fichiers générés par `from "./_flipova_modules/@flipova/foundation"` (chemin relatif depuis la racine du projet).
6. WHEN `GeneratorOptions.snackMode` est `true`, THE Generator SHALL remplacer tous les imports `from "@flipova/foundation/tokens"`, `from "@flipova/foundation/theme"`, `from "@flipova/foundation/config"`, `from "@flipova/foundation/layout"` par leurs équivalents dans `_flipova_modules/`.
7. IF `GeneratorOptions.snackMode` est `true` et qu'un fichier généré contient un import de module natif non supporté par Snack, THEN THE Generator SHALL émettre un avertissement dans les métadonnées du résultat (`GenerationResult.warnings`).
8. WHEN `GeneratorOptions.snackMode` est `false` ou absent, THE Generator SHALL se comporter exactement comme avant (aucun changement de comportement).

---

### Requirement 3 : Gestion de la dépendance `@flipova/foundation`

**User Story :** En tant que développeur, je veux que le projet généré puisse résoudre `@flipova/foundation` depuis GitHub Packages ou en fallback depuis une copie locale, afin de ne pas bloquer l'installation selon l'environnement.

#### Acceptance Criteria

1. WHEN `GeneratorOptions.foundationMode` est `"registry"`, THE Generator SHALL produire un fichier `.npmrc` contenant `@flipova:registry=https://npm.pkg.github.com` et `//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}`.
2. WHEN `GeneratorOptions.foundationMode` est `"registry"`, THE Generator SHALL conserver `"@flipova/foundation": "latest"` dans le `package.json` généré.
3. WHEN `GeneratorOptions.foundationMode` est `"local"`, THE Generator SHALL copier le contenu du dossier `foundation/` du monorepo dans `_flipova_modules/@flipova/foundation/` dans le projet généré.
4. WHEN `GeneratorOptions.foundationMode` est `"local"`, THE Generator SHALL produire un `_flipova_modules/@flipova/foundation/package.json` avec `"name": "@flipova/foundation"`, `"version": "0.0.0-local"`, et les champs `"main"`, `"exports"` pointant vers les fichiers TypeScript sources.
5. WHEN `GeneratorOptions.foundationMode` est `"local"`, THE Generator SHALL remplacer tous les imports `from "@flipova/foundation"` (et sous-chemins) dans les fichiers générés par des chemins relatifs vers `_flipova_modules/@flipova/foundation/`.
6. WHEN `GeneratorOptions.foundationMode` est `"local"`, THE Generator SHALL retirer `@flipova/foundation` du `package.json` généré (la dépendance est résolue localement).
7. IF `GeneratorOptions.foundationMode` est `"local"` et qu'un fichier source de `foundation/` ne peut pas être copié, THEN THE Generator SHALL lever une erreur descriptive indiquant le fichier manquant.
8. WHEN `GeneratorOptions.foundationMode` n'est pas spécifié, THE Generator SHALL utiliser `"registry"` comme valeur par défaut.
9. THE Generator SHALL exposer une interface `GeneratorOptions` avec les champs `snackMode?: boolean`, `foundationMode?: "registry" | "local"`, et `foundationSourcePath?: string` (chemin absolu vers le dossier `foundation/` du monorepo).

---

### Requirement 4 : Interface publique du générateur

**User Story :** En tant que développeur intégrant le générateur dans le serveur du studio, je veux une API claire et typée pour contrôler les options de génération, afin de pouvoir activer Snack Mode ou le mode local sans modifier le code interne.

#### Acceptance Criteria

1. THE Generator SHALL exporter une interface `GeneratorOptions` depuis `studio/engine/codegen/index.ts`.
2. THE Generator SHALL modifier la signature de `generateProject(project: ProjectDocument, options?: GeneratorOptions): GeneratedFile[]` pour accepter un second paramètre optionnel `options`.
3. WHEN `options` est absent ou `undefined`, THE Generator SHALL produire un résultat identique au comportement actuel (rétrocompatibilité garantie).
4. THE Generator SHALL exporter un type `GenerationResult` contenant `files: GeneratedFile[]` et `warnings: string[]`.
5. WHEN `generateProject` est appelé avec des options valides, THE Generator SHALL retourner un `GenerationResult` (et non plus un tableau brut `GeneratedFile[]`).
6. IF `generateProject` est appelé avec `foundationMode: "local"` et que `foundationSourcePath` n'est pas fourni, THEN THE Generator SHALL lever une erreur `"foundationSourcePath is required when foundationMode is 'local'"`.

---

### Requirement 5 : Propriétés de correction (round-trip et invariants)

**User Story :** En tant que développeur du studio, je veux que le générateur soit couvert par des tests de propriétés, afin de garantir que les transformations produisent toujours du code structurellement valide.

#### Acceptance Criteria

1. THE Generator SHALL produire, pour tout `ProjectDocument` valide, un ensemble de `GeneratedFile` dont chaque `path` est unique (invariant : pas de doublon de chemin).
2. THE Generator SHALL produire, pour tout `ProjectDocument` valide, au moins un fichier `app/_layout.tsx` (invariant : Root Layout toujours présent).
3. WHEN `snackMode` est `true`, THE Generator SHALL produire exactement un fichier `snack.json` (invariant : présence unique).
4. WHEN `foundationMode` est `"registry"`, THE Generator SHALL produire exactement un fichier `.npmrc` (invariant : présence unique).
5. WHEN `foundationMode` est `"local"`, THE Generator SHALL produire au moins un fichier dont le chemin commence par `_flipova_modules/@flipova/foundation/` (invariant : copie locale présente).
6. FOR ALL `GeneratedFile` produits avec `snackMode: true`, THE Generator SHALL garantir qu'aucun fichier ne contient l'import `from "@flipova/foundation"` (invariant : remplacement complet des imports).
7. FOR ALL `GeneratedFile` produits avec `foundationMode: "local"`, THE Generator SHALL garantir qu'aucun fichier de code (`.ts`, `.tsx`) ne contient l'import `from "@flipova/foundation"` (invariant : remplacement complet des imports).
