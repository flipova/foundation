/**
 * PlatformSimulator — Provides simulated platform/breakpoint context for the canvas.
 * Components inside this provider will see the simulated device dimensions and platform.
 */
import React, { createContext, useContext, useMemo } from 'react';
import { PlatformOverrideProvider } from '../../../../foundation/layout/hooks/PlatformOverride';
import { getBreakpoint } from '../../../../foundation/layout/utils/responsive';

export interface SimulatedPlatform {
  os: 'ios' | 'android' | 'web';
  width: number;
  height: number;
  isSimulated: boolean;
}

const SimCtx = createContext<SimulatedPlatform>({ os: 'web', width: 390, height: 844, isSimulated: false });

export const useSimulatedPlatform = () => useContext(SimCtx);

export const PlatformSimulator: React.FC<{ device: string; width: number; height: number; children: React.ReactNode }> = ({ device, width, height, children }) => {
  const isAndroid = device.includes('Pixel');
  const isDesktop = device.includes('Desktop');
  const os = isDesktop ? 'web' as const : isAndroid ? 'android' as const : 'ios' as const;

  const simValue = useMemo<SimulatedPlatform>(() => ({ os, width, height, isSimulated: true }), [os, width, height]);

  const bp = getBreakpoint(width);
  const MOBILE = ['xs', 'sm'];
  const DESKTOP_BP = ['lg', 'xl', '2xl'];

  const overrideValue = useMemo(() => ({
    breakpoint: {
      breakpoint: bp,
      isMobile: MOBILE.includes(bp),
      isTablet: bp === 'md',
      isDesktop: DESKTOP_BP.includes(bp),
      isAtLeastTablet: !MOBILE.includes(bp),
      isAtLeastDesktop: DESKTOP_BP.includes(bp),
    },
    platform: {
      isWeb: os === 'web',
      isNative: os !== 'web',
      isIOS: os === 'ios',
      isAndroid: os === 'android',
    },
  }), [bp, os]);

  return (
    <SimCtx.Provider value={simValue}>
      <PlatformOverrideProvider value={overrideValue}>
        {children}
      </PlatformOverrideProvider>
    </SimCtx.Provider>
  );
};

export default PlatformSimulator;
