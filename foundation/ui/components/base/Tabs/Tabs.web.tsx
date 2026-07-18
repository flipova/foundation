/**
 * @role Tabs Component
 * @description A navigation element that allows users to switch between different views or sections of content.
 * @useCases Organizing related content into separate views, such as settings panels, product details, or dashboard views.
 * @structure Contains a `tablist` container with individual `tab` buttons, and a `tabpanel` container displaying the active content.
 * @accessibility Implements ARIA roles `tablist`, `tab`, and `tabpanel`. Uses `aria-selected` to indicate the active tab and ensures buttons are keyboard accessible.
 */
import React from 'react';
import { useTabsLogic, TabsProps } from './Tabs.logic';
import { useTabsStyle } from './Tabs.style';

const Tabs: React.FC<TabsProps> = (rawProps) => {
  const logic = useTabsLogic(rawProps);
  const styles = useTabsStyle(logic);

  const activeTabContent = logic.tabs.find((t) => t.key === logic.activeKey)?.content;

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      <div style={{ ...styles.tabBar, display: 'flex' } as React.CSSProperties} role="tablist">
        {logic.tabs.map((tab) => {
          const isActive = tab.key === logic.activeKey;
          return (
            <button
              key={tab.key}
              style={{
                ...styles.tab,
                ...(isActive ? styles.tabActive : {}),
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                outline: 'none',
              } as React.CSSProperties}
              onClick={() => logic.handleTabPress(tab.key)}
              role="tab"
              aria-selected={isActive}
            >
              <span style={{ ...styles.tabText, ...(isActive ? styles.tabTextActive : {}) } as React.CSSProperties}>
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>
      <div style={styles.contentContainer as React.CSSProperties} role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;
