import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTabsLogic, TabsProps } from './Tabs.logic';
import { useTabsStyle } from './Tabs.style';

/**
 * A navigational component to switch between different views or content panes.
 * 
 * @role
 * Provides a tabbed interface allowing users to navigate between distinct sections of content within the same context.
 * 
 * @useCases
 * - Switching between different data categories (e.g., "Recent", "Favorites", "All").
 * - Navigating through different settings pages.
 * 
 * @structure
 * - Container `View` wrapping the tab bar and the content.
 * - Tab bar `View` holding multiple `Pressable` tabs.
 * - Content `View` displaying the active tab's `ReactNode`.
 * 
 * @accessibility
 * - The tab bar uses `accessibilityRole="tablist"`.
 * - Each tab uses `accessibilityRole="tab"`.
 * - The active state is conveyed to screen readers via `accessibilityState={{ selected: isActive }}`.
 */
const Tabs: React.FC<TabsProps> = (rawProps) => {
  const logic = useTabsLogic(rawProps);
  const styles = useTabsStyle(logic);

  const activeTabContent = logic.tabs.find((t) => t.key === logic.activeKey)?.content;

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      <View style={styles.tabBar as any} accessibilityRole="tablist">
        {logic.tabs.map((tab) => {
          const isActive = tab.key === logic.activeKey;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab as any, isActive && styles.tabActive]}
              onPress={() => logic.handleTabPress(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabText as any, isActive && styles.tabTextActive]}>
                {tab.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.contentContainer as any}>
        {activeTabContent}
      </View>
    </View>
  );
};

export default Tabs;
