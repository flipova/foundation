/**
 * PlatformOverride — Context to override platform detection in studio/preview mode.
 * When provided, useBreakpoint and usePlatformInfo will use these values instead of real ones.
 */
import React, { createContext, useContext } from 'react';
import type { BreakpointInfo } from './useBreakpoint';
import type { PlatformInfo } from './usePlatformInfo';

export interface PlatformOverrideValue {
  breakpoint?: BreakpointInfo;
  platform?: PlatformInfo;
}

const Ctx = createContext<PlatformOverrideValue | null>(null);

export const usePlatformOverride = () => useContext(Ctx);

export const PlatformOverrideProvider: React.FC<{ value: PlatformOverrideValue; children: React.ReactNode }> = ({ value, children }) => (
  <Ctx.Provider value={value}>{children}</Ctx.Provider>
);
