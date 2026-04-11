/**
 * Unified Registry
 *
 * Single entry point for all registries: layouts, components, and blocks.
 * Provides helpers to query, apply defaults, and resolve variants.
 */

export { applyDefaults, applyVariant, extractDefaults, getConstants, resolveThemeDefaults } from "./defaults";
export { layoutRegistry, getLayoutMeta } from "./layouts";
export { componentRegistry, getComponentMeta } from "./components";
export { blockRegistry, getBlockMeta } from "./blocks";
export { primitiveRegistry, getPrimitiveMeta } from "./primitives";
