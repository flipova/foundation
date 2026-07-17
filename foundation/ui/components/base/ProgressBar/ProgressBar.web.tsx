import React from 'react';
import { useProgressBarLogic, ProgressBarProps } from './ProgressBar.logic';
import { useProgressBarStyle } from './ProgressBar.style';

/**
 * Role: Visually represents the completion status of a task or process.
 * UseCases: Ideal for loading screens, upload/download progress, or multi-step wizards.
 * Structure: Composed of a background track container and a dynamically sized inner fill element reflecting the current progress.
 * Accessibility: Implements `role="progressbar"` along with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to communicate state to assistive technologies.
 */
const ProgressBar: React.FC<ProgressBarProps> = (rawProps) => {
  const logic = useProgressBarLogic(rawProps);
  const styles = useProgressBarStyle(logic);

  return (
    <div style={styles.container as React.CSSProperties} role="progressbar" aria-valuenow={logic.progress} aria-valuemin={0} aria-valuemax={100} {...logic.rest}>
      <div style={{ ...styles.fill, transition: 'width 0.3s ease' } as React.CSSProperties} />
    </div>
  );
};

export default ProgressBar;
