/**
 * TutoContext - Web Variant
 *
 * @description
 * React Context for managing tutorial element registration and layout measurements.
 * Replaces React Native LayoutRectangle with web-compatible DOMRect interface.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Defines web-specific LayoutRect interface matching DOMRect semantics.
 * Provides TutoContext for sharing element registrations across component tree.
 * Root ref points to HTMLDivElement instead of React Native View.
 * Manages element dimension tracking via registration/unregistration callbacks.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - LayoutRect compatible with HTML Element.getBoundingClientRect()
 * - Root ref enables relative position calculations for overlays
 * - Registry stored as Map for O(1) lookups
 * - Throws error if useTutoContext used outside provider
 *
 * @example
 * ```typescript
 * const context = useTutoContext();
 * // context.registerElement: (id, layout) => void
 * // context.registry: Map<string, LayoutRect>
 * // context.rootRef: React.RefObject<HTMLDivElement>
 * ```
 *
 * @see
 * - TutoLayout.logic.web.ts for layout logic
 * - TutoLayout.web.tsx for provider implementation
 */

import { createContext, useContext } from 'react';

/** Web equivalent of React Native's LayoutRectangle */
export interface LayoutRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TutoElementRegistry = Map<string, LayoutRect>;

export interface TutoContextType {
  /** Register a component's bounding rect */
  registerElement: (id: string, layout: LayoutRect) => void;
  /** Unregister a component */
  unregisterElement: (id: string) => void;
  /** The current registry map */
  registry: TutoElementRegistry;
  /** Reference to the root layout element for relative measurements */
  rootRef: React.RefObject<HTMLDivElement | null>;
}

export const TutoContext = createContext<TutoContextType | null>(null);

export const useTutoContext = (): TutoContextType => {
  const ctx = useContext(TutoContext);
  if (!ctx) {
    throw new Error('useTutoContext must be used within a TutoLayout');
  }
  return ctx;
};
