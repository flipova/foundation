/**
 * Unified Registry
 *
 * Single entry point for all registries: layouts, components, and blocks.
 * Provides helpers to query, apply defaults, and resolve variants.
 */

export { applyDefaults, applyVariant, extractDefaults, getConstants, resolveThemeDefaults } from "./core/defaults";
export { layoutRegistry, getLayoutMeta, type SidebarPosition } from "./layouts";
export { componentRegistry, getComponentMeta, type IconPosition, type AccordionType } from "./components";
export { blockRegistry, getBlockMeta } from "./blocks";
export { primitiveRegistry, getPrimitiveMeta, type FlexDirection, type FlexAlignItems, type FlexJustifyContent, type GradientDirection, type ScrollDirection, type DividerOrientation } from "./primitives";
export * from "./core/typeHelpers";
