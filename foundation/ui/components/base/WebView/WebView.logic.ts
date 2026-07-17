import { useMemo } from 'react';
import WebViewMeta from './WebView.meta.yaml';

/**
 * Props for the WebView component.
 */
export interface WebViewProps {
  /**
   * The URL or URI to load inside the web view.
   */
  source: string;

  /**
   * Additional custom props that will be passed to the container View.
   */
  [key: string]: any;
}

export function useWebViewLogic(props: WebViewProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (WebViewMeta?.props) {
      WebViewMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { source, ...rest } = merged;

  return { source, rest };
}
