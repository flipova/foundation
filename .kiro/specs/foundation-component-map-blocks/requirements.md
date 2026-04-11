# Document de Requirements

## Introduction

Cette feature couvre l'intégration complète des composants `foundation` dans le Studio visuel (type Figma/low-code). Elle se décompose en trois axes :

1. **Audit et enregistrement des layouts manquants** : 8 layouts existent dans `foundation/layout/ui/` mais ne sont pas dans le `COMPONENT_MAP` du studio.
2. **Enregistrement des nouveaux blocs fonctionnels** : 23 blocs TSX existent dans `foundation/layout/ui/blocks/` mais ne sont ni dans le `COMPONENT_MAP`, ni dans le registre de métadonnées (`blocks/new.ts`), ni dans l'index des blocs.
3. **Exposition des props essentielles** : Chaque composant/bloc doit avoir ses props essentielles déclarées dans le fichier TSX ET dans le registre de métadonnées pour permettre l'interaction depuis le code ET depuis le studio visuel.

## Glossaire

- **COMPONENT_MAP** : Table de correspondance `Record<string, ComponentType>` dans `studio/app/src/renderer/componentMap.ts` qui mappe les IDs de registre aux composants React Native.
- **BlockMeta** : Type TypeScript décrivant les métadonnées d'un bloc (id, label, description, category, tags, props, slots, themeMapping).
- **LayoutMeta** : Type TypeScript décrivant les métadonnées d'un layout (id, label, description, category, slots, props, responsive, animated, tags).
- **Registre de blocs** : Fichier `foundation/layout/registry/blocks.ts` (et ses sous-fichiers `blocks/existing.ts`, `blocks/new.ts`) contenant les `BlockMeta` de tous les blocs.
- **Index des blocs** : Fichier `foundation/layout/ui/blocks/index.ts` exportant tous les composants blocs.
- **Studio** : Application React Native/Expo de design visuel low-code utilisant le `COMPONENT_MAP` pour rendre les composants.
- **Bloc fonctionnel** : Composant UI de haut niveau combinant plusieurs primitives, avec des props configurables et un thème adaptatif.
- **Layout** : Composant de mise en page structurant l'organisation visuelle d'un écran.
- **safe()** : Fonction wrapper du studio qui encapsule un composant dans un `ErrorBoundary` pour éviter les crashs.
- **applyDefaults** : Fonction utilitaire qui applique les valeurs par défaut du registre aux props d'un bloc.
- **getBlockMeta** : Fonction qui retourne le `BlockMeta` d'un bloc par son ID depuis le registre.

---

## Requirements

### Requirement 1 : Enregistrement des layouts manquants dans le COMPONENT_MAP

**User Story :** En tant que designer utilisant le Studio, je veux pouvoir utiliser tous les layouts disponibles dans `foundation`, afin de composer des écrans avec l'ensemble des mises en page disponibles.

#### Critères d'acceptation

1. THE `COMPONENT_MAP` SHALL contenir une entrée pour chacun des layouts suivants : `ParallaxLayout`, `SketchLayout`, `SwiperLayout`, `Swipe2ScreenLayout`, `SystemLayout`, `TutoLayout`, `DeckLayout`, `FlipLayout`.
2. WHEN un layout est ajouté au `COMPONENT_MAP`, THE `componentMap.ts` SHALL importer le composant depuis son chemin relatif dans `foundation/layout/ui/`.
3. WHEN un layout est ajouté au `COMPONENT_MAP`, THE `componentMap.ts` SHALL enregistrer le composant via la fonction `safe()` pour garantir la résilience aux erreurs de rendu.
4. IF un layout nécessite des dépendances natives (ex. `react-native-reanimated`, `react-native-gesture-handler`), THEN THE `COMPONENT_MAP` SHALL enregistrer le composant via `safe()` sans modification de la logique interne du layout.
5. THE `COMPONENT_MAP` SHALL maintenir l'ordre de déclaration existant (primitives → layouts → composants → blocs) lors de l'ajout des nouveaux layouts.

---

### Requirement 2 : Enregistrement des nouveaux blocs dans le registre de métadonnées

**User Story :** En tant que développeur intégrant des blocs dans le Studio, je veux que chaque nouveau bloc ait ses métadonnées déclarées dans `foundation/layout/registry/blocks/new.ts`, afin que le Studio puisse afficher et configurer ses props dans le panneau de design.

#### Critères d'acceptation

1. THE `blocks/new.ts` SHALL exporter un tableau `newBlocks: BlockMeta[]` contenant les métadonnées des 23 blocs suivants : `SocialLinksBlock`, `ProductCardBlock`, `NotificationItemBlock`, `PricingCardBlock`, `TransactionItemBlock`, `OnboardingSlideBlock`, `ChatBubbleBlock`, `CalendarEventBlock`, `FileItemBlock`, `ContactCardBlock`, `MapPinBlock`, `PasswordStrengthBlock`, `MediaPickerBlock`, `BannerBlock`, `CommentBlock`, `OTPInputBlock`, `TagInputBlock`, `StepperBlock`, `RatingBlock`, `QuoteBlock`, `TimelineBlock`, `CounterBlock`, `SegmentedControlBlock`.
2. WHEN un `BlockMeta` est déclaré dans `blocks/new.ts`, THE `BlockMeta` SHALL inclure les champs obligatoires : `id`, `label`, `description`, `category`, `tags`, `themeMapping`, `components`, `slots`, `props`.
3. WHEN un `BlockMeta` est déclaré, THE `props` array SHALL contenir au minimum toutes les props déclarées dans l'interface TypeScript du composant TSX correspondant, à l'exception des callbacks (`onPress`, `onChange`, etc.).
4. WHEN une prop est de type visuel (couleur, espacement, rayon, ombre), THE `BlockMeta` SHALL déclarer cette prop avec le type approprié (`color`, `spacing`, `radius`, `shadow`) pour permettre l'édition visuelle dans le Studio.
5. THE `blocks/new.ts` SHALL importer le type `BlockMeta` depuis `../../types`.
6. THE `blockRegistry` dans `foundation/layout/registry/blocks.ts` SHALL être mis à jour pour inclure les entrées de `newBlocks` (via spread ou import).

---

### Requirement 3 : Export des nouveaux blocs dans l'index

**User Story :** En tant que développeur consommant la librairie `foundation`, je veux que tous les blocs soient exportés depuis `foundation/layout/ui/blocks/index.ts`, afin de pouvoir les importer depuis un point d'entrée unique.

#### Critères d'acceptation

1. THE `foundation/layout/ui/blocks/index.ts` SHALL exporter les 23 nouveaux blocs avec la syntaxe `export { default as <NomDuBloc> } from "./<NomDuBloc>"`.
2. THE `index.ts` SHALL conserver les 11 exports existants sans modification.
3. WHEN un bloc est exporté depuis `index.ts`, THE export name SHALL correspondre exactement au nom du composant par défaut exporté dans le fichier TSX du bloc.

---

### Requirement 4 : Enregistrement des nouveaux blocs dans le COMPONENT_MAP

**User Story :** En tant que designer utilisant le Studio, je veux pouvoir glisser-déposer les 23 nouveaux blocs fonctionnels sur le canvas, afin de composer des écrans riches sans écrire de code.

#### Critères d'acceptation

1. THE `COMPONENT_MAP` SHALL contenir une entrée pour chacun des 23 nouveaux blocs.
2. WHEN un bloc est ajouté au `COMPONENT_MAP`, THE `componentMap.ts` SHALL importer le composant depuis `foundation/layout/ui/blocks/<NomDuBloc>`.
3. WHEN un bloc est ajouté au `COMPONENT_MAP`, THE `componentMap.ts` SHALL enregistrer le composant via la fonction `safe()`.
4. THE `COMPONENT_MAP` SHALL maintenir la section blocs en fin de fichier, après les composants.
5. WHEN le Studio rend un bloc non trouvé dans le `COMPONENT_MAP`, THE `getComponent` function SHALL retourner `null`.

---

### Requirement 5 : Cohérence entre les props TSX et les métadonnées de registre

**User Story :** En tant que designer utilisant le Studio, je veux que toutes les props configurables d'un bloc soient visibles et éditables dans le panneau de design, afin de personnaliser les blocs sans modifier le code source.

#### Critères d'acceptation

1. FOR ALL blocs dans `blocks/new.ts`, WHEN une prop est déclarée dans l'interface TypeScript du composant, THE `BlockMeta.props` SHALL contenir une entrée correspondante avec un `name` identique au nom de la prop TypeScript.
2. WHEN une prop a une valeur par défaut dans le composant TSX, THE `BlockMeta.props` entry SHALL déclarer cette même valeur dans le champ `default`.
3. WHEN une prop est de type `enum` (union de string literals), THE `BlockMeta.props` entry SHALL déclarer le type `"enum"` et lister toutes les valeurs possibles dans le champ `options`.
4. WHEN une prop est un callback (type `Function` ou `() => void`), THE `BlockMeta.props` SHALL ne pas inclure cette prop (les callbacks ne sont pas configurables depuis le Studio).
5. WHEN une prop référence une couleur du thème, THE `BlockMeta.props` entry SHALL déclarer `themeDefault` avec la clé de thème correspondante (ex. `"card"`, `"primary"`, `"foreground"`).
6. THE `applyDefaults` function SHALL pouvoir résoudre les valeurs par défaut de toutes les props déclarées dans `blocks/new.ts` sans erreur.

---

### Requirement 6 : Intégrité du registre consolidé

**User Story :** En tant que développeur maintenant la librairie `foundation`, je veux que le registre de blocs soit une source de vérité unique et cohérente, afin d'éviter les doublons et les incohérences entre les fichiers.

#### Critères d'acceptation

1. THE `foundation/layout/registry/blocks.ts` SHALL exporter une fonction `getBlockMeta(id: string): BlockMeta | undefined` capable de résoudre les métadonnées de tous les blocs (existants ET nouveaux).
2. FOR ALL blocs dans `blocks/new.ts`, THE `id` field SHALL correspondre exactement au nom du composant React (ex. `"SocialLinksBlock"`).
3. THE `blockRegistry` SHALL ne contenir aucun doublon d'`id`.
4. WHEN `getBlockMeta` est appelé avec l'ID d'un nouveau bloc, THE function SHALL retourner le `BlockMeta` correspondant sans retourner `undefined`.
5. IF `getBlockMeta` est appelé avec un ID inexistant, THEN THE function SHALL retourner `undefined`.

---

### Requirement 7 : Résilience au rendu dans le Studio

**User Story :** En tant que designer utilisant le Studio, je veux que les nouveaux blocs et layouts ne causent pas de crash de l'application studio en cas de props manquantes ou invalides, afin de maintenir une expérience de design fluide.

#### Critères d'acceptation

1. WHEN un bloc est rendu dans le Studio avec des props manquantes, THE `safe()` wrapper SHALL intercepter l'erreur et afficher un message d'erreur visuel à la place du crash.
2. WHEN `applyDefaults` est appelé sur un bloc avec des props partielles, THE function SHALL retourner un objet complet avec toutes les valeurs par défaut du `BlockMeta` appliquées.
3. WHEN un layout est rendu dans le Studio avec des props manquantes, THE `safe()` wrapper SHALL intercepter l'erreur et afficher un message d'erreur visuel.
4. IF un composant dans le `COMPONENT_MAP` lève une exception lors du rendu, THEN THE `ErrorBoundary` SHALL afficher `"Render error"` sans propager l'erreur à l'arbre de composants parent.
5. THE `COMPONENT_MAP` SHALL ne contenir aucune entrée avec une valeur `undefined` ou `null`.
