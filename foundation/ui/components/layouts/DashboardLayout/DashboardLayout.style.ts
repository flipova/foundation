
export function useDashboardLayoutStyle(logic: any) {
  return {
    // Horizontal flex layout to place the sidebar and main content side-by-side.
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    // Sidebar uses a fixed width determined by logic, and a right border for visual separation.
    sidebarContainer: {
      width: logic.sidebarWidth,
      borderRightWidth: 1,
      borderRightColor: '#e5e7eb',
    },
    // Main area takes up all remaining horizontal space, switching to a column layout 
    // to stack the header above the children.
    mainContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    // Header gets a bottom border to delineate it from the main content.
    headerContainer: {
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    }
  };
}
