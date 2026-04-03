---
inclusion: fileMatch
fileMatchPattern: "foundation/layout/**"
---

# Convention Layout — foundation/layout

## Architecture

```
foundation/layout/
├── hooks/          # Hooks réutilisables (useBreakpoint, useSafeArea, etc.)
├── types/          # Types partagés (LayoutPadding, BaseLayoutProps, LayoutMeta, etc.)
├── registry.ts     # Catalogue déclaratif de tous les layouts (métadonnées, slots, catégories)
├── ui/
│   ├── primitives/ # Niveau 0-1 : Box, Stack, Inline, Center, Scroll, Divider
│   └── *.tsx       # Niveau 2 : Layouts composés (AuthLayout, DashboardLayout, etc.)
└── utils/          # Fonctions pures (responsive, platform, spacingToStyle)
```

## Règles strictes

### 1. Primitives uniquement
Tout layout DOIT être construit sur les primitives (Box, Stack, Inline, Center, Scroll).
Interdit : `<View>`, `<ScrollView>`, `StyleSheet.create()` dans un layout.
Exception : `Animated.View` / `Animated.ScrollView` pour les animations Reanimated.

### 2. Responsive via useBreakpoint()
```ts
// ✅ Correct — destructurer les helpers
const { isMobile, isTablet, isDesktop } = useBreakpoint();

// ❌ Interdit — ne JAMAIS dériver isMobile manuellement
const breakpoint = useBreakpoint();
const isMobile = breakpoint === "xs" || breakpoint === "sm";
```

### 3. Platform vs Responsive
- `useBreakpoint()` → taille d'écran (responsive)
- `Platform.OS` ou `usePlatformInfo()` → plateforme (haptics, cursor, keyboard)
- Ne JAMAIS utiliser `usePlatformInfo()` pour du responsive

### 4. Types partagés
- `LayoutPadding` → padding directionnel (top/bottom/left/right/horizontal/vertical)
- `LayoutBackground` → `string | [string, string, ...string[]]` (couleur ou gradient)
- `BaseLayoutProps` → props minimales que tout layout devrait supporter
- Ne JAMAIS redéfinir un type padding ou background local

```ts
import { LayoutPadding, LayoutBackground } from "../types";
```

### 5. Structure d'un fichier layout
```tsx
/**
 * NomLayout — Layout niveau 2
 *
 * Description courte.
 *
 * Construit exclusivement sur les primitives Box, Stack, etc.
 */

import React from "react";
// ... imports

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NomLayoutProps { ... }

// ─── Composant ────────────────────────────────────────────────────────────────

const NomLayout: React.FC<NomLayoutProps> = ({ ... }) => {
  const { theme } = useTheme();
  const { isMobile } = useBreakpoint();
  // ...
};

export default NomLayout;
```

### 6. Props standard (BaseLayoutProps)
Tout layout devrait supporter au minimum :
- `background?: LayoutBackground` — fond du conteneur racine
- `borderRadius?: RadiusToken` — rayon de bordure (défaut : `"none"`)
- `shadow?: ShadowToken` — ombre (optionnel)
- `spacing?: SpacingToken` — espacement entre zones

### 7. Registre et defaults
Tout nouveau layout DOIT :
1. Être ajouté dans `registry/layouts.ts` avec ses métadonnées complètes
2. Déclarer toutes ses props configurables avec type, default, group, description
3. Consommer ses defaults via `applyDefaults(rawProps, META)` au lieu de les coder en dur

```tsx
// ─── Config ───────────────────────────────────────────────────────────────────
const META = getLayoutMeta("MonLayout")!;

const MonLayout: React.FC<MonLayoutProps> = (rawProps) => {
  const { spacing, background, ... } = applyDefaults(rawProps, META) as Required<MonLayoutProps>;
  // ...
};
```

### 8. Exports
- Chaque layout a un `export default` + les types exportés nommés
- L'index barrel exporte tous les layouts sauf les spéciaux (SystemLayout, Swipe2ScreenLayout)

### 9. Thème et tokens
- Les couleurs viennent du thème : `const { theme } = useTheme()`
- Les tokens statiques (spacing, radii, shadows) s'importent directement depuis `foundation/tokens`
- `ColorScheme` ne contient QUE les couleurs et gradients — pas de tokens statiques
- Les props couleur du registre utilisent `themeDefault` pour déclarer leur fallback thème :
  ```ts
  { name: "background", type: "color", themeDefault: "background" }
  ```
- `applyDefaults(rawProps, META, theme)` résout automatiquement les `themeDefault`
- Chaque layout déclare un `themeMapping` dans le registre pour que le builder sache quelles couleurs du thème sont consommées
