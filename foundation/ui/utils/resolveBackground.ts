/**
 * Resolves a LayoutBackground (string | [string, string, ...]) into bg and gradient properties.
 * Eliminates duplicate resolution logic across AuthLayout, SidebarLayout, etc.
 */

import type { LayoutBackground } from "../../types";

/**
 * Interface representing resolved background properties (solid color hex or gradient array).
 */
export interface ResolvedBackground {
  bg?: string;
  gradient?: [string, string];
}

/**
 * Resolves a layout background definition into a ResolvedBackground object.
 *
 * @param background - Background configuration (color string or gradient array).
 * @returns A ResolvedBackground object containing bg or gradient properties.
 */
export function resolveBackground(background?: LayoutBackground): ResolvedBackground {
  if (!background) return {};
  if (Array.isArray(background) && background.length >= 2) {
    return { gradient: background.slice(0, 2) as [string, string] };
  }
  return { bg: background as string };
}

