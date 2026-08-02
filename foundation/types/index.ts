/**
 * Shared types for layout system, component registry, and block registry.
 * Serves as the schema contract for visual UI builders and design tools.
 */

import { SpacingToken } from '../tokens';

/**
 * Defines padding spacing around a layout element.
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
 * Background property type for layouts (solid color hex or gradient array).
 */
export type LayoutBackground = string | [string, string, ...string[]];

/**
 * Color roles extracted from the active theme ColorScheme.
 */
export type ThemeColorRole = Exclude<
  {
    [K in keyof import("../theme/types").ColorScheme]: import("../theme/types").ColorScheme[K] extends string ? K : never;
  }[keyof import("../theme/types").ColorScheme],
  undefined
>;

/**
 * Descriptor for a layout or component slot that accepts child elements.
 */
export interface SlotDescriptor {
  readonly name: string;
  readonly label: string;
  readonly required: boolean;
  readonly kind?: "children" | "items" | "named" | "named-array";
  readonly array?: boolean;
}

/**
 * Property types supported by the design system metadata.
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
 * Property descriptor for a component, layout, or block.
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
 * Layout categories.
 */
export type LayoutCategory = "page" | "content" | "navigation" | "card" | "scroll" | "special";
/**
 * Component categories.
 */
export type ComponentCategory = "input" | "action" | "display" | "feedback" | "overlay" | "media" | "navigation";
/**
 * Block categories.
 */
export type BlockCategory = "auth" | "profile" | "navigation" | "content" | "data" | "feedback" | "form" | "overlay" | "social" | "ecommerce" | "finance" | "onboarding" | "messaging" | "calendar" | "files" | "location" | "media";

/**
 * Configuration for spring animations.
 */
export interface SpringConfig {
  readonly damping: number;
  readonly stiffness: number;
  readonly mass?: number;
  readonly overshootClamping?: boolean;
}

/**
 * Constants specific to a layout animation or gesture threshold.
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
 * Standardized size configuration for components.
 */
export interface ComponentSizeConfig {
  readonly height?: number;
  readonly width?: number;
  readonly px?: number;
  readonly py?: number;
  readonly fontSize?: number;
  readonly iconSize?: number;
  readonly borderRadius?: string | number;
  readonly [key: string]: unknown;
}

/**
 * Standardized color configuration for components.
 */
export interface ComponentColorConfig {
  readonly bg?: ThemeColorRole | "transparent" | string;
  readonly text?: ThemeColorRole | string;
  readonly border?: ThemeColorRole | "transparent" | string;
  readonly subtle?: ThemeColorRole | string | readonly [string, string];
  readonly active?: ThemeColorRole | string;
  readonly solid?: readonly [string, string];
  readonly [key: string]: unknown;
}

/**
 * Descriptor for a component variant with override properties.
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
  readonly example?: string;
  readonly examples?: readonly string[];
}

/**
 * Layout-specific metadata interface.
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
 * Component-specific metadata interface.
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
 * Block-specific metadata interface.
 */
export interface BlockMeta extends BaseMeta {
  readonly category: BlockCategory;
  readonly slots: readonly SlotDescriptor[];
  readonly components: readonly string[];
}

/**
 * Primitive-specific metadata interface.
 */
export interface PrimitiveMeta extends BaseMeta {
  readonly category: string;
  readonly slots?: readonly SlotDescriptor[];
}

/**
 * Union type representing any metadata item (layout, component, block, or primitive).
 */
export type AnyMeta = LayoutMeta | ComponentMeta | BlockMeta | PrimitiveMeta;

/**
 * Utility type to make all properties optional for default objects.
 */
export type DefaultsOf<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K];
};
