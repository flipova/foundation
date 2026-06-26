/**
 * @flipova/foundation/sso
 *
 * Lightweight, framework-agnostic SSO SDK for React web applications.
 * Supports Flipova Accounts (OAuth2 PKCE), Google OAuth, and custom providers.
 *
 * @example
 * ```tsx
 * import { SSOProvider, useSSOAuth } from "@flipova/foundation/sso";
 *
 * // Wrap your app
 * <SSOProvider config={{ provider: "flipova", clientId: "...", redirectUri: "..." }}>
 *   <App />
 * </SSOProvider>
 *
 * // In a component
 * const { user, login, logout, isLoading } = useSSOAuth();
 * ```
 */

export type {
  SSOConfig,
  SSOUser,
  SSOTokens,
  SSOProviderType,
  SSOContextValue,
} from "./types";

export { SSOProvider } from "./SSOProvider";
export { useSSOAuth } from "./useSSOAuth";
export { withSSO } from "./withSSO";
export { createSSOClient } from "./client";
