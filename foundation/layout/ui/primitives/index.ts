/**
 * Primitives — Index
 *
 * Hiérarchie des primitives :
 *
 *   Niveau 0 — Box
 *     └─ Brique de base. Pont unique entre tokens et RN ViewStyle.
 *        Tout composant layout doit être construit sur Box.
 *
 *   Niveau 1 — Stack | Inline | Center | Scroll | Divider
 *     └─ Wrappers sémantiques de Box.
 *        Chacun exprime une intention de layout précise.
 *        Ne jamais passer de `style` ViewStyle brut depuis l'extérieur
 *        sauf via la prop `style` de Box (escape hatch documentée).
 *
 * Règle d'utilisation :
 *   - Layouts de page         → dossier layouts/
 *   - Composition de UI       → Stack / Inline / Center / Scroll
 *   - Conteneur générique     → Box (si aucune primitive n'est adaptée)
 *   - Jamais <View style={{}} /> hors de Box
 */

export { default as Box } from "./Box";
export type { BoxProps } from "./Box";

export { default as Center } from "./Center";
export type { CenterProps } from "./Center";

export { default as Divider } from "./Divider";
export type { DividerProps } from "./Divider";

export { default as Inline } from "./Inline";
export type { InlineProps } from "./Inline";

export { default as Scroll } from "./Scroll";
export type { ScrollProps } from "./Scroll";

export { default as Stack } from "./Stack";
export type { StackProps } from "./Stack";