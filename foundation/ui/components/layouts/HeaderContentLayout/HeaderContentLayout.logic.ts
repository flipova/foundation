import { useMemo } from 'react';
import HeaderContentLayoutMeta from './HeaderContentLayout.meta.yaml';

/**
 * Props for the HeaderContentLayout component.
 */
export interface HeaderContentLayoutProps {
  /**
   * The React element to display in the fixed header area at the top.
   */
  header?: React.ReactNode;
  /**
   * The main React elements to display in the flexible content area below the header.
   */
  children?: React.ReactNode;
  /**
   * Additional properties to pass to the underlying React Native View wrapper.
   */
  [key: string]: any;
}

export function useHeaderContentLayoutLogic(props: HeaderContentLayoutProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (HeaderContentLayoutMeta?.props) {
      HeaderContentLayoutMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { header, children, ...rest } = merged;

  return { header, children, rest };
}
