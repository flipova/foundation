/**
 * Résout un LayoutBackground (string | [string, string, ...]) en props bg + gradient.
 * Élimine la duplication dans AuthLayout, SidebarLayout, etc.
 */

import type { LayoutBackground } from "../../types";

/**
 * Interface représentant les propriétés de fond résolues (couleur unie ou dégradé).
 */
export interface ResolvedBackground {
  bg?: string;
  gradient?: [string, string];
}

/**
 * Résout une définition de fond de mise en page en un objet de propriétés (couleur unie ou dégradé).
 *
 * @param background - La configuration du fond (chaîne ou tableau de chaînes).
 * @returns Un objet ResolvedBackground contenant bg ou gradient.
 */
export function resolveBackground(background?: LayoutBackground): ResolvedBackground {
  if (!background) return {};
  if (Array.isArray(background) && background.length >= 2) {
    return { gradient: background.slice(0, 2) as [string, string] };
  }
  return { bg: background as string };
}

