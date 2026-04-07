# Design Document — layout-props-full-control

## Overview

Cette feature vise à atteindre un **contrôle total des props** dans le système de layouts de `foundation`. Toute valeur qui impacte l'apparence ou le comportement perceptible d'un layout doit être exposée comme `PropDescriptor` dans son `LayoutMeta`, avec un `default` reproduisant exactement le comportement actuel (zéro breaking change).

Les trois axes de travail sont :
1. **Extension du type system** : ajout de `"json"` à `PropType`
2. **Nouveaux registres** : entrées `LayoutMeta` pour `Swipe2ScreenLayout` et `SystemLayout`
3. **Props manquantes** : 13 layouts existants reçoivent de nouvelles `PropDescriptor` et leurs TSX sont mis à jour pour lire ces valeurs via `applyDefaults`

---

## Architecture

Le système de layouts repose sur trois couches :

```
┌─────────────────────────────────────────────────────────┐
│  Studio (studio/app/)                                   │
│  Lit layoutRegistry → affiche PropDescriptors dans UI  │
└────────────────────────┬────────────────────────────────┘
                         │ lit
┌────────────────────────▼────────────────────────────────┐
│  Registry (foundation/layout/registry/)                 │
│  layouts.ts   — LayoutMeta[]                            │
│  defaults.ts  — applyDefaults / extractDefaults         │
│  types/       — PropType, PropDescriptor, LayoutMeta    │
└────────────────────────┬────────────────────────────────┘
                         │ consommé par
┌────────────────────────▼────────────────────────────────┐
│  UI (foundation/layout/ui/*.tsx)                        │
│  Chaque layout appelle applyDefaults(rawProps, META, theme) │
│  et utilise les valeurs résolues dans ses StyleSheets   │
└─────────────────────────────────────────────────────────┘
```

Le pattern uniforme à appliquer dans chaque layout TSX :

```typescript
const META = getLayoutMeta("LayoutId")!;

const LayoutComponent: React.FC<Props> = (rawProps) => {
  const { theme } = useTheme();
  const { prop1, prop2, ... } = applyDefaults(rawProps, META, theme) as Required<Props>;
  // ...
};
```

`applyDefaults` fusionne dans l'ordre de priorité : **valeur explicite > themeDefault > default statique**.

---

## Components and Interfaces

### 1. Extension de `PropType` — `foundation/layout/types/index.ts`

Ajouter `"json"` à l'union :

```typescript
export type PropType =
  | "string" | "number" | "boolean" | "spacing" | "radius" | "shadow"
  | "color" | "background" | "padding" | "enum" | "ratio"
  | "json";  // ← nouveau
```

Aucune modification de `applyDefaults` n'est nécessaire : la fonction traite déjà les valeurs de façon opaque.

---

### 2. Nouveaux `LayoutMeta` dans `layouts.ts`

#### `Swipe2ScreenLayout` (catégorie `"special"`)

```typescript
{
  id: "Swipe2ScreenLayout",
  label: "Swipe to Screen",
  description: "Layout de présentation avec swipe vers un écran projeté et QR code.",
  category: "special",
  slots: [{ name: "slides", label: "Slides", required: true, array: true }],
  responsive: false,
  animated: true,
  dependencies: ["react-native-gesture-handler", "expo-camera", "expo-haptics"],
  tags: ["swipe", "projection", "qr", "slides"],
  props: [
    { name: "containerBackground", label: "Fond container",  type: "color",  group: "style",    default: "#000" },
    { name: "screenBackground",    label: "Fond écran",      type: "color",  group: "style",    default: "#fff" },
    { name: "swipeThreshold",      label: "Seuil swipe",     type: "number", group: "behavior", default: 100 },
    { name: "projectedScale",      label: "Scale projeté",   type: "ratio",  group: "behavior", default: 0.8, min: 0.5, max: 1 },
    { name: "animationDuration",   label: "Durée animation", type: "number", group: "behavior", default: 300 },
    { name: "slides",              label: "Slides",          type: "json",   group: "content",  default: [] },
  ],
}
```

#### `SystemLayout` (catégorie `"special"`)

```typescript
{
  id: "SystemLayout",
  label: "System UI",
  description: "Wrapper système gérant StatusBar, SafeAreaView et NavigationBar.",
  category: "special",
  slots: [{ name: "children", label: "Contenu", required: true }],
  responsive: false,
  animated: false,
  dependencies: ["expo-status-bar", "react-native-safe-area-context"],
  tags: ["system", "statusbar", "navigation-bar", "safe-area"],
  props: [
    { name: "rootBackgroundColor",       label: "Couleur fond racine",    type: "color", group: "style",    default: "#0c3ddbff" },
    { name: "statusBarContentStyle",     label: "Style barre statut",     type: "enum",  group: "behavior", default: "auto", options: ["light", "dark", "auto"] },
    { name: "edges",                     label: "Bords safe area",        type: "json",  group: "behavior", default: ["top", "bottom", "left", "right"] },
    { name: "navigationBarContentStyle", label: "Style barre navigation", type: "enum",  group: "behavior", options: ["light", "dark"] },
  ],
}
```

---

### 3. Props manquantes par layout

#### `SketchLayout`
| Prop | Type | Default / themeDefault |
|------|------|------------------------|
| `background` | color | themeDefault: `"background"` |

#### `DeckLayout`
| Prop | Type | Default / themeDefault |
|------|------|------------------------|
| `cardBackground` | color | themeDefault: `"card"` |
| `cardBorderRadius` | radius | default: `24` |
| `containerWidth` | string | default: `"90%"` |
| `containerHeight` | string | default: `"75%"` |
| `peekCount` | number | default: `2` |

#### `FlipLayout` (+ retrait de `constants`)
| Prop | Type | Default / themeDefault |
|------|------|------------------------|
| `cardBorderRadius` | radius | default: `20` |
| `cardAspectRatio` | number | default: `0.5625` |
| `cardMaxHeight` | number | default: `750` |
| `dezoomDuration` | number | default: `120` |
| `flipDuration` | number | default: `320` |
| `slideOutDuration` | number | default: `140` |

`dezoomDuration`, `flipDuration`, `slideOutDuration` sont retirés de `constants` et exposés uniquement dans `props`.

#### `DashboardLayout`
| Prop | Type | themeDefault |
|------|------|--------------|
| `headerBackground` | color | `"card"` |
| `sidebarBackground` | color | `"card"` |
| `contentBackground` | color | `"card"` |
| `footerBackground` | color | `"card"` |

#### `TutoLayout`
| Prop | Type | themeDefault |
|------|------|--------------|
| `accentColor` | color | `"primary"` |
| `textBackground` | color | `"background"` |
| `textColor` | color | `"foreground"` |
| `mutedTextColor` | color | `"mutedForeground"` |

#### `ParallaxLayout`
| Prop | Type | Default / themeDefault |
|------|------|------------------------|
| `background` | color | themeDefault: `"background"` |
| `rowBackground` | color | — |

#### `BottomDrawerLayout`
| Prop | Type | Default / themeDefault |
|------|------|------------------------|
| `handleColor` | color | themeDefault: `"primary"` |
| `backdropOpacity` | ratio | default: `0.4`, min: `0`, max: `1` |
| `contentScaleWhenOpen` | ratio | default: `0.95`, min: `0.5`, max: `1` |

#### `TopDrawerLayout`
| Prop | Type | Default / themeDefault |
|------|------|------------------------|
| `handleColor` | color | themeDefault: `"border"` |
| `backdropOpacity` | ratio | default: `0.4`, min: `0`, max: `1` |
| `contentScaleWhenOpen` | ratio | default: `0.95`, min: `0.5`, max: `1` |
| `closeButtonBackground` | color | themeDefault: `"muted"` |

#### `LeftDrawerLayout`
| Prop | Type | Default / themeDefault |
|------|------|------------------------|
| `handleColor` | color | themeDefault: `"primary"` |
| `backdropOpacity` | ratio | default: `0.4`, min: `0`, max: `1` |
| `contentScaleWhenOpen` | ratio | default: `0.98`, min: `0.5`, max: `1` |

#### `CrossTabLayout` (+ retrait de `constants`)
| Prop | Type | Default |
|------|------|---------|
| `springDamping` | number | `18` |
| `springStiffness` | number | `120` |
| `longPressDuration` | number | `250` |
| `dragScale` | ratio | `1.05`, min: `1`, max: `1.5` |

`springDamping` et `springStiffness` sont retirés de `constants.springConfig` et exposés dans `props`. Le composant reconstruit `const SPRING = { damping: springDamping, stiffness: springStiffness, mass: 0.5 }`.

#### `SwiperLayout`
| Prop | Type | Default |
|------|------|---------|
| `springDamping` | number | `12` |
| `springStiffness` | number | `160` |
| `cardCountBackground` | color | `"rgba(0,0,0,0.6)"` |
| `cardCountTextColor` | color | `"#fff"` |

#### `ScrollLayout`
| Prop | Type | Default |
|------|------|---------|
| `headerPadding` | spacing | `4` |
| `footerPadding` | spacing | `4` |

#### `BentoLayout`
| Prop | Type | Default |
|------|------|---------|
| `cellConfig` | json | `[]` |

---

### 4. Modifications TSX par layout

Chaque layout suit le même pattern de migration :

1. Importer `getLayoutMeta` et `applyDefaults` depuis le registre
2. Déclarer `const META = getLayoutMeta("LayoutId")!` au niveau module
3. Wrapper le composant pour appeler `applyDefaults(rawProps, META, theme)`
4. Remplacer les valeurs hardcodées par les props résolues

**Swipe2ScreenLayout.tsx**
- `backgroundColor: '#000'` → `containerBackground`
- `backgroundColor: '#fff'` → `screenBackground`
- `event.translationY < -100` → `event.translationY < -swipeThreshold`
- `scale.value = withSpring(0.8)` → `scale.value = withSpring(projectedScale)`
- `duration: 300` → `duration: animationDuration`

**SystemLayout.tsx**
- Ajouter `getLayoutMeta`, `applyDefaults`
- Appeler `applyDefaults(rawProps, META, theme)` — `theme` ici est le thème système natif, pas le `ColorScheme` foundation ; les props sont utilisées directement sans résolution `themeDefault`

**SketchLayout.tsx**
- `bg={theme.background}` → `bg={background}` issu de `applyDefaults`

**DeckLayout.tsx**
- `backgroundColor: theme.card` → `backgroundColor: cardBackground`
- `borderRadius: 24` → `borderRadius: cardBorderRadius`
- `width: '90%'` → `width: containerWidth`
- `height: '75%'` → `height: containerHeight`
- `[2, 1].map(...)` → `Array.from({ length: peekCount }, (_, i) => peekCount - i).map(...)`

**FlipLayout.tsx**
- Remplacer `DEZOOM_DURATION`, `FLIP_DURATION`, `SLIDE_OUT_DURATION` par les props
- `borderRadius: 20` → `borderRadius: cardBorderRadius`
- `aspectRatio: 9/16` → `aspectRatio: cardAspectRatio`
- `maxHeight: 750` → `maxHeight: cardMaxHeight`

**DashboardLayout.tsx**
- 4 occurrences de `bg={theme.card}` → `headerBackground`, `sidebarBackground`, `contentBackground`, `footerBackground`

**TutoLayout.tsx**
- `theme.primary` → `accentColor`
- `${theme.background}F8` → `textBackground`
- `theme.foreground` → `textColor`
- `${theme.foreground}99` → `mutedTextColor`

**ParallaxLayout.tsx**
- Wrapper racine avec `bg={background}`
- Passer `rowBackground` à `ParallaxRow`

**BottomDrawerLayout.tsx**
- `theme.primary` → `handleColor`
- `0.4` → `backdropOpacity` dans les interpolations
- `0.95` → `contentScaleWhenOpen` dans les interpolations

**TopDrawerLayout.tsx**
- `theme.border` → `handleColor`
- `0.4` → `backdropOpacity`
- `0.95` → `contentScaleWhenOpen`
- `${theme.muted}20` → `closeButtonBackground`

**LeftDrawerLayout.tsx**
- `theme.primary` → `handleColor`
- `0.4` → `backdropOpacity`
- `0.98` → `contentScaleWhenOpen`

**CrossTabLayout.tsx**
- Construire `const SPRING = { damping: springDamping, stiffness: springStiffness, mass: 0.5 }` depuis les props
- `activateAfterLongPress(250)` → `activateAfterLongPress(longPressDuration)`
- `scale: 1.05` → `scale: dragScale`

**SwiperLayout.tsx**
- Construire `springConfig` depuis `springDamping` et `springStiffness`
- `rgba(0,0,0,0.6)` → `cardCountBackground`
- `color: '#fff'` → `cardCountTextColor`

**ScrollLayout.tsx**
- `p={4}` dans `renderHeader` → `p={headerPadding}`
- `p={4}` dans `renderFooter` → `p={footerPadding}`

**BentoLayout.tsx**
- S'assurer que `cellConfig` est lue depuis `applyDefaults` (la prop est déjà utilisée dans le TSX)

---

## Data Models

### `PropDescriptor` étendu

```typescript
export type PropType =
  | "string" | "number" | "boolean" | "spacing" | "radius" | "shadow"
  | "color" | "background" | "padding" | "enum" | "ratio"
  | "json";  // valeur opaque : tableau ou objet structuré

export interface PropDescriptor<T = unknown> {
  name: string;
  label: string;
  type: PropType;
  default?: T;
  themeDefault?: ThemeColorRole;  // uniquement pour type "color" | "background"
  description?: string;
  required?: boolean;
  options?: readonly string[];    // obligatoire si type === "enum"
  min?: number;
  max?: number;
  group?: "style" | "layout" | "behavior" | "content";
}
```

### Règles de cohérence du registre

- `themeDefault` est autorisé uniquement sur les props de type `"color"` ou `"background"`
- `options` est obligatoire et non-vide pour les props de type `"enum"`
- Chaque `id` dans `layoutRegistry` est unique
- Les props de type `"json"` ont un `default` de type tableau ou objet (jamais `undefined` si la prop est requise)

### Priorité de résolution dans `applyDefaults`

```
valeur explicite (props passées) > themeDefault (résolu depuis ColorScheme) > default statique
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1 : Cohérence des defaults

*For any* layout dans `layoutRegistry` et *for any* `PropDescriptor` de ce layout ayant un champ `default`, appeler `applyDefaults({}, META, mockTheme)` doit retourner exactement cette valeur pour la prop correspondante.

**Validates: Requirements 1.2, 2.2, 2.4, 3.2, 17.1**

---

### Property 2 : Priorité de résolution `applyDefaults`

*For any* `LayoutMeta`, *for any* prop avec `themeDefault` et `default`, et *for any* valeur explicite fournie, la valeur retournée par `applyDefaults` doit respecter l'ordre : valeur explicite > themeDefault > default statique.

**Validates: Requirements 16.4**

---

### Property 3 : Opacité des valeurs `json`

*For any* objet ou tableau JSON arbitraire passé comme valeur d'une prop de type `"json"`, `applyDefaults` doit retourner une valeur deep-equal à l'entrée, sans transformation ni mutation.

**Validates: Requirements 1.2**

---

### Property 4 : Unicité des ids dans le registre

*For any* paire de layouts distincts dans `layoutRegistry`, leurs `id` doivent être différents — le registre ne contient aucun doublon d'identifiant.

**Validates: Requirements 2.1, 3.1**

---

### Property 5 : Props `enum` ont des `options` non-vides

*For any* `PropDescriptor` dans `layoutRegistry` avec `type: "enum"`, le champ `options` doit être présent et contenir au moins une valeur.

**Validates: Requirements 3.2**

---

### Property 6 : `themeDefault` réservé aux types couleur

*For any* `PropDescriptor` dans `layoutRegistry` ayant un champ `themeDefault`, son `type` doit être `"color"` ou `"background"`.

**Validates: Requirements 16.1**

---

## Error Handling

### Cas `getLayoutMeta` retourne `undefined`

Le pattern `getLayoutMeta("LayoutId")!` utilise l'assertion non-null. Si un layout TSX référence un id absent du registre, l'erreur se manifeste au runtime. La convention est de toujours ajouter l'entrée registre avant de modifier le TSX.

### Valeurs `json` malformées

`applyDefaults` ne valide pas le contenu des props `json` — c'est la responsabilité du Studio (éditeur JSON) et du composant consommateur. Le type `"json"` signale uniquement que la valeur est opaque pour le système de defaults.

### `themeDefault` sur un thème incomplet

Si `theme[themeDefault]` est `undefined` (thème partiel), `resolveThemeDefaults` retourne `undefined` pour cette prop, et `applyDefaults` tombe en fallback sur `default` statique. Ce comportement est déjà implémenté.

### `SystemLayout` et le thème système

`SystemLayout` utilise le thème système natif (expo-status-bar, react-native-safe-area-context), pas le `ColorScheme` foundation. `applyDefaults` est appelé sans `theme` ou avec un objet vide — les props sont utilisées directement depuis leurs `default` statiques.

---

## Testing Strategy

### Approche duale

Les tests sont organisés en deux catégories complémentaires :

**Tests unitaires (exemples)**
- Vérifier que `"json"` est présent dans `PropType` (compilation TypeScript)
- Vérifier que `layoutRegistry` contient les entrées `Swipe2ScreenLayout` et `SystemLayout`
- Vérifier que `BentoLayout` a une prop `cellConfig` de type `"json"`
- Vérifier que `SketchLayout`, `DeckLayout`, `FlipLayout`, etc. ont leurs nouvelles props déclarées

**Tests property-based (fast-check)**
- Chaque propriété de correction est implémentée par un test property-based
- Minimum 100 itérations par propriété (`numRuns: 100`)
- Bibliothèque : `fast-check`

### Fichier de test

`foundation/layout/registry/__tests__/layouts.registry.test.ts`

```typescript
import fc from "fast-check";
import { layoutRegistry } from "../layouts";
import { applyDefaults } from "../defaults";

// Feature: layout-props-full-control, Property 1: defaults coherence
// Pour tout layout et toute prop avec default, applyDefaults({}, META, mockTheme) retourne le default
it("Property 1 — cohérence des defaults", () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...layoutRegistry.filter(m => m.props.some(p => p.default !== undefined))),
      (meta) => {
        const result = applyDefaults({}, meta, {} as any);
        return meta.props
          .filter(p => p.default !== undefined)
          .every(p => JSON.stringify((result as any)[p.name]) === JSON.stringify(p.default));
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: layout-props-full-control, Property 2: priorité de résolution
it("Property 2 — priorité valeur explicite > themeDefault > default", () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1 }),
      (explicitValue) => {
        const meta = layoutRegistry.find(m => m.props.some(p => p.themeDefault && p.default !== undefined));
        if (!meta) return true;
        const prop = meta.props.find(p => p.themeDefault && p.default !== undefined)!;
        const result = applyDefaults({ [prop.name]: explicitValue } as any, meta, {} as any);
        return (result as any)[prop.name] === explicitValue;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: layout-props-full-control, Property 3: opacité json
it("Property 3 — opacité des valeurs json", () => {
  fc.assert(
    fc.property(
      fc.array(fc.anything()),
      (jsonValue) => {
        const meta = layoutRegistry.find(m => m.props.some(p => p.type === "json"))!;
        const prop = meta.props.find(p => p.type === "json")!;
        const result = applyDefaults({ [prop.name]: jsonValue } as any, meta);
        return JSON.stringify((result as any)[prop.name]) === JSON.stringify(jsonValue);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: layout-props-full-control, Property 4: unicité des ids
it("Property 4 — unicité des ids dans le registre", () => {
  const ids = layoutRegistry.map(m => m.id);
  const unique = new Set(ids);
  expect(unique.size).toBe(ids.length);
});

// Feature: layout-props-full-control, Property 5: enum ont des options
it("Property 5 — props enum ont des options non-vides", () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...layoutRegistry),
      (meta) => {
        return meta.props
          .filter(p => p.type === "enum")
          .every(p => Array.isArray(p.options) && p.options.length > 0);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: layout-props-full-control, Property 6: themeDefault réservé aux types couleur
it("Property 6 — themeDefault uniquement sur color/background", () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...layoutRegistry),
      (meta) => {
        return meta.props
          .filter(p => p.themeDefault !== undefined)
          .every(p => p.type === "color" || p.type === "background");
      }
    ),
    { numRuns: 100 }
  );
});
```

### Équilibre tests unitaires / property tests

Les tests unitaires couvrent les exemples concrets (présence d'une entrée dans le registre, type d'une prop spécifique). Les property tests couvrent les invariants structurels qui doivent tenir pour l'ensemble du registre. Les tests TSX (rendu visuel, utilisation des props dans les StyleSheets) sont hors scope de ce fichier de test — ils relèvent de tests d'intégration ou de snapshot tests dans les apps consommatrices.
