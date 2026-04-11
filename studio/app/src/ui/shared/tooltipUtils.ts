/**
 * tooltipUtils — Pure utility functions for Tooltip positioning.
 * No React Native imports — safe to use in tests and non-web contexts.
 */

export interface TooltipPosition {
  top: number;
  left: number;
}

export interface AnchorRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

/**
 * Compute tooltip position, repositioning to avoid right/bottom overflow.
 *
 * @param anchorRect - Bounding rect of the anchor element
 * @param tooltipWidth - Estimated tooltip width
 * @param tooltipHeight - Estimated tooltip height
 * @param windowWidth - Window inner width
 * @param windowHeight - Window inner height
 * @param offset - Vertical offset below anchor (default: 4)
 */
export function computeTooltipPosition(
  anchorRect: AnchorRect,
  tooltipWidth: number,
  tooltipHeight: number,
  windowWidth: number,
  windowHeight: number,
  offset = 4,
): TooltipPosition {
  let top = anchorRect.bottom + offset;
  let left = anchorRect.left;

  // Avoid right edge overflow
  if (left + tooltipWidth > windowWidth) {
    left = windowWidth - tooltipWidth - 8;
  }
  if (left < 0) left = 0;

  // Avoid bottom edge overflow — reposition above the anchor
  if (top + tooltipHeight > windowHeight) {
    top = anchorRect.top - tooltipHeight - offset;
  }
  if (top < 0) top = 0;

  return { top, left };
}
