/**
 * Resolves a LayoutPadding configuration object into individual pt/pb/pl/pr spacing props.
 * Eliminates duplicate padding calculation across layouts.
 */

import type { SpacingToken } from '../../tokens';
import type { LayoutPadding } from "../../types";

/**
 * Interface representing resolved padding values for top, bottom, left, and right.
 */
export interface ResolvedPadding {
  pt?: SpacingToken;
  pb?: SpacingToken;
  pl?: SpacingToken;
  pr?: SpacingToken;
}

/**
 * Resolves a layout padding definition (vertical/horizontal or top/bottom/left/right)
 * into an object containing individual directional padding tokens.
 *
 * @param padding - Layout padding configuration object.
 * @returns Object containing pt, pb, pl, and pr values.
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

