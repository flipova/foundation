/**
 * Résout un LayoutBackground (string | [string, string, ...]) en props bg + gradient.
 * Élimine la duplication dans AuthLayout, SidebarLayout, etc.
 */

import type { LayoutBackground } from "../types";

export interface ResolvedBackground {
  bg?: string;
  gradient?: [string, string];
}

export function resolveBackground(background?: LayoutBackground): ResolvedBackground {
  if (!background) return {};
  if (Array.isArray(background) && background.length >= 2) {
    return { gradient: background.slice(0, 2) as [string, string] };
  }
  return { bg: background as string };
}
