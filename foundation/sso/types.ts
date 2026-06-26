/**
 * SSO SDK — Types
 */

/** Supported SSO providers */
export type SSOProviderType = "flipova" | "google" | "custom";

/** Configuration passed to <SSOProvider> */
export interface SSOConfig {
  /** The identity provider to use */
  provider: SSOProviderType;
  /** OAuth2 client_id registered with the provider */
  clientId: string;
  /** Where the provider should redirect after login */
  redirectUri: string;
  /** OAuth2 scopes to request (defaults sensibly per provider) */
  scopes?: string[];
  /**
   * Custom provider options (only for provider: "custom").
   * Required fields: authorizationEndpoint, tokenEndpoint
   */
  custom?: {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint?: string;
    logoutEndpoint?: string;
  };
  /** Where to send unauthenticated users (default: current page) */
  loginPath?: string;
  /** Where to redirect after a successful login (default: "/") */
  postLoginPath?: string;
  /** If true, the SDK will auto-refresh tokens before they expire */
  autoRefresh?: boolean;
}

/** Authenticated user object returned by the SSO SDK */
export interface SSOUser {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  /** Raw claims from the id_token / userinfo endpoint */
  raw?: Record<string, unknown>;
}

/** OAuth2 token pair managed by the SDK */
export interface SSOTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number; // Unix timestamp (ms)
}

/** Value exposed by useSSOAuth() */
export interface SSOContextValue {
  /** Authenticated user, or null if not logged in */
  user: SSOUser | null;
  /** Raw token pair, or null */
  tokens: SSOTokens | null;
  /** True while the SDK is checking auth state (page load, token refresh…) */
  isLoading: boolean;
  /** Last error that occurred during auth flow */
  error: Error | null;
  /** Initiate the SSO login flow (redirects to the identity provider) */
  login: (options?: { prompt?: "none" | "login" | "consent" }) => Promise<void>;
  /** Clear the local session (and optionally revoke tokens server-side) */
  logout: (options?: { redirectTo?: string }) => Promise<void>;
  /** Force-refresh the access token */
  refreshToken: () => Promise<SSOTokens | null>;
  /** True if the user is authenticated */
  isAuthenticated: boolean;
}
