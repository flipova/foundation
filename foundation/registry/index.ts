/**
 * Unified Registry
 *
 * Single entry point for all registries: layouts, components, and blocks.
 * Provides helpers to query, apply defaults, and resolve variants.
 */

export { applyDefaults, applyVariant, extractDefaults, getConstants, resolveThemeDefaults } from "./core/defaults";
export { layoutRegistry, getLayoutMeta } from "./layouts";
export { componentRegistry, getComponentMeta } from "./components";
export { blockRegistry, getBlockMeta } from "./blocks";
export { primitiveRegistry, getPrimitiveMeta } from "./primitives";
export * from "./core/typeHelpers";

import type { ExtractRegistryEnum } from "./core/typeHelpers";
export type FlexDirection = ExtractRegistryEnum<"FlexDirection">;
export type FlexAlignItems = ExtractRegistryEnum<"FlexAlignItems">;
export type FlexJustifyContent = ExtractRegistryEnum<"FlexJustifyContent">;
export type GradientDirection = ExtractRegistryEnum<"GradientDirection">;
export type ScrollDirection = ExtractRegistryEnum<"ScrollDirection">;
export type DividerOrientation = ExtractRegistryEnum<"DividerOrientation">;
export type SidebarPosition = ExtractRegistryEnum<"SidebarPosition">;
export type IconPosition = ExtractRegistryEnum<"IconPosition">;
export type AccordionType = ExtractRegistryEnum<"AccordionType">;
