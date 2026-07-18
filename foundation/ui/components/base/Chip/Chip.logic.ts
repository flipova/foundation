import { useMemo } from 'react';
import ChipMeta from './Chip.meta.yaml';

/**
 * Properties for the Chip component.
 */
export interface ChipProps {
  /**
   * The text label to display inside the chip.
   */
  label: string;
  /**
   * Callback fired when the chip is pressed.
   */
  onPress?: () => void;
  /**
   * Callback fired when the delete icon is pressed.
   * If provided, a delete icon will be rendered.
   */
  onDelete?: () => void;
  /**
   * Whether the chip is currently in a selected state (affects visual styling).
   * @default false
   */
  selected?: boolean;
  /**
   * Whether the chip is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional properties to pass to the main wrapper component.
   */
  [key: string]: any;
}

export function useChipLogic(props: ChipProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ChipMeta?.props) {
      ChipMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { label, onPress, onDelete, selected, disabled, ...rest } = merged;

  return { label, onPress, onDelete, selected, disabled, rest };
}
