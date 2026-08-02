import { useMemo } from 'react';
import ProgressBarMeta from './ProgressBar.meta.yaml';

/**
 * Props for the ProgressBar component.
 */
export interface ProgressBarProps {
  /**
   * The current progress value as a percentage (from 0 to 100).
   */
  progress?: number;
  
  /**
   * Additional props to pass down to the container View.
   */
  [key: string]: any;
}

const META_DEFAULTS: Record<string, any> = {};
if (ProgressBarMeta?.props) {
  ProgressBarMeta.props.forEach((p: any) => {
    if (p.default !== undefined) META_DEFAULTS[p.name] = p.default;
  });
}

export function useProgressBarLogic(props: ProgressBarProps) {
  const merged = { ...META_DEFAULTS, ...props };
  const { progress = 0, ...rest } = merged;

  // Ensure progress stays within bounds [0, 100]
  const validProgress = Math.max(0, Math.min(100, progress));

  return { progress: validProgress, rest };
}
