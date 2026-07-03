/**
 * Shared types for the layout system, component registry, and block registry.
 * Serves as the contract for a visual UI builder.
 */

import { SpacingToken } from "../tokens/spacing";

export interface LayoutPadding {
  top?: SpacingToken;
  bottom?: SpacingToken;
  left?: SpacingToken;
  right?: SpacingToken;
  horizontal?: SpacingToken;
  vertical?: SpacingToken;
}

export type LayoutBackground = string | [string, string, ...string[]];

export type ThemeColorRole = Exclude<
  {
    [K in keyof import("../theme/types").ColorScheme]: import("../theme/types").ColorScheme[K] extends string ? K : never;
  }[keyof import("../theme/types").ColorScheme],
  undefined
>;

export interface SlotDescriptor {
  readonly name: string;
  readonly label: string;
  readonly required: boolean;
  readonly kind?: "children" | "items" | "named" | "named-array";
  readonly array?: boolean;
}

export type PropType =
  | "string"
  | "number"
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
  readonly group?: "style" | "layout" | "behavior" | "content";
}

export type LayoutCategory = "page" | "content" | "navigation" | "card" | "scroll" | "special";
export type ComponentCategory = "input" | "action" | "display" | "feedback" | "overlay" | "media" | "navigation";
export type BlockCategory = "auth" | "profile" | "navigation" | "content" | "data" | "feedback" | "form" | "overlay" | "social" | "ecommerce" | "finance" | "onboarding" | "messaging" | "calendar" | "files" | "location" | "media";

export interface SpringConfig {
  readonly damping: number;
  readonly stiffness: number;
  readonly mass?: number;
  readonly overshootClamping?: boolean;
}

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

export interface VariantDescriptor {
  readonly name: string;
  readonly label: string;
  readonly description?: string;
  readonly overrides: Record<string, unknown>;
}

interface BaseMeta {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly props: readonly PropDescriptor<any>[];
  readonly themeMapping?: Record<string, ThemeColorRole>;
  readonly tags: readonly string[];
}

export interface LayoutMeta extends BaseMeta {
  readonly category: LayoutCategory;
  readonly slots: readonly SlotDescriptor[];
  readonly constants?: LayoutConstants;
  readonly responsive: boolean;
  readonly animated: boolean;
  readonly dependencies?: readonly string[];
  readonly previewItemCount?: number;
  readonly platforms?: readonly ("native" | "web")[];
}

export interface ComponentMeta extends BaseMeta {
  readonly category: ComponentCategory;
  readonly variants: readonly VariantDescriptor[];
  readonly sizes?: readonly string[];
  readonly sizeMap?: Record<string, any>;
  readonly colorMap?: Record<string, any>;
  readonly platforms?: readonly ("native" | "web")[];
}

export interface BlockMeta extends BaseMeta {
  readonly category: BlockCategory;
  readonly slots: readonly SlotDescriptor[];
  readonly components: readonly string[];
}

export type AnyMeta = LayoutMeta | ComponentMeta | BlockMeta;

export type DefaultsOf<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K];
};

