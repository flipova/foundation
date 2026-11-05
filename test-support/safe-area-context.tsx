import React from 'react';

/** Test stand-in for react-native-safe-area-context (its native specs cannot load under react-native-web). No insets. */
const insets = { top: 0, right: 0, bottom: 0, left: 0 };
export const SafeAreaInsetsContext = React.createContext<typeof insets | null>(insets);
export const SafeAreaFrameContext = React.createContext({ x: 0, y: 0, width: 0, height: 0 });
export const SafeAreaProvider = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const SafeAreaConsumer = SafeAreaInsetsContext.Consumer;
export const useSafeAreaInsets = () => insets;
export const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 0, height: 0 });
export const initialWindowMetrics = null;
export const SafeAreaView = ({ children, ...p }: { children?: React.ReactNode } & Record<string, unknown>) => (
  <div {...(p as object)}>{children}</div>
);
