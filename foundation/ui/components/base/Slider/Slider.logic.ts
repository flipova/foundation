import SliderMeta from './Slider.meta.yaml';

/**
 * Props for the Slider component.
 */
export interface SliderProps {
  /**
   * The current numerical value of the slider.
   */
  value?: number;
  
  /**
   * Callback fired when the slider value changes.
   */
  onValueChange?: (value: number) => void;
  
  /**
   * The minimum allowable value.
   */
  min?: number;
  
  /**
   * The maximum allowable value.
   */
  max?: number;
  
  /**
   * The step size between values.
   */
  step?: number;
  
  /**
   * If true, disables user interaction with the slider.
   */
  disabled?: boolean;
  
  /**
   * Additional props to pass to the container view.
   */
  [key: string]: any;
}

const META_DEFAULTS: Record<string, any> = {};
if (SliderMeta?.props) {
  SliderMeta.props.forEach((p: any) => {
    if (p.default !== undefined) META_DEFAULTS[p.name] = p.default;
  });
}

export function useSliderLogic(props: SliderProps) {
  const merged = { ...META_DEFAULTS, ...props };
  const { value = 0, onValueChange, min = 0, max = 100, step = 1, disabled, ...rest } = merged;

  // Calculate percentage for rendering
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return { value, onValueChange, min, max, step, disabled, percentage, rest };
}
