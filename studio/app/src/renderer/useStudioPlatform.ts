/**
 * Studio platform hooks — Override foundation hooks with simulated values.
 * These are used by the studio renderer to make components behave as if
 * they're running on the simulated device.
 */
import { useSimulatedPlatform } from './PlatformSimulator';
import { getBreakpoint } from '../../../../foundation/layout/utils/responsive';

export function useStudioBreakpoint() {
  const sim = useSimulatedPlatform();
  if (!sim.isSimulated) return null;
  const bp = getBreakpoint(sim.width);
  const MOBILE = ['xs', 'sm'];
  const DESKTOP = ['lg', 'xl', '2xl'];
  return {
    breakpoint: bp,
    isMobile: MOBILE.includes(bp),
    isTablet: bp === 'md',
    isDesktop: DESKTOP.includes(bp),
    isAtLeastTablet: !MOBILE.includes(bp),
    isAtLeastDesktop: DESKTOP.includes(bp),
  };
}

export function useStudioPlatformInfo() {
  const sim = useSimulatedPlatform();
  if (!sim.isSimulated) return null;
  return {
    isWeb: sim.os === 'web',
    isNative: sim.os !== 'web',
    isIOS: sim.os === 'ios',
    isAndroid: sim.os === 'android',
  };
}
