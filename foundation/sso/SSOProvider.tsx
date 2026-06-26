/**
 * SSO SDK — React Context Provider
 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { SSOConfig, SSOContextValue, SSOTokens, SSOUser } from "./types";
import { createSSOClient, clearTokens, loadTokens, saveTokens } from "./client";

const SSOContext = createContext<SSOContextValue | null>(null);

export interface SSOProviderProps {
  config: SSOConfig;
  children: React.ReactNode;
}

export function SSOProvider({ config, children }: SSOProviderProps) {
  const [user, setUser] = useState<SSOUser | null>(null);
  const [tokens, setTokens] = useState<SSOTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const clientRef = useRef(createSSOClient(config));
  // Recreate client if config changes
  useEffect(() => {
    clientRef.current = createSSOClient(config);
  }, [config.provider, config.clientId, config.redirectUri]);

  const client = clientRef.current;

  // On mount: check for callback params, then restore session
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams(window.location.search);

      // Callback handling
      if (params.has("code") && params.has("state")) {
        try {
          const newTokens = await client.handleCallback();
          const newUser = await client.fetchUser(newTokens.accessToken);
          setTokens(newTokens);
          setUser(newUser);
          // Clean URL
          const postLoginPath = sessionStorage.getItem("__flipova_sso_post_login_path") ?? "/";
          sessionStorage.removeItem("__flipova_sso_post_login_path");
          window.history.replaceState({}, "", postLoginPath);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Restore persisted session
      const saved = loadTokens();
      if (saved) {
        try {
          // Try to fetch user with stored token
          const savedUser = await client.fetchUser(saved.accessToken);
          setTokens(saved);
          setUser(savedUser);
        } catch {
          // Token may be expired — try refresh
          if (saved.refreshToken && config.autoRefresh !== false) {
            try {
              const refreshed = await client.refreshToken(saved.refreshToken);
              const refreshedUser = await client.fetchUser(refreshed.accessToken);
              setTokens(refreshed);
              setUser(refreshedUser);
            } catch {
              clearTokens();
            }
          } else {
            clearTokens();
          }
        }
      }

      setIsLoading(false);
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh: schedule a token refresh 60s before expiry
  useEffect(() => {
    if (!tokens?.refreshToken || config.autoRefresh === false) return;
    const delay = tokens.expiresAt - Date.now() - 60_000;
    if (delay <= 0) return;

    const timer = setTimeout(async () => {
      try {
        const refreshed = await client.refreshToken(tokens.refreshToken!);
        const refreshedUser = await client.fetchUser(refreshed.accessToken);
        setTokens(refreshed);
        setUser(refreshedUser);
      } catch {
        setUser(null);
        setTokens(null);
        clearTokens();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [tokens?.expiresAt]);

  const login = useCallback(
    async (options?: { prompt?: "none" | "login" | "consent" }) => {
      setError(null);
      await client.login(options);
    },
    [client]
  );

  const logout = useCallback(
    async (options?: { redirectTo?: string }) => {
      setUser(null);
      setTokens(null);
      setError(null);
      await client.logout(options);
    },
    [client]
  );

  const refreshToken = useCallback(async (): Promise<SSOTokens | null> => {
    if (!tokens?.refreshToken) return null;
    try {
      const refreshed = await client.refreshToken(tokens.refreshToken);
      const refreshedUser = await client.fetchUser(refreshed.accessToken);
      setTokens(refreshed);
      setUser(refreshedUser);
      return refreshed;
    } catch (err) {
      setUser(null);
      setTokens(null);
      clearTokens();
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, [tokens, client]);

  const value: SSOContextValue = {
    user,
    tokens,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refreshToken,
  };

  return <SSOContext.Provider value={value}>{children}</SSOContext.Provider>;
}

/** Internal hook — use useSSOAuth() in consumer code */
export function useSSOContext(): SSOContextValue {
  const ctx = useContext(SSOContext);
  if (!ctx) {
    throw new Error("useSSOAuth / useSSOContext must be used inside <SSOProvider>");
  }
  return ctx;
}
