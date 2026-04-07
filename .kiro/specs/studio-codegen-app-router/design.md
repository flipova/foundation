# Design Document — `studio-codegen-app-router`

## Overview

Ce document décrit la refonte du module `studio/engine/codegen/` pour couvrir trois axes :

1. **App Router** : consolider la génération de la structure Expo Router (Root Layout, groupes de navigation, `package.json` / `app.json` corrects).
2. **Snack Mode** : pipeline de post-processing qui rend le projet généré compatible avec [snack.expo.dev](https://snack.expo.dev).
3. **Foundation Mode** : deux stratégies de résolution de `@flipova/foundation` — `"registry"` (`.npmrc` GitHub Packages) ou `"local"` (copie des sources dans `_flipova_modules/`).

La signature publique évolue de :

```ts
generateProject(project: ProjectDocument): GeneratedFile[]
```

vers :

```ts
generateProject(project: ProjectDocument, options?: GeneratorOptions): GenerationResult
```

Le changement est rétrocompatible : sans `options`, le comportement est identique à l'existant.

---

## Architecture

### Vue d'ensemble du pipeline

```mermaid
flowchart TD
    A[ProjectDocument + GeneratorOptions] --> B[CoreGenerator]
    B --> C[App Router Builder\nproject.ts]
    C --> D[GeneratedFile[]]
    D --> E{options?}
    E -- snackMode=true --> F[SnackPostProcessor]
    E -- foundationMode=local --> G[LocalFoundationPostProcessor]
    E -- foundationMode=registry --> H[RegistryFoundationPostProcessor]
    F --> I[GenerationResult]
    G --> I
    H --> I
    E -- aucune option --> I
```

### Modules

| Fichier | Rôle |
|---|---|
| `studio/engine/codegen/project.ts` | Génération de la structure App Router (layouts, pages, config) |
| `studio/engine/codegen/generator.ts` | Génération du code des pages individuelles (inchangé) |
| `studio/engine/codegen/postprocess.ts` | **Nouveau** — pipeline de post-processing (Snack, Foundation) |
| `studio/engine/codegen/index.ts` | Point d'entrée public — exporte les types et `generateProject` |
| `studio/engine/codegen/naming.ts` | Utilitaires de nommage (inchangé) |

---

## Components and Interfaces

### `GeneratorOptions`

```ts
export interface GeneratorOptions {
  /** Active la compatibilité Snack Expo (SDK 52/53). Défaut : false */
  snackMode?: boolean;
  /**
   * Stratégie de résolution de @flipova/foundation.
   * "registry" → génère .npmrc pointant vers GitHub Packages (défaut)
   * "local"    → copie les sources foundation/ dans _flipova_modules/
   */
  foundationMode?: "registry" | "local";
  /**
   * Chemin absolu vers le dossier foundation/ du monorepo.
   * Obligatoire si foundationMode === "local".
   */
  foundationSourcePath?: string;
}
```

### `GenerationResult`

```ts
export interface GenerationResult {
  files: GeneratedFile[];
  warnings: string[];
}
```

### `GeneratedFile` (inchangé)

```ts
export interface GeneratedFile {
  path: string;
  content: string;
}
```

### Signature publique mise à jour

```ts
// index.ts
export function generateProject(
  project: ProjectDocument,
  options?: GeneratorOptions
): GenerationResult
```

La fonction retourne toujours un `GenerationResult`. Pour la rétrocompatibilité, les appelants qui ignoraient le retour n'ont rien à changer ; ceux qui consommaient `GeneratedFile[]` directement doivent accéder à `.files`.

### `SnackPostProcessor`

Fonction pure dans `postprocess.ts` :

```ts
function applySnackMode(
  files: GeneratedFile[],
  project: ProjectDocument
): { files: GeneratedFile[]; warnings: string[] }
```

Responsabilités :
- Remplacer les imports `@flipova/foundation` (et sous-chemins) par des chemins relatifs vers `_flipova_modules/`.
- Filtrer les dépendances incompatibles Snack du `package.json`.
- Générer `snack.json`.
- Émettre des avertissements pour les modules natifs non supportés.

### `LocalFoundationPostProcessor`

```ts
function applyLocalFoundation(
  files: GeneratedFile[],
  foundationSourcePath: string
): { files: GeneratedFile[]; warnings: string[] }
```

Responsabilités :
- Lire les fichiers du dossier `foundation/` (via `fs.readdirSync` récursif).
- Générer les `GeneratedFile` correspondants sous `_flipova_modules/@flipova/foundation/`.
- Générer `_flipova_modules/@flipova/foundation/package.json`.
- Remplacer les imports `@flipova/foundation` dans tous les fichiers `.ts`/`.tsx`.
- Retirer `@flipova/foundation` du `package.json` généré.

### `RegistryFoundationPostProcessor`

```ts
function applyRegistryFoundation(
  files: GeneratedFile[]
): GeneratedFile[]
```

Responsabilités :
- Ajouter le fichier `.npmrc` avec la configuration GitHub Packages.
- S'assurer que `@flipova/foundation: "latest"` est présent dans `package.json`.

---

## Data Models

### `ProjectDocument` (existant, extrait pertinent)

```ts
interface ProjectDocument {
  name: string;
  version: string;
  theme: string;
  navigation: NavigationConfig;
  pages: PageDocument[];
  services: ServiceConfig[];
  queries?: DataQuery[];
  screenGroups?: ScreenGroup[];   // nouveau champ utilisé par le générateur
  auth?: AuthConfig;
  capabilities?: Capability[];
  // ...
}

interface NavigationConfig {
  type: "stack" | "tabs" | "drawer";
  screens: ScreenConfig[];
}

interface ScreenGroup {
  name: string;
  type: "tabs" | "stack" | "auth" | "protected" | "drawer";
  screenIds: string[];
  redirectTo?: string;  // pour type="protected"
}
```

### Constantes Snack

```ts
// postprocess.ts
const SNACK_SDK_VERSION = "53.0.0";

/** Dépendances incompatibles avec Snack — exclues du package.json généré */
const SNACK_EXCLUDED_DEPS = new Set([
  "expo-secure-store",
  "expo-file-system",
  "expo-local-authentication",
  "expo-contacts",
]);

/** Modules natifs non supportés — déclenchent un warning */
const SNACK_UNSUPPORTED_NATIVE = new Set([
  "expo-secure-store",
  "expo-file-system",
  "expo-local-authentication",
  "expo-contacts",
]);

/** Versions de dépendances compatibles Snack SDK 53 */
const SNACK_COMPATIBLE_VERSIONS: Record<string, string> = {
  "expo": "~53.0.0",
  "react": "^19.0.0",
  "react-native": "~0.79.0",
  "expo-router": "~4.0.0",
  "react-native-safe-area-context": "~5.4.0",
  "react-native-screens": "~4.0.0",
  // ...
};
```

### Remplacement d'imports Foundation

Les patterns de remplacement sont définis comme une liste ordonnée de paires `[pattern, replacement]` :

```ts
const FOUNDATION_IMPORT_REPLACEMENTS: [RegExp, string][] = [
  [/@flipova\/foundation\/tokens/g,  "_flipova_modules/@flipova/foundation/tokens"],
  [/@flipova\/foundation\/theme/g,   "_flipova_modules/@flipova/foundation/theme"],
  [/@flipova\/foundation\/config/g,  "_flipova_modules/@flipova/foundation/config"],
  [/@flipova\/foundation\/layout/g,  "_flipova_modules/@flipova/foundation/layout"],
  [/@flipova\/foundation/g,          "_flipova_modules/@flipova/foundation"],
];
```

L'ordre est important : les sous-chemins sont remplacés avant le chemin racine pour éviter les doubles remplacements.

### Structure `_flipova_modules/@flipova/foundation/package.json` (mode local)

```json
{
  "name": "@flipova/foundation",
  "version": "0.0.0-local",
  "main": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./tokens": "./tokens/index.ts",
    "./theme": "./theme/index.ts",
    "./config": "./config/index.ts",
    "./layout": "./layout/index.ts"
  }
}
```

### `snack.json` (mode Snack)

```json
{
  "name": "<project.name>",
  "description": "Generated by Flipova Studio",
  "sdkVersion": "53.0.0",
  "dependencies": { /* dépendances filtrées */ }
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1 : Root Layout toujours présent

*Pour tout* `ProjectDocument` valide, le résultat de `generateProject` doit contenir exactement un fichier dont le `path` est `"app/_layout.tsx"`.

**Validates: Requirements 1.1, 5.2**

---

### Property 2 : Paths uniques

*Pour tout* `ProjectDocument` valide et toute combinaison d'options, l'ensemble des `path` dans `GenerationResult.files` ne doit contenir aucun doublon.

**Validates: Requirements 5.1**

---

### Property 3 : Navigation type → groupe implicite correct

*Pour tout* `ProjectDocument` sans `screenGroups` :
- si `navigation.type === "tabs"`, le résultat doit contenir `"app/(tabs)/_layout.tsx"` et aucun fichier de page ne doit être dans `"app/(drawer)/"`.
- si `navigation.type === "drawer"`, le résultat doit contenir `"app/(drawer)/_layout.tsx"` et aucun fichier de page ne doit être dans `"app/(tabs)/"`.
- si `navigation.type === "stack"`, aucun fichier de page ne doit être dans un sous-dossier de groupe `app/(...)`.

**Validates: Requirements 1.2, 1.3, 1.4**

---

### Property 4 : Tout ScreenGroup produit son layout

*Pour tout* `ProjectDocument` contenant un `ScreenGroup` de nom `N` et de type `T`, le résultat doit contenir un fichier `"app/(N)/_layout.tsx"`. De plus :
- si `T === "protected"`, le contenu de ce fichier doit contenir `"useAuth"`.
- si `T === "tabs"`, le contenu doit contenir `"<Tabs"`.
- si `T === "drawer"`, le contenu doit contenir `"<Drawer"`.
- si `T === "stack"` ou `T === "auth"`, le contenu doit contenir `"<Stack"`.

**Validates: Requirements 1.5, 1.6, 1.7, 1.8**

---

### Property 5 : `package.json` contient `"main": "expo-router/entry"`

*Pour tout* `ProjectDocument` valide, le fichier `"package.json"` généré doit contenir le champ `"main"` avec la valeur `"expo-router/entry"`.

**Validates: Requirements 1.9**

---

### Property 6 : `app.json` contient `scheme` et `web.bundler`

*Pour tout* `ProjectDocument` valide, le fichier `"app.json"` généré doit contenir un champ `expo.scheme` non vide et `expo.web.bundler === "metro"`.

**Validates: Requirements 1.10**

---

### Property 7 : `package.json` Snack-compatible

*Pour tout* `ProjectDocument` avec `snackMode: true`, le fichier `"package.json"` généré doit :
- utiliser les versions de dépendances définies dans `SNACK_COMPATIBLE_VERSIONS`,
- ne contenir aucune dépendance présente dans `SNACK_EXCLUDED_DEPS`.

**Validates: Requirements 2.1, 2.2**

---

### Property 8 : `snack.json` présent en Snack Mode

*Pour tout* `ProjectDocument` avec `snackMode: true`, le résultat doit contenir exactement un fichier `"snack.json"`.

**Validates: Requirements 2.3, 5.3**

---

### Property 9 : Aucun import `@flipova/foundation` en Snack Mode

*Pour tout* `ProjectDocument` avec `snackMode: true`, aucun fichier du résultat ne doit contenir la chaîne `from "@flipova/foundation"` (ni ses sous-chemins `@flipova/foundation/tokens`, etc.).

**Validates: Requirements 2.5, 2.6, 5.6**

---

### Property 10 : Warnings émis pour modules natifs non supportés en Snack Mode

*Pour tout* `ProjectDocument` avec `snackMode: true` dont les pages utilisent un module natif de `SNACK_UNSUPPORTED_NATIVE`, `GenerationResult.warnings` doit être non vide.

**Validates: Requirements 2.7**

---

### Property 11 : Rétrocompatibilité sans options

*Pour tout* `ProjectDocument`, `generateProject(p)` et `generateProject(p, undefined)` doivent produire des résultats dont les `files` sont identiques (même ensemble de paths et contenus).

**Validates: Requirements 2.8, 4.3**

---

### Property 12 : `.npmrc` présent en Registry Mode

*Pour tout* `ProjectDocument` avec `foundationMode: "registry"` (ou sans `foundationMode`), le résultat doit contenir exactement un fichier `".npmrc"` dont le contenu inclut `"npm.pkg.github.com"`, et `package.json` doit contenir `"@flipova/foundation"` dans ses dépendances.

**Validates: Requirements 3.1, 3.2, 5.4**

---

### Property 13 : Copie locale présente en Local Mode

*Pour tout* `ProjectDocument` avec `foundationMode: "local"`, le résultat doit contenir au moins un fichier dont le `path` commence par `"_flipova_modules/@flipova/foundation/"`, et `package.json` ne doit pas contenir `"@flipova/foundation"` dans ses dépendances.

**Validates: Requirements 3.3, 3.4, 3.6, 5.5**

---

### Property 14 : Aucun import `@flipova/foundation` en Local Mode

*Pour tout* `ProjectDocument` avec `foundationMode: "local"`, aucun fichier `.ts` ou `.tsx` du résultat ne doit contenir la chaîne `from "@flipova/foundation"` (ni ses sous-chemins).

**Validates: Requirements 3.5, 5.7**

---

### Property 15 : `foundationMode` absent équivaut à `"registry"`

*Pour tout* `ProjectDocument`, `generateProject(p, {})` et `generateProject(p, { foundationMode: "registry" })` doivent produire des résultats identiques.

**Validates: Requirements 3.8**

---

## Error Handling

### Erreurs de validation des options

| Condition | Comportement |
|---|---|
| `foundationMode: "local"` sans `foundationSourcePath` | Lève `Error("foundationSourcePath is required when foundationMode is 'local'")` |
| `foundationSourcePath` pointe vers un dossier inexistant | Lève `Error("Foundation source path not found: <path>")` |
| Un fichier source de `foundation/` ne peut pas être lu | Lève `Error("Cannot read foundation file: <path>")` |

### Warnings (non bloquants)

Les warnings sont collectés dans `GenerationResult.warnings` et n'interrompent pas la génération :

- En `snackMode: true`, si un fichier généré importe un module de `SNACK_UNSUPPORTED_NATIVE` : `"Warning: <module> is not supported in Snack environment (file: <path>)"`.

### Stratégie de gestion des erreurs dans `generateProject`

```ts
export function generateProject(
  project: ProjectDocument,
  options?: GeneratorOptions
): GenerationResult {
  // 1. Validation des options (erreurs synchrones immédiates)
  if (options?.foundationMode === "local" && !options.foundationSourcePath) {
    throw new Error("foundationSourcePath is required when foundationMode is 'local'");
  }

  // 2. Génération du core (App Router)
  let files = generateCoreFiles(project);

  // 3. Post-processing (peut lever des erreurs si fichiers source manquants)
  const warnings: string[] = [];
  const effectiveFoundationMode = options?.foundationMode ?? "registry";

  if (effectiveFoundationMode === "registry") {
    files = applyRegistryFoundation(files);
  } else {
    const result = applyLocalFoundation(files, options!.foundationSourcePath!);
    files = result.files;
    warnings.push(...result.warnings);
  }

  if (options?.snackMode) {
    const result = applySnackMode(files, project);
    files = result.files;
    warnings.push(...result.warnings);
  }

  return { files, warnings };
}
```

---

## Testing Strategy

### Approche duale

Le module `studio/engine/codegen/` sera couvert par deux types de tests complémentaires :

**Tests unitaires** (`__tests__/codegen.unit.test.ts`) :
- Exemples concrets de génération pour des `ProjectDocument` représentatifs.
- Cas d'erreur : `foundationMode: "local"` sans `foundationSourcePath`, chemin source invalide.
- Vérification du contenu exact de fichiers clés (`app/_layout.tsx`, `.npmrc`, `snack.json`).

**Tests de propriétés** (`__tests__/codegen.pbt.test.ts`) :
- Utilisation de [fast-check](https://github.com/dubzzz/fast-check) (déjà utilisé dans le projet, cf. `LogicPanel.items.pbt.test.tsx`).
- Minimum 100 itérations par propriété (configuration `numRuns: 100`).
- Chaque test référence la propriété du design via un commentaire de tag.

### Configuration fast-check

```ts
import fc from "fast-check";

// Arbitraire pour ProjectDocument minimal valide
const arbProject = fc.record({
  name: fc.string({ minLength: 1 }),
  version: fc.constant("1.0.0"),
  theme: fc.constant("light"),
  navigation: fc.record({
    type: fc.oneof(fc.constant("stack"), fc.constant("tabs"), fc.constant("drawer")),
    screens: fc.array(fc.record({ pageId: fc.string(), name: fc.string() })),
  }),
  pages: fc.array(/* ... */),
  services: fc.constant([]),
  queries: fc.constant([]),
});
```

### Mapping propriétés → tests

| Propriété | Type de test | Tag |
|---|---|---|
| Property 1 : Root Layout toujours présent | PBT | `Feature: studio-codegen-app-router, Property 1` |
| Property 2 : Paths uniques | PBT | `Feature: studio-codegen-app-router, Property 2` |
| Property 3 : Navigation type → groupe implicite | PBT | `Feature: studio-codegen-app-router, Property 3` |
| Property 4 : Tout ScreenGroup produit son layout | PBT | `Feature: studio-codegen-app-router, Property 4` |
| Property 5 : `package.json` main | PBT | `Feature: studio-codegen-app-router, Property 5` |
| Property 6 : `app.json` scheme + bundler | PBT | `Feature: studio-codegen-app-router, Property 6` |
| Property 7 : `package.json` Snack-compatible | PBT | `Feature: studio-codegen-app-router, Property 7` |
| Property 8 : `snack.json` présent | PBT | `Feature: studio-codegen-app-router, Property 8` |
| Property 9 : Aucun import foundation en Snack Mode | PBT | `Feature: studio-codegen-app-router, Property 9` |
| Property 10 : Warnings modules natifs | PBT | `Feature: studio-codegen-app-router, Property 10` |
| Property 11 : Rétrocompatibilité | PBT | `Feature: studio-codegen-app-router, Property 11` |
| Property 12 : `.npmrc` en Registry Mode | PBT | `Feature: studio-codegen-app-router, Property 12` |
| Property 13 : Copie locale présente | PBT | `Feature: studio-codegen-app-router, Property 13` |
| Property 14 : Aucun import foundation en Local Mode | PBT | `Feature: studio-codegen-app-router, Property 14` |
| Property 15 : `foundationMode` absent = `"registry"` | PBT | `Feature: studio-codegen-app-router, Property 15` |
| Erreur `foundationSourcePath` manquant | Unit | exemple |
| Erreur chemin source invalide | Unit | exemple |
