
export function useSidebarLayoutStyle(logic: any) {
  const isLeft = logic.sidebarPosition === 'left';
  return {
    /**
     * Container uses flex row or row-reverse to position the sidebar naturally
     * based on the specified position property.
     */
    container: {
      flex: 1,
      flexDirection: isLeft ? 'row' : 'row-reverse',
    },
    /**
     * The sidebar container has a fixed width and applies a border to separate it 
     * visually from the main content.
     */
    sidebarContainer: {
      width: logic.sidebarWidth,
      borderRightWidth: isLeft ? 1 : 0,
      borderLeftWidth: isLeft ? 0 : 1,
      borderColor: '#e5e7eb',
    },
    /**
     * The main container fills all remaining space adjacent to the sidebar.
     */
    mainContainer: {
      flex: 1,
    }
  };
}
