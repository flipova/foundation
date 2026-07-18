/**
 * @role Center Component
 * @description A layout primitive designed to center its children both horizontally and vertically.
 * @useCases Centering loading spinners, aligning empty state messages, or centering modals.
 * @structure Renders a flexbox `div` container with properties configured to center content on both axes.
 * @accessibility Purely visual layout component. Semantic meaning should be provided by its contents or specific ARIA attributes passed through props.
 */
import React from 'react';
import { useCenterLogic, CenterProps } from './Center.logic';
import { useCenterStyle } from './Center.style';

const Center: React.FC<CenterProps> = (rawProps) => {
  const logic = useCenterLogic(rawProps);
  const styles = useCenterStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'column' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default Center;
