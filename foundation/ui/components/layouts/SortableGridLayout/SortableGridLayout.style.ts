export function useSortableGridLayoutStyle(logic: any) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      width: '100%',
      position: 'relative',
    },
    itemWrapper: {
      padding: logic.spacing / 2,
    }
  };
}
