/**
 * Styles for the HeaderContentLayout component.
 * 
 * Structural choices:
 * - 'container' uses column flex direction to naturally stack the header above the content.
 * - 'header' uses zIndex: 5 so that shadows or overlays from the header appear above the content.
 * - 'content' uses flex: 1 to consume all vertical space remaining after the header is rendered.
 */
export function useHeaderContentLayoutStyle(logic: any) {
  return {
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    header: {
      zIndex: 5,
    },
    content: {
      flex: 1,
    }
  };
}
