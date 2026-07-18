/**
 * Résout un LayoutPadding en props individuelles pt/pb/pl/pr.
 * Élimine la duplication dans 7+ layouts.
 */

import type { SpacingToken } from '../../tokens';
import type { LayoutPadding } from "../../types";

/**
 * Interface représentant les marges internes (padding) résolues pour chaque côté.
 */
export interface ResolvedPadding {
  pt?: SpacingToken;
  pb?: SpacingToken;
  pl?: SpacingToken;
  pr?: SpacingToken;
}

/**
 * Résout une définition de padding de layout (vertical/horizontal ou top/bottom/left/right)
 * en un objet avec des propriétés pour chaque direction.
 *
 * @param padding - Les espacements définis pour la disposition.
 * @returns Un objet contenant pt, pb, pl, et pr.
 */
export function resolveLayoutPadding(padding?: LayoutPadding): ResolvedPadding {
  if (!padding) return {};
  return {
    pt: padding.top ?? padding.vertical,
    pb: padding.bottom ?? padding.vertical,
    pl: padding.left ?? padding.horizontal,
    pr: padding.right ?? padding.horizontal,
  };
}

