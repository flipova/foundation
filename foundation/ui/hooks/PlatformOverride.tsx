/**
 * PlatformOverride — Context to override platform detection in preview mode.
 * When provided, useBreakpoint and usePlatformInfo will use these values instead of real ones.
 */
import React, { createContext, useContext } from 'react';
import type { BreakpointInfo } from './useBreakpoint';
import type { PlatformInfo } from './usePlatformInfo';

/**
 * Valeur de surcharge (override) pour la plateforme et les points d'arrêt (breakpoints).
 */
export interface PlatformOverrideValue {
  breakpoint?: BreakpointInfo;
  platform?: PlatformInfo;
}

const Ctx = createContext<PlatformOverrideValue | null>(null);

/**
 * Hook permettant d'accéder au contexte de surcharge de la plateforme.
 * 
 * @returns La valeur actuelle du contexte de surcharge ou null.
 */
export const usePlatformOverride = () => useContext(Ctx);

/**
 * Fournisseur de contexte pour la surcharge des informations de plateforme.
 *
 * @param props - Les propriétés, incluant la valeur de surcharge et les enfants.
 * @returns Un élément Provider de contexte.
 */
export const PlatformOverrideProvider: React.FC<{ value: PlatformOverrideValue; children: React.ReactNode }> = ({ value, children }) => (
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
);
