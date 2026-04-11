# Requirements Document

## Introduction

La librairie `foundation` expose des layouts React Native / Expo utilisés dans un Studio visuel (type Figma/low-code). Chaque layout est décrit dans un registre (`LayoutMeta`) qui liste ses props configurables. Actuellement, de nombreux layouts ont des valeurs hardcodées dans leur TSX qui ne sont pas déclarées dans le registre — elles sont donc invisibles et non-contrôlables depuis le Studio.

L'objectif de cette feature est d'atteindre un **contrôle total des props** : toute valeur qui impacte l'apparence ou le comportement perceptible d'un layout doit être exposée comme une `PropDescriptor` dans son `LayoutMeta`, avec un `default` qui reproduit exactement le comportement actuel (zéro breaking change).

Sont également couverts : l'ajout du type `"json"` au système de types de props, la création des entrées de registre manquantes pour `Swipe2ScreenLayout` et `SystemLayout`, et l'uniformisation du pattern `applyDefaults(rawProps, META, theme)` dans tous les layouts.

---

## Glossaire

- **LayoutMeta** : objet de description d'un layout dans le registre (`foundation/layout/registry/layouts.ts`), contenant `id`, `label`, `props`, `slots`, `constants`, etc.
- **PropDescriptor** : entrée dans `LayoutMeta.props` décrivant une prop configurable (nom, type, default, themeDefault, groupe).
- **PropType** : union de types acceptés par une `PropDescriptor` (`"string"`, `"number"`, `"boolean"`, `"color"`, `"spacing"`, `"radius"`, `"ratio"`, `"enum"`, `"padding"`, `"background"`, `"shadow"`, `"json"`).
- **applyDefaults** : fonction utilitaire (`foundation/layout/registry/defaults.ts`) qui fusionne les defaults statiques, les defaults thème et les props passées par l'utilisateur.
- **themeDefault** : clé d'un `ColorScheme` utilisée comme valeur par défaut d'une prop couleur (ex. `"primary"`, `"card"`, `"background"`).
- **constants** : champ de `LayoutMeta` réservé aux valeurs purement internes (spring configs complexes, distances d'exit) qui n'ont pas vocation à être exposées dans le Studio.
- **Studio** : application visuelle (`studio/app/`) qui lit le registre pour afficher les props configurables dans un panneau de design.
- **Registry** : ensemble des `LayoutMeta` définis dans `foundation/layout/registry/layouts.ts`.
- **hardcodé** : valeur écrite en dur dans le TSX d'un layout, non lue depuis ses props ni depuis son `LayoutMeta`.

---

## Requirements

### Requirement 1 : Extension du système de types — ajout de `"json"`

**User Story :** En tant que développeur de la librairie, je veux pouvoir déclarer des props de type tableau d'objets structurés dans le registre, afin que le Studio puisse les afficher et les éditer via un éditeur JSON.

#### Acceptance Criteria

1. THE `PropType` SHALL inclure la valeur littérale `"json"` dans son union de types.
2. WHEN une `PropDescriptor` a `type: "json"`, THE `applyDefaults` SHALL traiter sa valeur comme un objet opaque et l'inclure dans le résultat fusionné sans transformation.
3. THE `Registry` SHALL utiliser `type: "json"` pour les props `cellConfig` de `BentoLayout` et `slides` de `Swipe2ScreenLayout`.

---

### Requirement 2 : Registre et `applyDefaults` pour `Swipe2ScreenLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux configurer les couleurs et les seuils de `Swipe2ScreenLayout` depuis le panneau de design, afin de personnaliser l'apparence sans modifier le code source.

#### Acceptance Criteria

1. THE `Registry` SHALL contenir une entrée `LayoutMeta` avec `id: "Swipe2ScreenLayout"`.
2. THE `LayoutMeta` de `Swipe2ScreenLayout` SHALL déclarer les props suivantes avec leurs defaults reproduisant le comportement actuel :
   - `containerBackground` (color, default: `"#000"`)
   - `screenBackground` (color, default: `"#fff"`)
   - `swipeThreshold` (number, default: `100`)
   - `projectedScale` (ratio, default: `0.8`)
   - `animationDuration` (number, default: `300`)
   - `slides` (json, default: `[]`)
3. WHEN `Swipe2ScreenLayout` reçoit des props, THE `Swipe2ScreenLayout` SHALL appeler `applyDefaults(rawProps, META, theme)` pour résoudre les valeurs finales.
4. IF une prop déclarée dans le `LayoutMeta` n'est pas fournie par l'appelant, THEN THE `Swipe2ScreenLayout` SHALL utiliser la valeur `default` de cette prop.

---

### Requirement 3 : Registre et `applyDefaults` pour `SystemLayout` (`SystemUIWrapper`)

**User Story :** En tant qu'utilisateur du Studio, je veux configurer les props système de `SystemUIWrapper` depuis le panneau de design, afin de contrôler la barre de statut et la navigation sans modifier le code source.

#### Acceptance Criteria

1. THE `Registry` SHALL contenir une entrée `LayoutMeta` avec `id: "SystemLayout"`.
2. THE `LayoutMeta` de `SystemLayout` SHALL déclarer les props suivantes :
   - `rootBackgroundColor` (color, default: `"#0c3ddbff"`)
   - `statusBarContentStyle` (enum, options: `["light", "dark", "auto"]`, default: `"auto"`)
   - `edges` (json, default: `["top", "bottom", "left", "right"]`)
   - `navigationBarContentStyle` (enum, options: `["light", "dark"]`)
3. WHEN `SystemUIWrapper` reçoit des props, THE `SystemUIWrapper` SHALL appeler `applyDefaults(rawProps, META, theme)` pour résoudre les valeurs finales.

---

### Requirement 4 : Props manquantes dans `SketchLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux configurer la couleur de fond de `SketchLayout`, afin de l'adapter au thème de l'application.

#### Acceptance Criteria

1. THE `LayoutMeta` de `SketchLayout` SHALL déclarer la prop `background` (color, themeDefault: `"background"`).
2. WHEN `SketchLayout` est rendu, THE `SketchLayout` SHALL utiliser la valeur de `background` issue de `applyDefaults` comme couleur de fond du conteneur racine.

---

### Requirement 5 : Props manquantes dans `DeckLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler les couleurs, dimensions et comportements des cartes de `DeckLayout`, afin de personnaliser l'apparence du stack.

#### Acceptance Criteria

1. THE `LayoutMeta` de `DeckLayout` SHALL déclarer les props supplémentaires suivantes :
   - `cardBackground` (color, themeDefault: `"card"`)
   - `cardBorderRadius` (radius, default: `24`)
   - `containerWidth` (string, default: `"90%"`)
   - `containerHeight` (string, default: `"75%"`)
   - `peekCount` (number, default: `2`)
2. WHEN `DeckLayout` est rendu, THE `DeckLayout` SHALL utiliser `cardBackground` comme `backgroundColor` des cartes (recto et fond).
3. WHEN `DeckLayout` est rendu, THE `DeckLayout` SHALL utiliser `cardBorderRadius` comme `borderRadius` du style `card`.
4. WHEN `DeckLayout` est rendu, THE `DeckLayout` SHALL utiliser `containerWidth` et `containerHeight` comme dimensions du style `container`.
5. IF `peekCount` est fourni, THEN THE `DeckLayout` SHALL afficher ce nombre de cartes en arrière-plan.

---

### Requirement 6 : Props manquantes dans `FlipLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler les dimensions, le rayon de bordure et les durées d'animation de `FlipLayout`, afin de personnaliser l'expérience de flip.

#### Acceptance Criteria

1. THE `LayoutMeta` de `FlipLayout` SHALL déclarer les props supplémentaires suivantes :
   - `cardBorderRadius` (radius, default: `20`)
   - `cardAspectRatio` (number, default: `0.5625`) — correspond à `9/16`
   - `cardMaxHeight` (number, default: `750`)
   - `dezoomDuration` (number, default: `120`)
   - `flipDuration` (number, default: `320`)
   - `slideOutDuration` (number, default: `140`)
2. WHEN `FlipLayout` est rendu sur web, THE `FlipLayout` SHALL utiliser `cardAspectRatio` et `cardMaxHeight` pour le style `cardWrapperStyle`.
3. WHEN `FlipLayout` est rendu, THE `FlipLayout` SHALL utiliser `cardBorderRadius` comme `borderRadius` du `cardWrapperStyle`.
4. WHEN `FlipLayout` exécute une animation, THE `FlipLayout` SHALL utiliser `dezoomDuration`, `flipDuration` et `slideOutDuration` comme durées des phases d'animation (en remplacement des constantes).
5. IF `dezoomDuration`, `flipDuration` ou `slideOutDuration` sont déclarés dans `constants`, THEN THE `LayoutMeta` de `FlipLayout` SHALL retirer ces valeurs de `constants` pour les exposer uniquement dans `props`.

---

### Requirement 7 : Props manquantes dans `DashboardLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler les couleurs de fond de chaque zone de `DashboardLayout`, afin de personnaliser l'apparence du tableau de bord.

#### Acceptance Criteria

1. THE `LayoutMeta` de `DashboardLayout` SHALL déclarer les props supplémentaires suivantes :
   - `headerBackground` (color, themeDefault: `"card"`)
   - `sidebarBackground` (color, themeDefault: `"card"`)
   - `contentBackground` (color, themeDefault: `"card"`)
   - `footerBackground` (color, themeDefault: `"card"`)
2. WHEN `DashboardLayout` est rendu, THE `DashboardLayout` SHALL utiliser `headerBackground`, `sidebarBackground`, `contentBackground` et `footerBackground` comme couleurs de fond des zones correspondantes, en remplacement de `theme.card` hardcodé.

---

### Requirement 8 : Props manquantes dans `TutoLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler les couleurs d'accent, de texte et de fond de la bande de navigation de `TutoLayout`, afin de l'adapter au thème de l'application.

#### Acceptance Criteria

1. THE `LayoutMeta` de `TutoLayout` SHALL déclarer les props supplémentaires suivantes :
   - `accentColor` (color, themeDefault: `"primary"`)
   - `textBackground` (color, themeDefault: `"background"`)
   - `textColor` (color, themeDefault: `"foreground"`)
   - `mutedTextColor` (color, themeDefault: `"mutedForeground"`)
2. WHEN `TutoLayout` est rendu, THE `TutoLayout` SHALL utiliser `accentColor` pour les highlights de zones et le bouton "next", en remplacement de `theme.primary` hardcodé.
3. WHEN `TutoLayout` est rendu, THE `TutoLayout` SHALL utiliser `textBackground` pour le fond de la bande de navigation, en remplacement de `${theme.background}F8` hardcodé.
4. WHEN `TutoLayout` est rendu, THE `TutoLayout` SHALL utiliser `textColor` pour les textes principaux, en remplacement de `theme.foreground` hardcodé.
5. WHEN `TutoLayout` est rendu, THE `TutoLayout` SHALL utiliser `mutedTextColor` pour les textes secondaires, en remplacement de `${theme.foreground}99` hardcodé.
6. WHEN `TutoLayout` appelle `applyDefaults`, THE `TutoLayout` SHALL passer `theme` comme troisième argument afin que les `themeDefault` soient résolus.

---

### Requirement 9 : Props manquantes dans `ParallaxLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler les couleurs de fond global et par rangée de `ParallaxLayout`, afin de personnaliser l'apparence du layout parallaxe.

#### Acceptance Criteria

1. THE `LayoutMeta` de `ParallaxLayout` SHALL déclarer les props supplémentaires suivantes :
   - `background` (color, themeDefault: `"background"`)
   - `rowBackground` (color)
2. WHEN `ParallaxLayout` est rendu, THE `ParallaxLayout` SHALL utiliser `background` comme couleur de fond du conteneur racine.
3. WHEN `rowBackground` est fourni, THE `ParallaxLayout` SHALL appliquer cette couleur comme fond de chaque rangée.
4. WHEN `ParallaxLayout` appelle `applyDefaults`, THE `ParallaxLayout` SHALL passer `theme` comme troisième argument.

---

### Requirement 10 : Props manquantes dans `BottomDrawerLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler la couleur du handle, l'opacité du backdrop et l'échelle du contenu de `BottomDrawerLayout`, afin de personnaliser l'interaction avec le tiroir.

#### Acceptance Criteria

1. THE `LayoutMeta` de `BottomDrawerLayout` SHALL déclarer les props supplémentaires suivantes :
   - `handleColor` (color, themeDefault: `"primary"`)
   - `backdropOpacity` (ratio, default: `0.4`, min: `0`, max: `1`)
   - `contentScaleWhenOpen` (ratio, default: `0.95`, min: `0.5`, max: `1`)
2. WHEN `BottomDrawerLayout` est rendu, THE `BottomDrawerLayout` SHALL utiliser `handleColor` pour le bouton Fingerprint et l'indicateur de handle, en remplacement de `theme.primary` hardcodé.
3. WHEN `BottomDrawerLayout` est rendu, THE `BottomDrawerLayout` SHALL utiliser `backdropOpacity` dans l'interpolation du backdrop, en remplacement de `0.4` hardcodé.
4. WHEN `BottomDrawerLayout` est rendu, THE `BottomDrawerLayout` SHALL utiliser `contentScaleWhenOpen` dans l'interpolation de scale du contenu, en remplacement de `0.95` hardcodé.

---

### Requirement 11 : Props manquantes dans `TopDrawerLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler la couleur du handle, l'opacité du backdrop, l'échelle du contenu et le fond du bouton de fermeture de `TopDrawerLayout`.

#### Acceptance Criteria

1. THE `LayoutMeta` de `TopDrawerLayout` SHALL déclarer les props supplémentaires suivantes :
   - `handleColor` (color, themeDefault: `"border"`)
   - `backdropOpacity` (ratio, default: `0.4`, min: `0`, max: `1`)
   - `contentScaleWhenOpen` (ratio, default: `0.95`, min: `0.5`, max: `1`)
   - `closeButtonBackground` (color, themeDefault: `"muted"`)
2. WHEN `TopDrawerLayout` est rendu, THE `TopDrawerLayout` SHALL utiliser `handleColor` pour l'indicateur de handle, en remplacement de `theme.border` hardcodé.
3. WHEN `TopDrawerLayout` est rendu, THE `TopDrawerLayout` SHALL utiliser `backdropOpacity` dans l'interpolation du backdrop.
4. WHEN `TopDrawerLayout` est rendu, THE `TopDrawerLayout` SHALL utiliser `contentScaleWhenOpen` dans l'interpolation de scale du contenu.
5. WHEN `TopDrawerLayout` est rendu, THE `TopDrawerLayout` SHALL utiliser `closeButtonBackground` pour le fond du bouton de fermeture, en remplacement de `${theme.muted}20` hardcodé.

---

### Requirement 12 : Props manquantes dans `LeftDrawerLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler la couleur du handle, l'opacité du backdrop et l'échelle du contenu de `LeftDrawerLayout`.

#### Acceptance Criteria

1. THE `LayoutMeta` de `LeftDrawerLayout` SHALL déclarer les props supplémentaires suivantes :
   - `handleColor` (color, themeDefault: `"primary"`)
   - `backdropOpacity` (ratio, default: `0.4`, min: `0`, max: `1`)
   - `contentScaleWhenOpen` (ratio, default: `0.98`, min: `0.5`, max: `1`)
2. WHEN `LeftDrawerLayout` est rendu, THE `LeftDrawerLayout` SHALL utiliser `handleColor` pour le bouton Fingerprint et l'indicateur de handle, en remplacement de `theme.primary` hardcodé.
3. WHEN `LeftDrawerLayout` est rendu, THE `LeftDrawerLayout` SHALL utiliser `backdropOpacity` dans l'interpolation du backdrop.
4. WHEN `LeftDrawerLayout` est rendu, THE `LeftDrawerLayout` SHALL utiliser `contentScaleWhenOpen` dans l'interpolation de scale du contenu.

---

### Requirement 13 : Props manquantes dans `CrossTabLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler les paramètres de spring, la durée du long-press et l'échelle de drag de `CrossTabLayout`, afin de personnaliser le comportement du drag & drop.

#### Acceptance Criteria

1. THE `LayoutMeta` de `CrossTabLayout` SHALL déclarer les props supplémentaires suivantes :
   - `springDamping` (number, default: `18`)
   - `springStiffness` (number, default: `120`)
   - `longPressDuration` (number, default: `250`)
   - `dragScale` (ratio, default: `1.05`, min: `1`, max: `1.5`)
2. WHEN `CrossTabLayout` est rendu, THE `CrossTabLayout` SHALL construire le `springConfig` à partir de `springDamping` et `springStiffness` issus de `applyDefaults`, en remplacement des valeurs hardcodées dans `constants`.
3. WHEN une cellule est en cours de drag, THE `CrossTabLayout` SHALL utiliser `dragScale` comme valeur de scale, en remplacement de `1.05` hardcodé.
4. WHEN une cellule attend l'activation du long-press, THE `CrossTabLayout` SHALL utiliser `longPressDuration` comme durée, en remplacement de `250` hardcodé.
5. IF `springDamping` et `springStiffness` sont déclarés dans `constants`, THEN THE `LayoutMeta` de `CrossTabLayout` SHALL retirer ces valeurs de `constants` pour les exposer uniquement dans `props`.

---

### Requirement 14 : Props manquantes dans `SwiperLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler les paramètres de spring et les couleurs du compteur de cartes de `SwiperLayout`.

#### Acceptance Criteria

1. THE `LayoutMeta` de `SwiperLayout` SHALL déclarer les props supplémentaires suivantes :
   - `springDamping` (number, default: `12`)
   - `springStiffness` (number, default: `160`)
   - `cardCountBackground` (color, default: `"rgba(0,0,0,0.6)"`)
   - `cardCountTextColor` (color, default: `"#fff"`)
2. WHEN `SwiperLayout` est rendu, THE `SwiperLayout` SHALL construire le `springConfig` à partir de `springDamping` et `springStiffness` issus de `applyDefaults`.
3. WHEN `showCardCount` est `true`, THE `SwiperLayout` SHALL utiliser `cardCountBackground` et `cardCountTextColor` pour le badge de compteur, en remplacement des valeurs hardcodées.

---

### Requirement 15 : Props manquantes dans `ScrollLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler le padding du header et du footer de `ScrollLayout`, afin de personnaliser l'espacement interne.

#### Acceptance Criteria

1. THE `LayoutMeta` de `ScrollLayout` SHALL déclarer les props supplémentaires suivantes :
   - `headerPadding` (spacing, default: `4`)
   - `footerPadding` (spacing, default: `4`)
2. WHEN `ScrollLayout` rend le header, THE `ScrollLayout` SHALL utiliser `headerPadding` comme valeur de padding, en remplacement de `p={4}` hardcodé.
3. WHEN `ScrollLayout` rend le footer, THE `ScrollLayout` SHALL utiliser `footerPadding` comme valeur de padding, en remplacement de `p={4}` hardcodé.

---

### Requirement 16 : Uniformisation du pattern `applyDefaults` avec `theme`

**User Story :** En tant que développeur de la librairie, je veux que tous les layouts passent `theme` à `applyDefaults`, afin que les `themeDefault` soient résolus de manière uniforme.

#### Acceptance Criteria

1. THE `Registry` SHALL définir des `themeDefault` uniquement pour les props de type `"color"` ou `"background"`.
2. WHEN un layout appelle `applyDefaults`, THE layout SHALL passer `theme` comme troisième argument si son `LayoutMeta` contient au moins une prop avec `themeDefault`.
3. IF un layout appelle `applyDefaults` sans `theme` alors que son `LayoutMeta` contient des `themeDefault`, THEN THE layout SHALL être mis à jour pour passer `theme`.
4. THE `applyDefaults` SHALL produire un résultat où les props non fournies par l'appelant ont une valeur issue de `themeDefault` (si défini) ou de `default` (si défini), dans cet ordre de priorité : valeur explicite > `themeDefault` > `default`.

---

### Requirement 17 : Zéro breaking change sur les valeurs par défaut

**User Story :** En tant que développeur utilisant la librairie, je veux que l'ajout de nouvelles props dans le registre ne modifie pas le rendu visuel des layouts existants, afin de ne pas casser les applications en production.

#### Acceptance Criteria

1. FOR ALL nouvelles `PropDescriptor` ajoutées au registre, THE `default` ou `themeDefault` SHALL reproduire exactement la valeur précédemment hardcodée dans le TSX.
2. WHEN un layout est rendu sans fournir les nouvelles props, THE layout SHALL produire un rendu visuellement identique à celui produit avant l'ajout de ces props.
3. THE `LayoutMeta.constants` SHALL conserver uniquement les valeurs purement internes (spring configs complexes multi-paramètres, distances d'exit, facteurs d'échelle internes aux animations) qui n'ont pas d'impact direct sur l'apparence perceptible par l'utilisateur final.

---

### Requirement 18 : `BentoLayout` — prop `cellConfig` de type `"json"`

**User Story :** En tant qu'utilisateur du Studio, je veux configurer les spans de cellules de `BentoLayout` via le panneau de design, afin de personnaliser la disposition de la grille bento.

#### Acceptance Criteria

1. THE `LayoutMeta` de `BentoLayout` SHALL déclarer la prop `cellConfig` avec `type: "json"` et `default: []`.
2. WHEN `BentoLayout` reçoit `cellConfig`, THE `BentoLayout` SHALL utiliser cette valeur pour déterminer les spans de chaque cellule.
3. IF `cellConfig` est vide ou absent, THEN THE `BentoLayout` SHALL utiliser un layout par défaut équivalent au comportement actuel.
