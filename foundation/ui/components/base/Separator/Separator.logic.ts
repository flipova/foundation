import SeparatorMeta from './Separator.meta.yaml';

/**
 * Props for the Separator component.
 */
export interface SeparatorProps {
  /**
   * The orientation of the separator, deciding if it renders as a line horizontally or vertically.
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Additional props to pass down to the container View.
   */
  [key: string]: any;
}

const META_DEFAULTS: Record<string, any> = {};
if (SeparatorMeta?.props) {
  SeparatorMeta.props.forEach((p: any) => {
    if (p.default !== undefined) META_DEFAULTS[p.name] = p.default;
  });
}

export function useSeparatorLogic(props: SeparatorProps) {
  const merged = { ...META_DEFAULTS, ...props };
  const { orientation = 'horizontal', ...rest } = merged;

  return { orientation, rest };
}
