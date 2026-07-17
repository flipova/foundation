/**
 * useStudioItems — Standard hook for multi-item layouts.
 *
 * When a layout receives an empty items array (e.g. freshly dropped in Studio),
 * returns placeholder ReactNode items so the layout renders visibly.
 *
 * ## Standard for multi-item layouts
 *
 * A multi-item layout (DeckLayout, SwiperLayout, GridLayout, BentoLayout,
 * MasonryLayout, ParallaxLayout, CrossTabLayout, FlipLayout...) follows this contract:
 *
 * ### Registry (layouts.ts)
 * ```ts
 * {
 *   id: "MyLayout",
 *   slots: [{ name: "items", label: "Items", required: true, array: true }],
 *   previewItemCount: 4,  // how many placeholders/template copies to show
 *   props: [...]
 * }
 * ```
 * - Slot name must NOT be "children" (use "items", "cards", "slides", etc.)
 * - `array: true` triggers mode "items" in slotConfig → ItemsRenderer
 *
 * ### Component (MyLayout.tsx)
 * ```ts
 * interface MyLayoutProps {
 *   items?: React.ReactNode[];       // new standard prop
 *   children?: React.ReactNode | React.ReactNode[]; // backward compat
 * }
 * const resolvedItems = useStudioItems(items ?? [], previewCount, placeholder);
 * ```
 *
 * ### Three rendering modes (handled by ItemsRenderer in Studio)
 * 1. **Static** — N children dropped → N items
 * 2. **Template** — 1 child with repeatBinding → N copies (edit preview)
 * 3. **Data** — layout has repeatBinding → resolve $state.alias → N items
 *
 * Usage:
 *   const resolvedItems = useStudioItems(items, previewItemCount, renderPlaceholder);
 */

import React from "react";

/**
 * Detects whether a React node is an InsertZone element by checking for the
 * `$insertZone` marker on the element's type or props. This avoids relying on
 * display name strings, which are not stable across minification.
 */
function isInsertZone(el: React.ReactNode): boolean {
  if (!React.isValidElement(el)) return false;
  const t = el.type as any;
  return t?.$insertZone === true || (el.props as any)?.$insertZone === true;
}

/**
 * Hook utilitaire pour les mises en page (layouts) à éléments multiples dans le studio.
 * Retourne des éléments de substitution (placeholders) lorsque la liste d'éléments est vide.
 *
 * @param items - Le tableau d'éléments réels provenant des propriétés.
 * @param count - Le nombre d'éléments de substitution à afficher.
 * @param placeholder - Une fonction de fabrication pour générer un élément de substitution en fonction de son index.
 * @returns Le tableau d'éléments résolu ou des éléments de substitution.
 */
export function useStudioItems(
  items: React.ReactNode[],
  count: number,
  placeholder: (index: number) => React.ReactNode,
): React.ReactNode[] {
  const safe = Array.isArray(items) ? items : [];
  if (safe.length === 1 && isInsertZone(safe[0])) return safe; // passthrough
  if (safe.length > 0) return safe;
  return Array.from({ length: Math.max(1, count) }, (_, i) => placeholder(i));
}
