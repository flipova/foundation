/**
 * Test stand-in for nativewind: its runtime needs the native `react-native` build. Components keep their `className`
 * as a plain prop, which is enough for rendering checks; class -> value parity is tested on the class lists instead.
 */
export const cssInterop = <T>(component: T) => component;
export const remapProps = <T>(component: T) => component;
export const styled = <T>(component: T) => component;
export const vars = (v: Record<string, string>) => v;
export const useColorScheme = () => ({
  colorScheme: 'light' as const,
  setColorScheme: () => {},
  toggleColorScheme: () => {},
});
export const useUnstableNativeVariable = () => undefined;
export const rem = { get: () => 14, set: () => {} };
