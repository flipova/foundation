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
import type { FoundationConfig } from "./types";
import { resolveConfig, ResolvedConfig } from "./resolve";

const ConfigContext = createContext<ResolvedConfig | null>(null);

export function useFoundationConfig(): ResolvedConfig {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useFoundationConfig must be used within FoundationProvider");
  }
  return ctx;
}

export function useTokens(): ResolvedConfig["tokens"] {
  return useFoundationConfig().tokens;
}

interface FoundationProviderProps {
  children?: React.ReactNode;
  config?: FoundationConfig;
}

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
