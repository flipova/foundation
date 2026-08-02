import { useMemo } from 'react';
import AuthLayoutMeta from './AuthLayout.meta.yaml';

/**
 * Props for the AuthLayout component.
 */
export interface AuthLayoutProps {
  /**
   * The visual element to display alongside the authentication form.
   * Typically an Image or SVG component providing branding or context.
   */
  image?: React.ReactNode;
  /**
   * The authentication form components (e.g., inputs, buttons).
   * These are rendered within a centered, padded container.
   */
  children?: React.ReactNode;
  /**
   * Allows overriding standard View properties and extending with custom layout attributes.
   */
  [key: string]: any;
}

export function useAuthLayoutLogic(props: AuthLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (AuthLayoutMeta?.props) {
      AuthLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { image, children, ...rest } = merged;

  return { image, children, rest };
}
