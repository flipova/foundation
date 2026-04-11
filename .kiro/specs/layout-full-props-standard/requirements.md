# Requirements Document

## Introduction

La librairie `foundation` expose des layouts React Native / Expo utilisés dans un Studio visuel (type Figma/low-code). Chaque layout est décrit dans un registre (`LayoutMeta`) listant ses props configurables.

Un travail préalable (`layout-props-full-control`) a exposé les premières props manquantes. Cette feature complète ce travail en couvrant :

1. **Audit exhaustif** de tous les layouts pour identifier les valeurs hardcodées restantes non exposées dans le registre.
2. **Standardisation multi-item** : application du pattern `items` / `useStudioItems` / `previewItemCount` à tous les layouts concernés.
3. **Exposition complète** de toutes les props configurables dans le registre avec le bon `type`, `group`, `default` / `themeDefault`.
4. **Zéro breaking change** : chaque nouveau `default` reproduit exactement la valeur précédemment hardcodée.

---

## Glossaire

- **LayoutMeta** : objet de description d'un layout dans `foundation/layout/registry/layouts.ts`, contenant `id`, `label`, `props`, `slots`, `constants`, `previewItemCount`, etc.
- **PropDescriptor** : entrée dans `LayoutMeta.props` décrivant une prop configurable (nom, type, default, themeDefault, groupe).
- **PropType** : union de types acceptés (`"string"`, `"number"`, `"boolean"`, `"color"`, `"spacing"`, `"radius"`, `"ratio"`, `"enum"`, `"padding"`, `"background"`, `"shadow"`, `"json"`).
- **applyDefaults** : fonction utilitaire qui fusionne defaults statiques, defaults thème et props passées par l'utilisateur.
- **themeDefault** : clé d'un `ColorScheme` utilisée comme valeur par défaut d'une prop couleur.
- **useStudioItems** : hook standard pour les layouts multi-items — retourne des placeholders quand le tableau est vide.
- **previewItemCount** : champ de `LayoutMeta` indiquant le nombre de placeholders à afficher dans le Studio.
- **Multi-item layout** : layout dont le slot principal est un tableau d'items (`array: true`).
- **Studio** : application visuelle (`studio/app/`) qui lit le registre pour afficher les props configurables.
- **Registry** : ensemble des `LayoutMeta` définis dans `foundation/layout/registry/layouts.ts`.
- **hardcodé** : valeur écrite en dur dans le TSX d'un layout, non lue depuis ses props ni depuis son `LayoutMeta`.

---

## Requirements


### Requirement 1 : Standard multi-item — DeckLayout

**User Story :** En tant qu'utilisateur du Studio, je veux que `DeckLayout` accepte un prop `items` (tableau) comme source principale, afin que le Studio puisse injecter les items via le slot standard.

#### Acceptance Criteria

1. THE `DeckLayout` SHALL accepter une prop `items?: React.ReactNode[]` comme source principale d'items.
2. THE `DeckLayout` SHALL conserver `cards?: React.ReactNode[]` comme alias de `items` (backward compat).
3. THE `DeckLayout` SHALL conserver `children?: React.ReactNode | React.ReactNode[]` pour la compatibilité ascendante.
4. WHEN `DeckLayout` résout ses items, THE `DeckLayout` SHALL appliquer la priorité : `items` > `cards` > `children`.
5. THE `LayoutMeta` de `DeckLayout` SHALL déclarer le slot `{ name: "items", label: "Cartes", required: true, array: true }` (remplaçant `"cards"`).
6. THE `LayoutMeta` de `DeckLayout` SHALL déclarer `previewItemCount: 4`.
7. WHEN `DeckLayout` reçoit un tableau vide, THE `DeckLayout` SHALL appeler `useStudioItems` pour obtenir `previewItemCount` placeholders.

---

### Requirement 2 : Standard multi-item — FlipLayout

**User Story :** En tant qu'utilisateur du Studio, je veux que `FlipLayout` accepte un prop `items` (tableau) comme source principale, afin que le Studio puisse injecter les items via le slot standard.

#### Acceptance Criteria

1. THE `FlipLayout` SHALL accepter une prop `items?: React.ReactNode[]` comme source principale d'items.
2. THE `FlipLayout` SHALL conserver `cards?: React.ReactNode[]` comme alias de `items` (backward compat).
3. THE `FlipLayout` SHALL conserver `children?: React.ReactNode | React.ReactNode[]` pour la compatibilité ascendante.
4. WHEN `FlipLayout` résout ses items, THE `FlipLayout` SHALL appliquer la priorité : `items` > `cards` > `children`.
5. THE `LayoutMeta` de `FlipLayout` SHALL déclarer le slot `{ name: "items", label: "Faces recto", required: true, array: true }` (remplaçant `"cards"`).
6. THE `LayoutMeta` de `FlipLayout` SHALL déclarer `previewItemCount: 3`.
7. WHEN `FlipLayout` reçoit un tableau vide, THE `FlipLayout` SHALL appeler `useStudioItems` pour obtenir `previewItemCount` placeholders.

---

### Requirement 3 : Standard multi-item — SwiperLayout

**User Story :** En tant qu'utilisateur du Studio, je veux que `SwiperLayout` accepte un prop `items` (tableau) comme source principale, afin que le Studio puisse injecter les items via le slot standard.

#### Acceptance Criteria

1. THE `SwiperLayout` SHALL accepter une prop `items?: React.ReactNode[]` comme source principale d'items.
2. THE `SwiperLayout` SHALL conserver `slides?: React.ReactNode[]` comme alias de `items` (backward compat).
3. THE `SwiperLayout` SHALL conserver `children?: React.ReactNode | React.ReactNode[]` pour la compatibilité ascendante.
4. WHEN `SwiperLayout` résout ses items, THE `SwiperLayout` SHALL appliquer la priorité : `items` > `slides` > `children`.
5. THE `LayoutMeta` de `SwiperLayout` SHALL déclarer le slot `{ name: "items", label: "Slides", required: true, array: true }` (remplaçant `"slides"`).
6. THE `LayoutMeta` de `SwiperLayout` SHALL déclarer `previewItemCount: 4`.
7. WHEN `SwiperLayout` reçoit un tableau vide, THE `SwiperLayout` SHALL appeler `useStudioItems` pour obtenir `previewItemCount` placeholders.

---

### Requirement 4 : Standard multi-item — GridLayout, MasonryLayout, BentoLayout, CrossTabLayout, ParallaxLayout

**User Story :** En tant qu'utilisateur du Studio, je veux que tous les layouts multi-items restants suivent le même standard `items` / `useStudioItems` / `previewItemCount`, afin d'avoir une API cohérente.

#### Acceptance Criteria

1. THE `GridLayout` SHALL conserver `items` comme slot principal (`array: true`) et `children` comme backward compat — ce standard est déjà partiellement en place et doit être vérifié complet.
2. THE `MasonryLayout` SHALL conserver `items` comme slot principal (`array: true`) et `children` comme backward compat.
3. THE `BentoLayout` SHALL conserver `items` comme slot principal (`array: true`) et `children` comme backward compat.
4. THE `CrossTabLayout` SHALL conserver `items` comme slot principal (`array: true`) et `children` comme backward compat.
5. THE `ParallaxLayout` SHALL conserver `items` comme slot principal (`array: true`) et `children` comme backward compat.
6. FOR ALL layouts listés ci-dessus, THE `LayoutMeta` SHALL déclarer `previewItemCount` avec une valeur ≥ 3.
7. FOR ALL layouts listés ci-dessus, WHEN le tableau d'items est vide, THE layout SHALL appeler `useStudioItems` pour obtenir `previewItemCount` placeholders.

---

### Requirement 5 : Props manquantes dans `DeckLayout` — valeurs hardcodées restantes

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `DeckLayout` depuis le panneau de design, afin de personnaliser l'apparence du stack de cartes.

#### Acceptance Criteria

1. THE `LayoutMeta` de `DeckLayout` SHALL déclarer la prop `peekRotation` (number, group: `"layout"`, default: `0`) — valeur actuellement absente du registre bien que présente dans l'interface TSX.
2. THE `LayoutMeta` de `DeckLayout` SHALL déclarer la prop `direction` (enum, options: `["horizontal", "vertical"]`, group: `"behavior"`, default: `"horizontal"`) — présente dans l'interface TSX mais absente du registre.
3. THE `LayoutMeta` de `DeckLayout` SHALL déclarer la prop `background` (color, group: `"style"`, themeDefault: `"background"`) — le conteneur racine utilise `theme.background` implicitement.
4. WHEN `DeckLayout` est rendu, THE `DeckLayout` SHALL utiliser `peekRotation` comme angle de rotation des cartes en arrière-plan.
5. WHEN `DeckLayout` est rendu, THE `DeckLayout` SHALL utiliser `direction` pour déterminer l'axe de swipe.

---

### Requirement 6 : Props manquantes dans `FlipLayout` — valeurs hardcodées restantes

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler la perspective de flip et le seuil de swipe de `FlipLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `FlipLayout` SHALL déclarer la prop `flipPerspective` (number, group: `"layout"`, default: `1200`) — valeur hardcodée dans `containerStyle`.
2. THE `LayoutMeta` de `FlipLayout` SHALL déclarer la prop `swipeThreshold` (number, group: `"behavior"`, default: `40`) — valeur issue de `constants.swipeThreshold` qui doit être exposée comme prop.
3. WHEN `FlipLayout` est rendu, THE `FlipLayout` SHALL utiliser `flipPerspective` dans la propriété `perspective` du `containerStyle`.
4. WHEN `FlipLayout` évalue un geste, THE `FlipLayout` SHALL utiliser `swipeThreshold` comme seuil de déclenchement du swipe.
5. IF `swipeThreshold` est déclaré dans `constants`, THEN THE `LayoutMeta` de `FlipLayout` SHALL retirer cette valeur de `constants` pour l'exposer uniquement dans `props`.

---

### Requirement 7 : Props manquantes dans `SwiperLayout` — valeurs hardcodées restantes

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler le nombre de slides préchargées et les directions de swipe de `SwiperLayout`.

#### Acceptance Criteria

1. THE `LayoutMeta` de `SwiperLayout` SHALL déclarer la prop `preloadRange` (number, group: `"behavior"`, default: `2`) — valeur hardcodée dans le composant.
2. THE `LayoutMeta` de `SwiperLayout` SHALL déclarer la prop `swipeThreshold` (number, group: `"behavior"`, default: `40`) — valeur issue de `constants.swipeThreshold`.
3. WHEN `SwiperLayout` précharge les slides adjacentes, THE `SwiperLayout` SHALL utiliser `preloadRange` pour déterminer la plage de préchargement.
4. WHEN `SwiperLayout` évalue un geste, THE `SwiperLayout` SHALL utiliser `swipeThreshold` comme seuil de déclenchement.
5. IF `swipeThreshold` est déclaré dans `constants`, THEN THE `LayoutMeta` de `SwiperLayout` SHALL retirer cette valeur de `constants` pour l'exposer uniquement dans `props`.

---

### Requirement 8 : Props manquantes dans `GridLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `GridLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `GridLayout` SHALL vérifier que les props suivantes sont déclarées avec les bons types et defaults :
   - `columns` (number, group: `"layout"`) — sans default car auto-calculé par breakpoint
   - `cellHeight` (number, group: `"layout"`) — sans default car adaptatif au contenu
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `false`)
   - `padding` (spacing, group: `"layout"`, default: `0`)
   - `itemBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `itemBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `background` (color, group: `"style"`, default: `"transparent"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `compact` (boolean, group: `"behavior"`, default: `false`)
2. WHEN `GridLayout` est en mode compact, THE `GridLayout` SHALL utiliser `spacing: 2` en remplacement de la valeur normale.

---

### Requirement 9 : Props manquantes dans `MasonryLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `MasonryLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `MasonryLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `columns` (number, group: `"layout"`, default: `2`)
   - `spacing` (spacing, group: `"layout"`, default: `1`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `background` (color, group: `"style"`, default: `"transparent"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `itemBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `itemBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `padding` (padding, group: `"layout"`)
2. WHEN `MasonryLayout` distribue les items, THE `MasonryLayout` SHALL répartir les items en colonnes de manière alternée (index % columns).

---

### Requirement 10 : Props manquantes dans `BentoLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `BentoLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `BentoLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `spacing` (spacing, group: `"layout"`, default: `2`)
   - `itemBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `itemBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `maxWidth` (number, group: `"layout"`, default: `1200`)
   - `baseHeight` (number, group: `"layout"`, default: `200`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `cellConfig` (json, group: `"content"`, default: `[]`)
2. WHEN `BentoLayout` reçoit `cellConfig` vide, THE `BentoLayout` SHALL générer automatiquement une configuration bento par défaut.

---

### Requirement 11 : Props manquantes dans `CrossTabLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles et comportementales de `CrossTabLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `CrossTabLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `columns` (number, group: `"layout"`, default: `2`)
   - `spacing` (spacing, group: `"layout"`, default: `4`)
   - `itemBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `itemBorderRadius` (number, group: `"style"`, default: `28`)
   - `scrollEnabled` (boolean, group: `"behavior"`, default: `true`)
   - `springDamping` (number, group: `"behavior"`, default: `18`)
   - `springStiffness` (number, group: `"behavior"`, default: `120`)
   - `longPressDuration` (number, group: `"behavior"`, default: `250`)
   - `dragScale` (ratio, group: `"behavior"`, default: `1.05`, min: `1`, max: `1.5`)
2. THE `LayoutMeta` de `CrossTabLayout` SHALL déclarer la prop `background` (color, group: `"style"`, themeDefault: `"background"`) — le conteneur racine n'a pas de fond exposé.
3. WHEN `CrossTabLayout` est rendu, THE `CrossTabLayout` SHALL utiliser `background` comme couleur de fond du `GestureHandlerRootView`.

---

### Requirement 12 : Props manquantes dans `ParallaxLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `ParallaxLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `ParallaxLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `rowCount` (number, group: `"layout"`, default: `3`)
   - `itemWidth` (number, group: `"layout"`, default: `200`)
   - `spacing` (spacing, group: `"layout"`, default: `4`)
   - `itemSpacing` (number, group: `"layout"`, default: `12`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `rowBackground` (color, group: `"style"`)
   - `itemBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `itemBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `rowBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `alternateDirection` (boolean, group: `"behavior"`, default: `true`)
   - `bounces` (boolean, group: `"behavior"`, default: `false`)
   - `showScrollIndicator` (boolean, group: `"behavior"`, default: `false`)
   - `scrollEventThrottle` (number, group: `"behavior"`, default: `16`)
2. THE `LayoutMeta` de `ParallaxLayout` SHALL déclarer `previewItemCount: 9` (rowCount × 3 items par rangée).

---


### Requirement 13 : Props manquantes dans `RootLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `RootLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `RootLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `padding` (spacing, group: `"layout"`, default: `0`)
   - `justifyContent` (enum, group: `"layout"`, default: `"flex-start"`, options: `["flex-start","center","flex-end","space-between","space-around","space-evenly"]`)
   - `alignItems` (enum, group: `"layout"`, default: `"stretch"`, options: `["stretch","flex-start","center","flex-end","baseline"]`)
   - `flexDirection` (enum, group: `"layout"`, default: `"column"`, options: `["column","row"]`)
   - `gap` (number, group: `"layout"`, default: `0`)
2. WHEN `RootLayout` est rendu, THE `RootLayout` SHALL utiliser `padding` multiplié par 4 comme valeur de padding en pixels (reproduisant le comportement actuel `padding * 4`).

---

### Requirement 14 : Props manquantes dans `VoidLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `VoidLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `VoidLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `padding` (padding, group: `"layout"`)
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `centerContent` (boolean, group: `"layout"`, default: `false`)
   - `showBorder` (boolean, group: `"style"`, default: `false`)
2. WHEN `showBorder` est `true`, THE `VoidLayout` SHALL appliquer `borderWidth: 1` et `borderColor: theme.border` au conteneur.

---

### Requirement 15 : Props manquantes dans `CenteredLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `CenteredLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `CenteredLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `maxWidth` (number, group: `"layout"`, default: `500`)
   - `padding` (spacing, group: `"layout"`, default: `4`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `cardBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `borderRadius` (radius, group: `"style"`, default: `"3xl"`)
   - `shadowed` (boolean, group: `"style"`, default: `false`)
2. THE `LayoutMeta` de `CenteredLayout` SHALL déclarer la prop `mobilePadding` (spacing, group: `"layout"`, default: `4`) — le composant utilise `p={isMobile ? 4 : 6}` hardcodé pour le `Center`.
3. THE `LayoutMeta` de `CenteredLayout` SHALL déclarer la prop `desktopPadding` (spacing, group: `"layout"`, default: `6`) — valeur hardcodée `p={6}` sur desktop.
4. WHEN `CenteredLayout` est rendu sur mobile, THE `CenteredLayout` SHALL utiliser `mobilePadding` pour le padding du `Center`.
5. WHEN `CenteredLayout` est rendu sur desktop, THE `CenteredLayout` SHALL utiliser `desktopPadding` pour le padding du `Center`.

---

### Requirement 16 : Props manquantes dans `AuthLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `AuthLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `AuthLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `brandingBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `background` (background, group: `"style"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `brandingRatio` (ratio, group: `"layout"`, default: `0.5`, min: `0`, max: `1`)
   - `padding` (spacing, group: `"layout"`, default: `5`)
   - `shadowed` (boolean, group: `"style"`, default: `true`)
2. THE `LayoutMeta` de `AuthLayout` SHALL déclarer la prop `formMaxWidth` (number, group: `"layout"`, default: `520`) — valeur hardcodée `maxWidth={520}` dans le `Stack` du formulaire.
3. THE `LayoutMeta` de `AuthLayout` SHALL déclarer la prop `formScrollPaddingY` (spacing, group: `"layout"`, default: `8`) — valeur hardcodée `py={8}` dans le `Scroll`.
4. THE `LayoutMeta` de `AuthLayout` SHALL déclarer la prop `formScrollPaddingX` (spacing, group: `"layout"`, default: `4`) — valeur hardcodée `px={4}` dans le `Scroll`.
5. WHEN `AuthLayout` est rendu, THE `AuthLayout` SHALL utiliser `formMaxWidth` comme `maxWidth` du `Stack` de formulaire.
6. WHEN `AuthLayout` est rendu, THE `AuthLayout` SHALL utiliser `formScrollPaddingY` et `formScrollPaddingX` comme padding du `Scroll`.

---

### Requirement 17 : Props manquantes dans `DashboardLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `DashboardLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `DashboardLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `sidebarWidth` (number, group: `"layout"`, default: `260`)
   - `sidebarCollapsedWidth` (number, group: `"layout"`, default: `70`)
   - `headerHeight` (number, group: `"layout"`, default: `70`)
   - `footerHeight` (number, group: `"layout"`, default: `60`)
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `disableContentScroll` (boolean, group: `"behavior"`, default: `false`)
   - `headerBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `sidebarBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `contentBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `footerBackground` (color, group: `"style"`, themeDefault: `"card"`)
2. THE `LayoutMeta` de `DashboardLayout` SHALL déclarer la prop `headerPaddingX` (spacing, group: `"layout"`, default: `4`) — valeur hardcodée `px={4}` dans le header.
3. THE `LayoutMeta` de `DashboardLayout` SHALL déclarer la prop `mobileHeaderMinHeight` (number, group: `"layout"`, default: `60`) — valeur hardcodée `minHeight={60}` sur mobile.
4. WHEN `DashboardLayout` est rendu, THE `DashboardLayout` SHALL utiliser `headerPaddingX` comme padding horizontal du header.
5. WHEN `DashboardLayout` est rendu sur mobile, THE `DashboardLayout` SHALL utiliser `mobileHeaderMinHeight` comme `minHeight` du header.

---

### Requirement 18 : Props manquantes dans `ResponsiveLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `ResponsiveLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `ResponsiveLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `headerHeight` (number, group: `"layout"`, default: `60`)
   - `sidebarWidth` (number, group: `"layout"`, default: `260`)
   - `footerHeight` (number, group: `"layout"`, default: `60`)
   - `adaptiveMode` (enum, group: `"behavior"`, default: `"basic"`, options: `["basic","sidebar","full"]`)
   - `hideHeader` (boolean, group: `"behavior"`, default: `false`)
   - `hideFooter` (boolean, group: `"behavior"`, default: `false`)
   - `collapseFooterOnTablet` (boolean, group: `"behavior"`, default: `false`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `headerBackground` (color, group: `"style"`, themeDefault: `"background"`)
   - `sidebarBackground` (color, group: `"style"`, themeDefault: `"background"`)
   - `footerBackground` (color, group: `"style"`, themeDefault: `"background"`)
   - `contentBackground` (color, group: `"style"`)
   - `padding` (padding, group: `"layout"`)
   - `contentPadding` (padding, group: `"layout"`)
2. THE `LayoutMeta` de `ResponsiveLayout` SHALL déclarer la prop `mobileHeaderHeight` (number, group: `"layout"`, default: `56`) — valeur hardcodée `isMobile ? 56 : headerHeight`.
3. THE `LayoutMeta` de `ResponsiveLayout` SHALL déclarer la prop `tabletFooterHeight` (number, group: `"layout"`, default: `48`) — valeur hardcodée `isTabletRange && collapseFooterOnTablet ? 48 : footerHeight`.
4. THE `LayoutMeta` de `ResponsiveLayout` SHALL déclarer la prop `sidebarMaxWidth` (number, group: `"layout"`, default: `320`) — valeur hardcodée `Math.min(sidebarWidth, 320)`.
5. WHEN `ResponsiveLayout` est rendu sur mobile, THE `ResponsiveLayout` SHALL utiliser `mobileHeaderHeight` comme hauteur du header.
6. WHEN `collapseFooterOnTablet` est `true` et le breakpoint est tablette, THE `ResponsiveLayout` SHALL utiliser `tabletFooterHeight` comme hauteur du footer.
7. WHEN `ResponsiveLayout` affiche la sidebar, THE `ResponsiveLayout` SHALL limiter sa largeur à `sidebarMaxWidth`.

---


### Requirement 19 : Props manquantes dans `FlexLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `FlexLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `FlexLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `direction` (enum, group: `"layout"`, default: `"row"`, options: `["row","column"]`)
   - `wrap` (boolean, group: `"layout"`, default: `false`)
   - `spacing` (spacing, group: `"layout"`, default: `4`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `false`)
   - `padding` (padding, group: `"layout"`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
2. THE `LayoutMeta` de `FlexLayout` SHALL déclarer la prop `align` (enum, group: `"layout"`, default: `"stretch"`, options: `["stretch","flex-start","center","flex-end","baseline"]`) — prop `align` présente dans le TSX mais absente du registre.
3. THE `LayoutMeta` de `FlexLayout` SHALL déclarer la prop `justify` (enum, group: `"layout"`, default: `"flex-start"`, options: `["flex-start","center","flex-end","space-between","space-around","space-evenly"]`) — prop `justify` présente dans le TSX mais absente du registre.
4. WHEN `FlexLayout` est rendu, THE `FlexLayout` SHALL utiliser `align` comme `alignItems` et `justify` comme `justifyContent`.

---

### Requirement 20 : Props manquantes dans `SplitLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `SplitLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `SplitLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `leftWidth` (number, group: `"layout"`)
   - `ratio` (ratio, group: `"layout"`, default: `0.5`, min: `0`, max: `1`)
   - `orientation` (enum, group: `"layout"`, default: `"horizontal"`, options: `["horizontal","vertical"]`)
   - `hideLeftOnMobile` (boolean, group: `"behavior"`, default: `false`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `leftBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `rightBackground` (color, group: `"style"`, themeDefault: `"card"`)
2. THE `LayoutMeta` de `SplitLayout` SHALL déclarer la prop `leftBorderRadius` (radius, group: `"style"`, default: `"none"`) — le panneau gauche utilise `borderRadius` global mais pourrait avoir son propre rayon.
3. THE `LayoutMeta` de `SplitLayout` SHALL déclarer la prop `rightBorderRadius` (radius, group: `"style"`, default: `"none"`) — idem pour le panneau droit.

---

### Requirement 21 : Props manquantes dans `FooterLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `FooterLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `FooterLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `footerHeight` (number, group: `"layout"`, default: `60`)
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `sticky` (boolean, group: `"behavior"`, default: `false`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `footerBackground` (color, group: `"style"`, themeDefault: `"background"`)
   - `footerBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `contentBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `padding` (spacing, group: `"layout"`, default: `5`)
   - `footerPadding` (spacing, group: `"layout"`, default: `5`)
   - `compact` (boolean, group: `"behavior"`, default: `false`)
2. WHEN `compact` est `true`, THE `FooterLayout` SHALL utiliser `footerHeight * 0.8` comme hauteur du footer et `3` comme padding (reproduisant le comportement actuel).

---

### Requirement 22 : Props manquantes dans `SidebarLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `SidebarLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `SidebarLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `sidebarWidth` (number, group: `"layout"`, default: `280`)
   - `position` (enum, group: `"layout"`, default: `"left"`, options: `["left","right"]`)
   - `collapsible` (boolean, group: `"behavior"`, default: `true`)
   - `spacing` (spacing, group: `"layout"`, default: `4`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `background` (background, group: `"style"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `sidebarBackground` (background, group: `"style"`)
   - `sidebarBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `padding` (padding, group: `"layout"`)
   - `resizable` (boolean, group: `"behavior"`, default: `false`)
2. THE `LayoutMeta` de `SidebarLayout` SHALL déclarer la prop `sidebarMinWidth` (number, group: `"layout"`, default: `150`) — valeur hardcodée `minWidth: 150` dans le style de resize web.
3. THE `LayoutMeta` de `SidebarLayout` SHALL déclarer la prop `sidebarMaxWidth` (number, group: `"layout"`, default: `600`) — valeur hardcodée `maxWidth: 600` dans le style de resize web.
4. WHEN `resizable` est `true` et la plateforme est web, THE `SidebarLayout` SHALL utiliser `sidebarMinWidth` et `sidebarMaxWidth` comme contraintes de redimensionnement.

---

### Requirement 23 : Props manquantes dans `BottomDrawerLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `BottomDrawerLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `BottomDrawerLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `drawerHeight` (number, group: `"layout"`, default: `400`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `drawerBackground` (color, group: `"style"`, themeDefault: `"background"`)
   - `drawerBorderRadius` (radius, group: `"style"`, default: `"3xl"`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `defaultOpen` (boolean, group: `"behavior"`, default: `false`)
   - `handleColor` (color, group: `"style"`, themeDefault: `"primary"`)
   - `backdropOpacity` (ratio, group: `"style"`, default: `0.4`, min: `0`, max: `1`)
   - `contentScaleWhenOpen` (ratio, group: `"behavior"`, default: `0.95`, min: `0.5`, max: `1`)
2. THE `LayoutMeta` de `BottomDrawerLayout` SHALL déclarer la prop `handleBarColor` (color, group: `"style"`, themeDefault: `"border"`) — la barre de handle dans le drawer utilise `theme.border` hardcodé.
3. THE `LayoutMeta` de `BottomDrawerLayout` SHALL déclarer la prop `handleButtonSize` (number, group: `"layout"`, default: `56`) — largeur hardcodée `width: 56` du bouton Fingerprint.
4. WHEN `BottomDrawerLayout` est rendu, THE `BottomDrawerLayout` SHALL utiliser `handleBarColor` pour la barre de handle dans le drawer.

---

### Requirement 24 : Props manquantes dans `TopDrawerLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `TopDrawerLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `TopDrawerLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `drawerHeight` (number, group: `"layout"`, default: `600`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `drawerBackground` (color, group: `"style"`, themeDefault: `"background"`)
   - `drawerBorderRadius` (radius, group: `"style"`, default: `"3xl"`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `defaultOpen` (boolean, group: `"behavior"`, default: `false`)
   - `handleColor` (color, group: `"style"`, themeDefault: `"border"`)
   - `backdropOpacity` (ratio, group: `"style"`, default: `0.4`, min: `0`, max: `1`)
   - `contentScaleWhenOpen` (ratio, group: `"behavior"`, default: `0.95`, min: `0.5`, max: `1`)
   - `closeButtonBackground` (color, group: `"style"`, themeDefault: `"muted"`)
2. THE `LayoutMeta` de `TopDrawerLayout` SHALL déclarer la prop `closeButtonSize` (number, group: `"layout"`, default: `36`) — valeur hardcodée `width: 36, height: 36` du bouton de fermeture.
3. THE `LayoutMeta` de `TopDrawerLayout` SHALL déclarer la prop `closeButtonBorderColor` (color, group: `"style"`, themeDefault: `"border"`) — valeur hardcodée `${theme.border}30` dans le style du bouton.
4. THE `LayoutMeta` de `TopDrawerLayout` SHALL déclarer la prop `closeButtonTextColor` (color, group: `"style"`, themeDefault: `"mutedForeground"`) — valeur hardcodée `theme.mutedForeground` dans le texte `×`.
5. WHEN `TopDrawerLayout` est rendu, THE `TopDrawerLayout` SHALL utiliser `closeButtonSize` pour les dimensions du bouton de fermeture.

---

### Requirement 25 : Props manquantes dans `LeftDrawerLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `LeftDrawerLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `LeftDrawerLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `drawerWidth` (number, group: `"layout"`, default: `280`)
   - `maxWidth` (number, group: `"layout"`)
   - `scrollable` (boolean, group: `"behavior"`, default: `true`)
   - `drawerBackground` (color, group: `"style"`, themeDefault: `"background"`)
   - `drawerBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `defaultOpen` (boolean, group: `"behavior"`, default: `false`)
   - `handleColor` (color, group: `"style"`, themeDefault: `"primary"`)
   - `backdropOpacity` (ratio, group: `"style"`, default: `0.4`, min: `0`, max: `1`)
   - `contentScaleWhenOpen` (ratio, group: `"behavior"`, default: `0.98`, min: `0.5`, max: `1`)
2. THE `LayoutMeta` de `LeftDrawerLayout` SHALL déclarer la prop `handleBarColor` (color, group: `"style"`, themeDefault: `"border"`) — la barre de handle verticale utilise `theme.border` hardcodé.
3. THE `LayoutMeta` de `LeftDrawerLayout` SHALL déclarer la prop `handleBarWidth` (number, group: `"layout"`, default: `40`) — valeur hardcodée `width={40}` de la zone de geste de fermeture.
4. WHEN `LeftDrawerLayout` est rendu, THE `LeftDrawerLayout` SHALL utiliser `handleBarColor` pour la barre de handle verticale.

---

### Requirement 26 : Props manquantes dans `ScrollLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `ScrollLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `ScrollLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `spacing` (spacing, group: `"layout"`, default: `4`)
   - `useSafeAreaInsets` (boolean, group: `"behavior"`, default: `true`)
   - `headerHeight` (number, group: `"layout"`, default: `80`)
   - `footerHeight` (number, group: `"layout"`, default: `60`)
   - `scrollDirection` (enum, group: `"behavior"`, default: `"vertical"`, options: `["vertical","horizontal","both"]`)
   - `showScrollIndicator` (boolean, group: `"behavior"`, default: `false`)
   - `enableBounces` (boolean, group: `"behavior"`, default: `true`)
   - `stickyHeader` (boolean, group: `"behavior"`, default: `false`)
   - `stickyFooter` (boolean, group: `"behavior"`, default: `false`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `headerBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `footerBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `contentBackground` (color, group: `"style"`)
   - `headerPadding` (spacing, group: `"layout"`, default: `4`)
   - `footerPadding` (spacing, group: `"layout"`, default: `4`)
2. THE `LayoutMeta` de `ScrollLayout` SHALL déclarer la prop `mobileHeaderHeight` (number, group: `"layout"`, default: `60`) — valeur hardcodée `isMobile ? 60 : headerHeight`.
3. THE `LayoutMeta` de `ScrollLayout` SHALL déclarer la prop `mobileFooterHeight` (number, group: `"layout"`, default: `50`) — valeur hardcodée `isMobile ? 50 : footerHeight`.
4. WHEN `ScrollLayout` est rendu sur mobile, THE `ScrollLayout` SHALL utiliser `mobileHeaderHeight` et `mobileFooterHeight` comme hauteurs des zones correspondantes.

---

### Requirement 27 : Props manquantes dans `HeaderContentLayout`

**User Story :** En tant qu'utilisateur du Studio, je veux contrôler toutes les valeurs visuelles de `HeaderContentLayout` depuis le panneau de design.

#### Acceptance Criteria

1. THE `LayoutMeta` de `HeaderContentLayout` SHALL vérifier que les props suivantes sont déclarées :
   - `headerHeight` (number, group: `"layout"`, default: `150`)
   - `headerCollapsedHeight` (number, group: `"layout"`, default: `60`)
   - `spacing` (spacing, group: `"layout"`, default: `0`)
   - `maxWidth` (number, group: `"layout"`)
   - `headerBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `headerBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `contentBackground` (color, group: `"style"`, themeDefault: `"card"`)
   - `contentBorderRadius` (radius, group: `"style"`, default: `"none"`)
   - `background` (color, group: `"style"`, themeDefault: `"background"`)
   - `borderRadius` (radius, group: `"style"`, default: `"none"`)
   - `padding` (spacing, group: `"layout"`, default: `5`)
   - `headerPadding` (spacing, group: `"layout"`, default: `5`)
2. THE `LayoutMeta` de `HeaderContentLayout` SHALL déclarer la prop `scrollEventThrottle` (number, group: `"behavior"`, default: `16`) — valeur hardcodée `scrollEventThrottle={16}` dans le `Animated.ScrollView`.
3. WHEN `HeaderContentLayout` est rendu, THE `HeaderContentLayout` SHALL utiliser `scrollEventThrottle` comme throttle de l'événement scroll.

---

### Requirement 28 : Zéro breaking change

**User Story :** En tant que développeur utilisant la librairie, je veux que l'ajout de nouvelles props dans le registre ne modifie pas le rendu visuel des layouts existants, afin de ne pas casser les applications en production.

#### Acceptance Criteria

1. FOR ALL nouvelles `PropDescriptor` ajoutées au registre, THE `default` ou `themeDefault` SHALL reproduire exactement la valeur précédemment hardcodée dans le TSX.
2. WHEN un layout est rendu sans fournir les nouvelles props, THE layout SHALL produire un rendu visuellement identique à celui produit avant l'ajout de ces props.
3. FOR ALL layouts modifiés, WHEN les tests de régression sont exécutés, THE tests SHALL passer sans modification des snapshots existants.
4. THE `LayoutMeta.constants` SHALL conserver uniquement les valeurs purement internes (spring configs complexes multi-paramètres, distances d'exit, facteurs d'échelle internes aux animations) qui n'ont pas d'impact direct sur l'apparence perceptible.

---

### Requirement 29 : Cohérence des types et groupes dans le registre

**User Story :** En tant que développeur du Studio, je veux que toutes les props du registre utilisent des types et groupes cohérents, afin que le panneau de design affiche les bons contrôles.

#### Acceptance Criteria

1. FOR ALL props de couleur dans le registre, THE `PropDescriptor` SHALL utiliser `type: "color"` ou `type: "background"` (jamais `type: "string"` pour une couleur).
2. FOR ALL props de rayon de bordure, THE `PropDescriptor` SHALL utiliser `type: "radius"` (jamais `type: "number"` sauf pour `itemBorderRadius` de `CrossTabLayout` qui accepte une valeur numérique brute).
3. FOR ALL props d'espacement basées sur les tokens, THE `PropDescriptor` SHALL utiliser `type: "spacing"` (jamais `type: "number"`).
4. FOR ALL props de ratio (valeur entre 0 et 1, ou entre deux bornes), THE `PropDescriptor` SHALL utiliser `type: "ratio"` avec `min` et `max` définis.
5. FOR ALL props d'énumération, THE `PropDescriptor` SHALL déclarer `options` avec toutes les valeurs possibles.
6. THE `group` de chaque `PropDescriptor` SHALL être l'un de : `"style"` (apparence visuelle), `"layout"` (dimensions et positionnement), `"behavior"` (interactions et animations), `"content"` (données et contenu).

---

### Requirement 30 : Registre de tests — couverture des nouvelles props

**User Story :** En tant que développeur de la librairie, je veux que les nouvelles props soient couvertes par les tests du registre, afin de détecter les régressions.

#### Acceptance Criteria

1. WHEN les tests du registre sont exécutés (`foundation/layout/registry/__tests__/layouts.registry.test.ts`), THE tests SHALL vérifier que chaque layout listé dans `layoutRegistry` possède un `previewItemCount` défini si son slot principal a `array: true`.
2. WHEN les tests du registre sont exécutés, THE tests SHALL vérifier que chaque `PropDescriptor` de type `"ratio"` possède `min` et `max` définis.
3. WHEN les tests du registre sont exécutés, THE tests SHALL vérifier que chaque `PropDescriptor` de type `"enum"` possède un tableau `options` non vide.
4. FOR ALL layouts multi-items, WHEN les tests du registre sont exécutés, THE tests SHALL vérifier que le slot principal a `name: "items"` et `array: true`.
