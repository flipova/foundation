import React from 'react';
import { useSidebarLayoutLogic, SidebarLayoutProps } from './SidebarLayout.logic';
import { useSidebarLayoutStyle } from './SidebarLayout.style';

/**
 * @component SidebarLayout (Web)
 * @description
 * Layout featuring a side navigation/content pane alongside a main content area.
 * 
 * @role layout
 * @useCases 
 * - Dashboards with a left or right navigation menu.
 * - Detail views with a persistent list on the side.
 * 
 * @structure
 * - Renders an `aside` element for the sidebar and a `main` element for the primary content.
 * - Uses flexbox to position the two panes side-by-side.
 * 
 * @accessibility
 * - Uses semantic HTML tags (`aside`, `main`) for better screen reader navigation.
 * - Ensure proper ARIA roles or labels if the sidebar functions as the primary navigation.
 */
const SidebarLayout: React.FC<SidebarLayoutProps> = (rawProps) => {
  const logic = useSidebarLayoutLogic(rawProps);
  const styles = useSidebarLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.sidebar && (
        <aside style={{ ...styles.sidebarContainer, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
          {logic.sidebar}
        </aside>
      )}
      <main style={{ ...styles.mainContainer, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
        {logic.children}
      </main>
    </div>
  );
};

export default SidebarLayout;
