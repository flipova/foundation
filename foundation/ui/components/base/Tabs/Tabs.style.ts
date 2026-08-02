import { useTheme } from "../../../../theme/providers/ThemeProvider";

export function useTabsStyle(logic: any) {
  const { theme } = useTheme();

  return {
    container: {
      /* Stack the tab bar above the content area vertically */
      flexDirection: 'column',
      width: '100%',
    },
    tabBar: {
      /* Lay out the tabs horizontally next to each other */
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme?.border || '#e5e7eb',
      /* Add some space below the tab bar before the content begins */
      marginBottom: 16,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderBottomWidth: 2,
      /* Transparent border by default to prevent layout shift when active border appears */
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: theme?.primary || '#000',
    },
    tabText: {
      color: theme?.mutedForeground || '#6b7280',
      fontSize: 14,
      fontWeight: '500',
    },
    tabTextActive: {
      color: theme?.primary || '#000',
      fontWeight: '600',
    },
    contentContainer: {
      /* Allow the content to fill the remaining available vertical space */
      flex: 1,
    }
  };
}
