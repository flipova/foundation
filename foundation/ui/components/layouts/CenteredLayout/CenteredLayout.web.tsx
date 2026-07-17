import React from 'react';
import { useCenteredLayoutLogic, CenteredLayoutProps } from './CenteredLayout.logic';
import { useCenteredLayoutStyle } from './CenteredLayout.style';

/**
 * @component CenteredLayout
 * @description
 * A simple layout that centers its content horizontally and vertically.
 * 
 * @role layout
 * @useCases
 * - Splash screens, error pages, or generic centered dialogs.
 * - Single focus point screens.
 * @structure
 * - Flexbox container with column direction centering children.
 * @accessibility
 * - Simple linear DOM structure, no special accessibility requirements beyond standard semantic HTML.
 */
const CenteredLayout: React.FC<CenteredLayoutProps> = (rawProps) => {
  const logic = useCenteredLayoutLogic(rawProps);
  const styles = useCenteredLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'column' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default CenteredLayout;
