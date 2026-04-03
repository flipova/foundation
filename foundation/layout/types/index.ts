/**
 * Shared types for the layout system, component registry, and block registry.
 * Serves as the contract for a visual UI builder.
 */

import { SpacingToken } from "../../tokens/spacing";

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
    [K in keyof import("../../theme/types").ColorScheme]: import("../../theme/types").ColorScheme[K] extends string ? K : never;
  }[keyof import("../../theme/types").ColorScheme],
  undefined
>;

export interface SlotDescriptor {
  name: string;
  label: string;
  required: boolean;
  array?: boolean;
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
  | "ratio";

export interface PropDescriptor<T = unknown> {
  name: string;
  label: string;
  type: PropType;
  default?: T;
  themeDefault?: ThemeColorRole;
  description?: string;
  required?: boolean;
  options?: readonly string[];
  min?: number;
  max?: number;
  group?: "style" | "layout" | "behavior" | "content";
}

export type LayoutCategory = "page" | "content" | "navigation" | "card" | "scroll" | "special";
export type ComponentCategory = "input" | "action" | "display" | "feedback" | "overlay";
export type BlockCategory = "auth" | "profile" | "navigation" | "content" | "data" | "feedback";

export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass?: number;
  overshootClamping?: boolean;
}

export interface LayoutConstants {
  springConfig?: SpringConfig;
  springSnap?: SpringConfig;
  springNoBounce?: SpringConfig;
  swipeThreshold?: number;
  flipThreshold?: number;
  exitDistance?: number;
  scaleFactor?: number;
  flipScaleFactor?: number;
  dezoomDuration?: number;
  flipDuration?: number;
  slideOutDuration?: number;
  exitLeft?: number;
  exitRight?: number;
}

export interface VariantDescriptor {
  name: string;
  label: string;
  description?: string;
  overrides: Record<string, unknown>;
}

interface BaseMeta {
  id: string;
  label: string;
  description: string;
  props: PropDescriptor[];
  themeMapping?: Record<string, ThemeColorRole>;
  tags: string[];
}

export interface LayoutMeta extends BaseMeta {
  category: LayoutCategory;
  slots: SlotDescriptor[];
  constants?: LayoutConstants;
  responsive: boolean;
  animated: boolean;
  dependencies?: string[];
}

export interface ComponentMeta extends BaseMeta {
  category: ComponentCategory;
  variants: VariantDescriptor[];
  sizes?: string[];
}

export interface BlockMeta extends BaseMeta {
  category: BlockCategory;
  slots: SlotDescriptor[];
  components: string[];
}

export type AnyMeta = LayoutMeta | ComponentMeta | BlockMeta;

export type DefaultsOf<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K];
};
