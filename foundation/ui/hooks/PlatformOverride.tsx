/**
 * PlatformOverride — Context to override platform detection in preview mode.
 * When provided, useBreakpoint and usePlatformInfo will use these values instead of real ones.
 */
import React, { createContext, useContext } from 'react';
import type { BreakpointInfo } from './useBreakpoint';
import type { PlatformInfo } from './usePlatformInfo';

/**
 * Override value for platform detection and responsive breakpoints.
 */
export interface PlatformOverrideValue {
  breakpoint?: BreakpointInfo;
  platform?: PlatformInfo;
}

const Ctx = createContext<PlatformOverrideValue | null>(null);

/**
 * Hook to access the platform override context value.
 * 
 * @returns Current override context value or null.
 */
export const usePlatformOverride = () => useContext(Ctx);

/**
 * Context provider to override platform and breakpoint information.
 *
 * @param props - Component props containing override value and children.
 * @returns Context provider element.
 */
export const PlatformOverrideProvider: React.FC<{ value: PlatformOverrideValue; children: React.ReactNode }> = ({ value, children }) => (
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
);
