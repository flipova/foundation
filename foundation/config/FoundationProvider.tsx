/**
 * FoundationProvider
 *
 * Wraps the app with resolved config (tokens + themes).
 * Replaces the standalone ThemeProvider — this is the single entry point.
 *
 * Usage:
 * ```tsx
 * import { FoundationProvider } from "@flipova/foundation/config";
 * import config from "./flipova.config";
 *
 * export default function App() {
 *   return (
 *     <FoundationProvider config={config}>
 *       <MyApp />
 *     </FoundationProvider>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useMemo } from "react";
import { ThemeProvider } from "../theme/providers/ThemeProvider";
import type { FoundationConfig, ResolvedConfig } from "./index";
import { resolveConfig } from "./index";

const ConfigContext = createContext<ResolvedConfig | null>(null);

/**
 * Hook to retrieve the resolved Foundation configuration.
 * 
 * @returns The resolved configuration.
 * @throws Error if used outside a FoundationProvider.
 */
export function useFoundationConfig(): ResolvedConfig {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useFoundationConfig must be used within FoundationProvider");
  }
  return ctx;
}

/**
 * Hook to retrieve resolved design tokens.
 * 
 * @returns Resolved tokens object.
 */
export function useTokens(): ResolvedConfig["tokens"] {
  return useFoundationConfig().tokens;
}

/**
 * FoundationProvider props interface.
 */
interface FoundationProviderProps {
  children?: React.ReactNode;
  config?: FoundationConfig;
}

/**
 * Main Foundation Provider component.
 * 
 * Wraps the application with resolved configuration (tokens and themes).
 * Serves as the primary single entry point.
 * 
 * @param props - Configuration provider properties.
 * @returns Provider component wrapping children with context.
 *
 * @example
 * ```tsx
 * import { FoundationProvider } from "@flipova/foundation/config";
 * import config from "./flipova.config";
 *
 * export default function App() {
 *   return (
 *     <FoundationProvider config={config}>
 *       <MyApp />
 *     </FoundationProvider>
 *   );
 * }
 * ```
 */
export const FoundationProvider: React.FC<FoundationProviderProps> = ({
  children,
  config,
}) => {
  const resolved = useMemo(() => resolveConfig(config), [config]);

  return (
    <ConfigContext.Provider value={resolved}>
      <ThemeProvider
        defaultTheme={resolved.defaultTheme}
        customThemes={resolved.themes}
      >
        {children}
      </ThemeProvider>
    </ConfigContext.Provider>
  );
};
