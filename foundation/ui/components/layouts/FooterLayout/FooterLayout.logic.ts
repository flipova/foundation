import { useMemo } from 'react';
import FooterLayoutMeta from './FooterLayout.meta.yaml';

/**
 * Props for the FooterLayout component.
 */
export interface FooterLayoutProps {
  /**
   * The React element to display in the persistent footer section at the bottom.
   */
  footer?: React.ReactNode;
  /**
   * The main content to render in the scrollable or flexible area above the footer.
   */
  children?: React.ReactNode;
  /**
   * Additional standard React Native View properties to pass to the container view.
   */
  [key: string]: any;
}

export function useFooterLayoutLogic(props: FooterLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (FooterLayoutMeta?.props) {
      FooterLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { footer, children, ...rest } = merged;

  return { footer, children, rest };
}
