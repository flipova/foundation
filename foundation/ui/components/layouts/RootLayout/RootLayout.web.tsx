import React from 'react';
import { useRootLayoutLogic, RootLayoutProps } from './RootLayout.logic';
import { useRootLayoutStyle } from './RootLayout.style';

/**
 * @component RootLayout (Web)
 * @description
 * The top-level layout wrapper for the application on web.
 * 
 * @role layout
 * @useCases 
 * - Wrapping the entire app to provide a minimum height of `100vh`.
 * - Establishing the main flex column structure for headers, content, and footers.
 * 
 * @structure
 * - Renders a full-height flex container (`minHeight: 100vh`, `flexDirection: column`).
 * - Serves as the mounting point for application-level providers or wrappers.
 * 
 * @accessibility
 * - Can be designated as the main content landmark if appropriately tagged.
 * - Provides a stable viewport foundation for screen readers.
 */
const RootLayout: React.FC<RootLayoutProps> = (rawProps) => {
  const logic = useRootLayoutLogic(rawProps);
  const styles = useRootLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', minHeight: '100vh' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default RootLayout;
