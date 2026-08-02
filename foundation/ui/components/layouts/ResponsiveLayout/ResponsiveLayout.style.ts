
export function useResponsiveLayoutStyle(logic: any) {
  return {
    /**
     * The container flexes to fill available space.
     * Flex direction is determined by the responsive breakpoint logic:
     * 'row' for wide screens, 'column' for narrow screens.
     */
    container: {
      flex: 1,
      flexDirection: logic.isDesktop ? 'row' : 'column',
    }
  };
}
