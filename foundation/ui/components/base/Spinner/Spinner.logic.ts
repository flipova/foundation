import SpinnerMeta from './Spinner.meta.yaml';

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps {
  /**
   * Size of the spinner. Usually 'small' or 'large'.
   * Numeric values fallback to 'small' on native platforms, though scaling could be applied.
   */
  size?: 'small' | 'large' | number;
  
  /**
   * Optional custom color for the spinner. Falls back to theme primary color.
   */
  color?: string;
  
  /**
   * Additional props to pass to the container view.
   */
  [key: string]: any;
}

const META_DEFAULTS: Record<string, any> = {};
if (SpinnerMeta?.props) {
  SpinnerMeta.props.forEach((p: any) => {
    if (p.default !== undefined) META_DEFAULTS[p.name] = p.default;
  });
}

export function useSpinnerLogic(props: SpinnerProps) {
  const merged = { ...META_DEFAULTS, ...props };
  const { size = 'small', color, ...rest } = merged;

  return { size, color, rest };
}
