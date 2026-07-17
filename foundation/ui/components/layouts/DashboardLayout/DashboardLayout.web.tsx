import React from 'react';
import { useDashboardLayoutLogic, DashboardLayoutProps } from './DashboardLayout.logic';
import { useDashboardLayoutStyle } from './DashboardLayout.style';

/**
 * @component DashboardLayout
 * @description
 * A structured layout commonly used for admin panels and dashboards,
 * featuring a persistent sidebar and a main content area with an optional header.
 * 
 * @role layout
 * @useCases
 * - Admin interfaces, user account portals, and data visualization dashboards.
 * @structure
 * - Main flex container holding a sidebar (`aside`).
 * - Main content area (`main`) containing a header (`header`) and scrollable content.
 * @accessibility
 * - Uses semantic HTML tags (`aside`, `main`, `header`) for better screen reader navigation.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = (rawProps) => {
  const logic = useDashboardLayoutLogic(rawProps);
  const styles = useDashboardLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.sidebar && (
        <aside style={{ ...styles.sidebarContainer, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
          {logic.sidebar}
        </aside>
      )}
      <main style={{ ...styles.mainContainer, display: 'flex' } as React.CSSProperties}>
        {logic.header && (
          <header style={{ ...styles.headerContainer, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
            {logic.header}
          </header>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          {logic.children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
