/**
 * SSO SDK — OAuth2 PKCE Client
 *
 * Handles the low-level OAuth2 Authorization Code + PKCE flow.
 * Works in any modern browser (uses Web Crypto API).
 */

import type { SSOConfig, SSOTokens, SSOUser } from "./types";

// ── Provider endpoints ────────────────────────────────────────────────────────

const PROVIDER_ENDPOINTS = {
  flipova: {
    authorizationEndpoint: "https://accounts.flipova.com/oauth2/authorize",
    tokenEndpoint: "https://accounts.flipova.com/oauth2/token",
    userInfoEndpoint: "https://accounts.flipova.com/oauth2/userinfo",
    logoutEndpoint: "https://accounts.flipova.com/oauth2/logout",
  },
  google: {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
    logoutEndpoint: "https://oauth2.googleapis.com/revoke",
  },
};

const DEFAULT_SCOPES: Record<string, string[]> = {
  flipova: ["openid", "profile", "email"],
  google: ["openid", "profile", "email"],
  custom: ["openid", "profile", "email"],
};

// ── PKCE Helpers ──────────────────────────────────────────────────────────────

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array)).replace(/[^a-zA-Z0-9]/g, "");
}

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_PREFIX = "__flipova_sso_";

function storageSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, value);
  } catch {
    // sessionStorage may be unavailable in some browser contexts
  }
}

function storageGet(key: string): string | null {
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    return null;
  }
}

function storageRemove(key: string): void {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // ignore
  }
}

// ── Token storage (localStorage for persistence) ──────────────────────────────

const TOKEN_KEY = "__flipova_sso_tokens";

export function saveTokens(tokens: SSOTokens): void {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  } catch {
    // ignore
  }
}

export function loadTokens(): SSOTokens | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const tokens = JSON.parse(raw) as SSOTokens;
    if (tokens.expiresAt < Date.now()) return null; // expired
    return tokens;
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// ── SSO Client ────────────────────────────────────────────────────────────────

export interface SSOClient {
  login(options?: { prompt?: "none" | "login" | "consent" }): Promise<void>;
  handleCallback(): Promise<SSOTokens>;
  refreshToken(refreshToken: string): Promise<SSOTokens>;
  fetchUser(accessToken: string): Promise<SSOUser>;
  logout(options?: { redirectTo?: string }): Promise<void>;
  getEndpoints(): {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint?: string;
    logoutEndpoint?: string;
  };
}

export function createSSOClient(config: SSOConfig): SSOClient {
  const endpoints =
    config.provider === "custom"
      ? config.custom!
      : PROVIDER_ENDPOINTS[config.provider];

  const scopes = config.scopes ?? DEFAULT_SCOPES[config.provider] ?? ["openid", "profile", "email"];

  return {
    getEndpoints: () => endpoints,

    async login({ prompt } = {}) {
      const verifier = generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      const state = generateState();

      storageSet("code_verifier", verifier);
      storageSet("state", state);
      storageSet("post_login_path", config.postLoginPath ?? "/");

      const params = new URLSearchParams({
        response_type: "code",
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: scopes.join(" "),
        state,
        code_challenge: challenge,
        code_challenge_method: "S256",
        ...(prompt ? { prompt } : {}),
      });

      window.location.href = `${endpoints.authorizationEndpoint}?${params.toString()}`;
    },

    async handleCallback(): Promise<SSOTokens> {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const returnedState = params.get("state");
      const error = params.get("error");

      if (error) {
        throw new Error(`SSO error: ${error} — ${params.get("error_description") ?? ""}`);
      }

      if (!code) {
        throw new Error("SSO callback: missing authorization code");
      }

      const savedState = storageGet("state");
      if (!savedState || savedState !== returnedState) {
        throw new Error("SSO callback: state mismatch — possible CSRF attack");
      }

      const verifier = storageGet("code_verifier");
      if (!verifier) {
        throw new Error("SSO callback: missing PKCE verifier");
      }

      storageRemove("state");
      storageRemove("code_verifier");

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        code,
        code_verifier: verifier,
      });

      const res = await fetch(endpoints.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`SSO token exchange failed: ${text}`);
      }

      const data = await res.json();
      const tokens: SSOTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
        expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
      };

      saveTokens(tokens);
      return tokens;
    },

    async refreshToken(refreshTokenValue: string): Promise<SSOTokens> {
      const body = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: config.clientId,
        refresh_token: refreshTokenValue,
      });

      const res = await fetch(endpoints.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!res.ok) {
        throw new Error("SSO token refresh failed");
      }

      const data = await res.json();
      const tokens: SSOTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? refreshTokenValue,
        idToken: data.id_token,
        expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
      };

      saveTokens(tokens);
      return tokens;
    },

    async fetchUser(accessToken: string): Promise<SSOUser> {
      const userInfoUrl = endpoints.userInfoEndpoint;
      if (!userInfoUrl) {
        throw new Error("This provider does not expose a userinfo endpoint");
      }

      const res = await fetch(userInfoUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw new Error("SSO userinfo fetch failed");
      }

      const data = await res.json();
      return {
        id: data.sub ?? data.id ?? "",
        email: data.email ?? "",
        name: data.name,
        displayName: data.name ?? data.preferred_username,
        avatarUrl: data.picture ?? data.avatar_url,
        raw: data,
      };
    },

    async logout({ redirectTo } = {}) {
      clearTokens();
      const logoutUrl = endpoints.logoutEndpoint;
      if (logoutUrl) {
        const params = new URLSearchParams({
          client_id: config.clientId,
          ...(redirectTo ? { post_logout_redirect_uri: redirectTo } : {}),
        });
        window.location.href = `${logoutUrl}?${params.toString()}`;
      } else {
        window.location.href = redirectTo ?? config.loginPath ?? "/";
      }
    },
  };
}
