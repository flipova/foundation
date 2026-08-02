/**
 * @module usePlatformRender
 * @description Hook to render different components based on platform
 */

import { useMemo } from 'react';
import { isWeb, isNative, isIOS, isAndroid } from '../utils/platform';

export interface PlatformRenderConfig<T> {
  web?: T;
  native?: T;
  ios?: T;
  android?: T;
  default?: T;
}

/**
 * Hook to select a value based on the current platform
 * 
 * @example
 * ```tsx
 * const Component = usePlatformRender({
 *   web: WebComponent,
 *   native: NativeComponent,
 *   ios: IOSSpecificComponent,
 * });
 * ```
 */
export function usePlatformRender<T>(config: PlatformRenderConfig<T>): T {
  return useMemo(() => {
    // Specific platform matches first (iOS, Android)
    if (isIOS && config.ios) return config.ios;
    if (isAndroid && config.android) return config.android;
    
    // Broader platform matches
    if (isWeb && config.web) return config.web;
    if (isNative && config.native) return config.native;
    
    // Fallback to default
    if (config.default) return config.default;
    
    // Return whatever is defined (for backwards compatibility)
    return config.native || config.web || config.ios || config.android || config.default as T;
  }, []);
}

/**
 * Hook to conditionally render based on platform
 * Returns a boolean indicating if current platform matches
 */
export function usePlatformCheck(platform: 'web' | 'native' | 'ios' | 'android'): boolean {
  return useMemo(() => {
    switch (platform) {
      case 'web':
        return isWeb;
      case 'native':
        return isNative;
      case 'ios':
        return isIOS;
      case 'android':
        return isAndroid;
      default:
        return false;
    }
  }, [platform]);
}
