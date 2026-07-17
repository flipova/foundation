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
 * Hook pour obtenir la configuration résolue de Foundation.
 * 
 * @returns La configuration résolue.
 * @throws Erreur s'il est utilisé en dehors d'un FoundationProvider.
 */
export function useFoundationConfig(): ResolvedConfig {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error("useFoundationConfig must be used within FoundationProvider");
  }
  return ctx;
}

/**
 * Hook pour obtenir les tokens résolus.
 * 
 * @returns Les tokens résolus.
 */
export function useTokens(): ResolvedConfig["tokens"] {
  return useFoundationConfig().tokens;
}

/**
 * Propriétés du FoundationProvider.
 */
interface FoundationProviderProps {
  children?: React.ReactNode;
  config?: FoundationConfig;
}

/**
 * Fournisseur principal de Foundation.
 * 
 * Enveloppe l'application avec la configuration résolue (tokens et thèmes).
 * Remplace le ThemeProvider autonome et sert de point d'entrée unique.
 * 
 * @param props - Les propriétés du fournisseur de configuration.
 * @returns Le composant fournisseur encapsulant les enfants avec le contexte.
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
