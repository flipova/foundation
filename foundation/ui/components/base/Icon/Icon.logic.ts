import { useMemo } from 'react';
import IconMeta from './Icon.meta.yaml';

/**
 * Props for the Icon component.
 */
export interface IconProps {
  /**
   * The name of the icon to render, corresponding to a component name in `lucide-react-native`.
   * e.g., 'Home', 'Settings'.
   */
  name: string;
  /**
   * The size of the icon in pixels. Defaults to 24.
   */
  size?: number;
  /**
   * The color of the icon. Falls back to the theme's foreground color if not specified.
   */
  color?: string;
  /**
   * Additional props to pass to the wrapping View container.
   */
  [key: string]: any;
}

export function useIconLogic(props: IconProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (IconMeta?.props) {
      IconMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { name, size, color, ...rest } = merged;

  return { name, size, color, rest };
}
