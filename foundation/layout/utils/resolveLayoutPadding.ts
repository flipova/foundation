/**
 * Résout un LayoutPadding en props individuelles pt/pb/pl/pr.
 * Élimine la duplication dans 7+ layouts.
 */

import type { SpacingToken } from "../../tokens/spacing";
import type { LayoutPadding } from "../types";

export interface ResolvedPadding {
  pt?: SpacingToken;
  pb?: SpacingToken;
  pl?: SpacingToken;
  pr?: SpacingToken;
}

export function resolveLayoutPadding(padding?: LayoutPadding): ResolvedPadding {
  if (!padding) return {};
  return {
    pt: padding.top ?? padding.vertical,
    pb: padding.bottom ?? padding.vertical,
    pl: padding.left ?? padding.horizontal,
    pr: padding.right ?? padding.horizontal,
  };
}
