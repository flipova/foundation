/**
 * @flipova/foundation/web
 *
 * Web (React DOM) entry point for Flipova Foundation.
 *
 * Provides React web equivalents of all primitives, components, and layouts.
 * Shares the same tokens, theme system, and registries as the React Native version.
 *
 * @example
 * ```tsx
 * // Shared: tokens, theme, registry
 * import { useTheme } from "@flipova/foundation/theme";
 * import { layoutRegistry } from "@flipova/foundation/layout";
 *
 * // Web-specific: primitives, components, layouts
 * import { Box, Stack, Button, DashboardLayout } from "@flipova/foundation/web";
 * ```
 */

// ── Primitives ──────────────────────────────────────────────────────────────
export * from "./primitives";

// ── Components ──────────────────────────────────────────────────────────────
export * from "./components";

// ── Layouts ─────────────────────────────────────────────────────────────────
export * from "./layouts";

// ── Re-export shared modules for convenience ─────────────────────────────────
// Tokens (platform-agnostic)
export * from "../tokens";

// Theme (platform-agnostic — React context)
export * from "../theme";

// Config (platform-agnostic)
export * from "../config";

// Registry (platform-agnostic — pure metadata)
export {
  layoutRegistry,
  getLayoutMeta,
  componentRegistry,
  getComponentMeta,
  blockRegistry,
  getBlockMeta,
  primitiveRegistry,
  getPrimitiveMeta,
  applyDefaults,
  applyVariant,
  extractDefaults,
  getConstants,
  resolveThemeDefaults,
} from "../layout/registry";

// Types (platform-agnostic)
export type {
  LayoutMeta,
  ComponentMeta,
  BlockMeta,
  LayoutCategory,
  ComponentCategory,
  BlockCategory,
  PropDescriptor,
  PropType,
  SlotDescriptor,
  VariantDescriptor,
  AnyMeta,
} from "../layout/types";
