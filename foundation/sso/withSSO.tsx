/**
 * SSO SDK — withSSO Higher-Order Component
 *
 * Wraps a component to enforce authentication.
 * Redirects to login if the user is not authenticated.
 *
 * @example
 * export default withSSO(MyProtectedPage);
 * export default withSSO(MyProtectedPage, { fallback: <LoadingSpinner /> });
 */

import React, { ComponentType } from "react";
import { useSSOAuth } from "./useSSOAuth";

interface WithSSOOptions {
  /** Component to render while checking auth state */
  fallback?: React.ReactNode;
  /** Redirect to login automatically (default: true) */
  autoRedirect?: boolean;
  /** Component to render if not authenticated and autoRedirect is false */
  unauthenticated?: React.ReactNode;
}

export function withSSO<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithSSOOptions = {}
): ComponentType<P> {
  const {
    fallback = null,
    autoRedirect = true,
    unauthenticated = null,
  } = options;

  function SSOGuard(props: P) {
    const { isAuthenticated, isLoading, login } = useSSOAuth();

    if (isLoading) {
      return <>{fallback}</>;
    }

    if (!isAuthenticated) {
      if (autoRedirect) {
        void login();
        return <>{fallback}</>;
      }
      return <>{unauthenticated}</>;
    }

    return <WrappedComponent {...props} />;
  }

  SSOGuard.displayName = `withSSO(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return SSOGuard;
}
