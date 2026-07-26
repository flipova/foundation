/**
 * useSafeArea — Web Variant
 *
 * @description
 * Hook that provides safe-area inset dimensions by reading CSS environment variables.
 * Essential for PWA and standalone web apps that need to respect notched devices.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses CSS `env(safe-area-inset-*)` environment variables instead of React Native's useSafeAreaInsets.
 * Creates a hidden helper div and reads computed styles to extract inset values.
 * Falls back to 0 for all insets in browsers that don't support env() or during SSR.
 * Automatically re-reads on window resize to handle device orientation changes.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Helper div persists in DOM for performance (singleton pattern)
 * - Handles SSR gracefully with safe fallback
 * - Re-reads on resize for rotation and responsive viewport changes
 * - Most useful in PWA mode where notches/safe-area matter (iOS PWA, Samsung DEX, etc.)
 *
 * @example
 * ```typescript
 * const safeArea = useSafeArea();
 *
 * return (
 *   <div style={{
 *     paddingTop: safeArea.top,
 *     paddingBottom: safeArea.bottom,
 *     paddingLeft: safeArea.left,
 *     paddingRight: safeArea.right,
 *   }}>
 *     Content that respects notches
 *   </div>
 * );
 * ```
 *
 * @see
 * - MDN Web Docs: env() environment variables
 * - PWA safe-area standards for notched devices
 */

import { useEffect, useState } from 'react';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
  vertical: number;
  horizontal: number;
}

const ZERO: SafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0, vertical: 0, horizontal: 0 };

function readCSSInsets(): SafeAreaInsets {
  if (typeof window === 'undefined' || typeof document === 'undefined') return ZERO;

  // Inject a tiny helper div once to let the browser resolve env() values
  let el = document.getElementById('__fnd_safe_area__');
  if (!el) {
    el = document.createElement('div');
    el.id = '__fnd_safe_area__';
    el.style.cssText = [
      'position:fixed',
      'top:env(safe-area-inset-top,0px)',
      'right:env(safe-area-inset-right,0px)',
      'bottom:env(safe-area-inset-bottom,0px)',
      'left:env(safe-area-inset-left,0px)',
      'width:0',
      'height:0',
      'pointer-events:none',
      'visibility:hidden',
    ].join(';');
    document.body.appendChild(el);
  }

  const style = window.getComputedStyle(el);
  const parse = (v: string) => parseFloat(v) || 0;

  const top = parse(style.top);
  const right = parse(style.right);
  const bottom = parse(style.bottom);
  const left = parse(style.left);

  return {
    top,
    bottom,
    left,
    right,
    vertical: top + bottom,
    horizontal: left + right,
  };
}

/**
 * Hook to access safe-area inset dimensions on web.
 *
 * @returns Object containing inset sizes (top, bottom, left, right, vertical, horizontal).
 */
export const useSafeArea = (): SafeAreaInsets => {
  const [insets, setInsets] = useState<SafeAreaInsets>(() => {
    // Attempt a synchronous read so the first render is correct
    if (typeof window !== 'undefined') return readCSSInsets();
    return ZERO;
  });

  useEffect(() => {
    // Re-read after mount (in case env() wasn't resolved yet during SSR hydration)
    setInsets(readCSSInsets());

    // Viewport changes can shift safe areas (e.g. rotating a device)
    const handler = () => setInsets(readCSSInsets());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return insets;
};
