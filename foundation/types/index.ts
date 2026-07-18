/**
 * Types partagés pour le système de disposition, le registre de composants et le registre de blocs.
 * Sert de contrat pour un constructeur d'interface utilisateur visuel.
 */

import { SpacingToken } from '../tokens';

/**
 * Définit l'espacement autour d'un élément.
 */
export interface LayoutPadding {
  top?: SpacingToken;
  bottom?: SpacingToken;
  left?: SpacingToken;
  right?: SpacingToken;
  horizontal?: SpacingToken;
  vertical?: SpacingToken;
}

/**
 * Type pour définir l'arrière-plan d'une disposition, pouvant être une couleur unie ou un dégradé.
 */
export type LayoutBackground = string | [string, string, ...string[]];

/**
 * Rôles de couleurs extraits du schéma de couleurs du thème.
 */
export type ThemeColorRole = Exclude<
  {
    [K in keyof import("../theme/types").ColorScheme]: import("../theme/types").ColorScheme[K] extends string ? K : never;
  }[keyof import("../theme/types").ColorScheme],
  undefined
>;

/**
 * Descripteur pour un emplacement (slot) pouvant accueillir des composants enfants.
 */
export interface SlotDescriptor {
  readonly name: string;
  readonly label: string;
  readonly required: boolean;
  readonly kind?: "children" | "items" | "named" | "named-array";
  readonly array?: boolean;
}

/**
 * Types de propriétés supportés par le système.
 */
export type PropType =
  | "string"
  | "number"
  | "integer"
  | "url"
  | "icon"
  | "boolean"
  | "spacing"
  | "radius"
  | "shadow"
  | "color"
  | "background"
  | "padding"
  | "enum"
  | "ratio"
  | "json";

/**
 * Décrit une propriété d'un composant, d'une disposition ou d'un bloc.
 */
export interface PropDescriptor<T = unknown> {
  readonly name: string;
  readonly label: string;
  readonly type: PropType;
  readonly default?: T;
  readonly themeDefault?: ThemeColorRole;
  readonly description?: string;
  readonly required?: boolean;
  readonly options?: readonly string[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly platform?: "native" | "web" | "both";
  readonly group?: "style" | "layout" | "behavior" | "content";
}

/**
 * Catégories de dispositions.
 */
export type LayoutCategory = "page" | "content" | "navigation" | "card" | "scroll" | "special";
/**
 * Catégories de composants.
 */
export type ComponentCategory = "input" | "action" | "display" | "feedback" | "overlay" | "media" | "navigation";
/**
 * Catégories de blocs.
 */
export type BlockCategory = "auth" | "profile" | "navigation" | "content" | "data" | "feedback" | "form" | "overlay" | "social" | "ecommerce" | "finance" | "onboarding" | "messaging" | "calendar" | "files" | "location" | "media";

/**
 * Configuration pour les animations de type ressort (spring).
 */
export interface SpringConfig {
  readonly damping: number;
  readonly stiffness: number;
  readonly mass?: number;
  readonly overshootClamping?: boolean;
}

/**
 * Constantes spécifiques à une disposition (layout).
 */
export interface LayoutConstants {
  readonly springConfig?: SpringConfig;
  readonly springSnap?: SpringConfig;
  readonly springNoBounce?: SpringConfig;
  readonly swipeThreshold?: number;
  readonly flipThreshold?: number;
  readonly exitDistance?: number;
  readonly scaleFactor?: number;
  readonly flipScaleFactor?: number;
  readonly dezoomDuration?: number;
  readonly flipDuration?: number;
  readonly slideOutDuration?: number;
  readonly exitLeft?: number;
  readonly exitRight?: number;
}

/**
 * Configuration de taille standardisée pour les composants.
 */
export interface ComponentSizeConfig {
  readonly height?: number;
  readonly width?: number;
  readonly px?: number;
  readonly py?: number;
  readonly fontSize?: number;
  readonly iconSize?: number;
  readonly borderRadius?: string | number;
  readonly [key: string]: unknown; // Allow other specific sizing properties
}

/**
 * Configuration de couleur standardisée pour les composants.
 */
export interface ComponentColorConfig {
  readonly bg?: ThemeColorRole | "transparent" | string;
  readonly text?: ThemeColorRole | string;
  readonly border?: ThemeColorRole | "transparent" | string;
  readonly subtle?: ThemeColorRole | string | readonly [string, string];
  readonly active?: ThemeColorRole | string;
  readonly solid?: readonly [string, string]; // e.g. ["primary", "primaryForeground"]
  readonly [key: string]: unknown;
}

/**
 * Descripteur d'une variante de composant, permettant de surcharger certaines propriétés.
 */
export interface VariantDescriptor<Props = Record<string, unknown>> {
  readonly name: string;
  readonly label: string;
  readonly description?: string;
  readonly overrides: Partial<Props>;
}

interface BaseMeta {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly props: readonly PropDescriptor<any>[];
  readonly themeMapping?: Record<string, ThemeColorRole>;
  readonly tags: readonly string[];
  readonly customConfig?: Record<string, any>;
  readonly enumMap?: Record<string, readonly string[]>;
}

/**
 * Métadonnées spécifiques à une disposition (layout).
 */
export interface LayoutMeta extends BaseMeta {
  readonly category: LayoutCategory;
  readonly slots: readonly SlotDescriptor[];
  readonly constants?: LayoutConstants;
  readonly responsive: boolean;
  readonly animated: boolean;
  readonly platforms?: readonly ("native" | "web")[];
  readonly previewItemCount?: number;
  readonly architecture?: {
    readonly dependencies?: readonly string[];
  };
  /** @deprecated Use `architecture.dependencies` instead */
  readonly dependencies?: readonly string[];
}

/**
 * Métadonnées spécifiques à un composant.
 */
export interface ComponentMeta<Props = any> extends BaseMeta {
  readonly category: ComponentCategory;
  readonly variants: readonly VariantDescriptor<Props>[];
  readonly sizes?: readonly string[];
  readonly sizeMap?: Record<string, ComponentSizeConfig>;
  readonly colorMap?: Record<string, ComponentColorConfig>;
  readonly platforms?: readonly ("native" | "web")[];
  readonly capabilities?: {
    readonly platforms?: readonly ("native" | "web")[];
  };
  readonly architecture?: {
    readonly dependencies?: readonly string[];
  };
}

/**
 * Métadonnées spécifiques à un bloc.
 */
export interface BlockMeta extends BaseMeta {
  readonly category: BlockCategory;
  readonly slots: readonly SlotDescriptor[];
  readonly components: readonly string[];
}

/**
 * Métadonnées spécifiques à un primitif.
 */
export interface PrimitiveMeta extends BaseMeta {
  readonly category: string;
  readonly slots?: readonly SlotDescriptor[];
}

/**
 * Type union représentant n'importe quelles métadonnées (disposition, composant, bloc ou primitif).
 */
export type AnyMeta = LayoutMeta | ComponentMeta | BlockMeta | PrimitiveMeta;

/**
 * Type utilitaire pour rendre toutes les propriétés optionnelles.
 */
export type DefaultsOf<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K];
};
