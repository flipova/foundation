/**
 * defineConfig — User-facing config helper.
 *
 * Usage in flipova.config.ts:
 *
 * ```ts
 * import { defineConfig } from "@flipova/foundation/config";
 *
 * export default defineConfig({
 *   tokens: {
 *     spacing: { 0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 20, 8: 32 },
 *     radii: { none: 0, sm: 2, md: 4, lg: 8, xl: 12, full: 9999 },
 *     breakpoints: { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280 },
 *   },
 *   themes: {
 *     brand: {
 *       colors: {
 *         primary: "#FF6B00",
 *         primaryForeground: "#FFFFFF",
 *         background: "#FAFAFA",
 *       },
 *     },
 *   },
 *   defaultTheme: "brand",
 * });
 * ```
 */

import type { FoundationConfig } from "./types";

export function defineConfig(config: FoundationConfig): FoundationConfig {
  return config;
}
