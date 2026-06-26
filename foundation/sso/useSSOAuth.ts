/**
 * SSO SDK — useSSOAuth hook
 *
 * Returns the full SSO context: user, tokens, login/logout, loading state.
 * Must be used inside <SSOProvider>.
 */

import { useSSOContext } from "./SSOProvider";
import type { SSOContextValue } from "./types";

export function useSSOAuth(): SSOContextValue {
  return useSSOContext();
}
