import React from 'react';
import { useSystemLayoutLogic, SystemLayoutProps } from './SystemLayout.logic';
import { useSystemLayoutStyle } from './SystemLayout.style';

/**
 * @component SystemLayout (Web)
 * @description
 * A foundational layout designed to encapsulate core system UI components or base app structure.
 * 
 * @role layout
 * @useCases 
 * - Providing a base wrapper that sets standard global flex behaviors.
 * - Encapsulating system-level elements like global alerts or modals alongside children.
 * 
 * @structure
 * - A simple column-based flex container taking up available space (`flex: 1`).
 * 
 * @accessibility
 * - Minimal impact on accessibility; acts as a structural `div`.
 * - Respects the semantic hierarchy defined by its children.
 */
const SystemLayout: React.FC<SystemLayoutProps> = (rawProps) => {
  const logic = useSystemLayoutLogic(rawProps);
  const styles = useSystemLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', flex: 1 } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default SystemLayout;
