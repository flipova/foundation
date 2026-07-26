/**
 * @flipova/foundation/web — Browser-only entry point
 *
 * Pure web exports: design tokens, theming, layout primitives, and UI components
 * optimized for browser environments. All React Native dependencies excluded.
 *
 * This entry point uses .web.ts/.web.tsx variants to ensure zero React Native
 * or Expo packages are bundled into web builds.
 */

export * from "../tokens";
export * from "../theme";
export * from "../config";
export * from "../types";
export * from "../ui";
export * from "../registry/generated";
