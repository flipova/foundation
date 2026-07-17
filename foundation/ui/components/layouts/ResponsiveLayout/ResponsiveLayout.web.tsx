import React from 'react';
import { useResponsiveLayoutLogic, ResponsiveLayoutProps } from './ResponsiveLayout.logic';
import { useResponsiveLayoutStyle } from './ResponsiveLayout.style';

/**
 * @component ResponsiveLayout (Web)
 * @description
 * Flexible layout that adapts to different screen sizes and orientations.
 * 
 * @role layout
 * @useCases 
 * - Building general application wrappers that adapt to mobile, tablet, and desktop views.
 * - Adapting UI structure based on media queries or container dimensions.
 * 
 * @structure
 * - Provides a basic flexbox container wrapper.
 * - Designed to work seamlessly with logic hooks to handle breakpoints.
 * 
 * @accessibility
 * - Relies on standard flexbox; ensure correct DOM ordering of children.
 * - Screen readers will process the children in the order they are rendered.
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = (rawProps) => {
  const logic = useResponsiveLayoutLogic(rawProps);
  const styles = useResponsiveLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default ResponsiveLayout;
