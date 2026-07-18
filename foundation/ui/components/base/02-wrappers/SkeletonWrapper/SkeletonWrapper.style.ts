export function useSkeletonWrapperStyle(logic: any) {
  return {
    container: {
      position: 'relative',
      alignSelf: 'flex-start', // Fit to children width if possible
    },
    skeletonOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: logic.dimensions.width,
      height: logic.dimensions.height,
      backgroundColor: '#E1E9EE',
      borderRadius: 8,
      overflow: 'hidden',
    },
    childrenHidden: {
      opacity: 0,
    },
    childrenVisible: {
      opacity: 1,
    }
  };
}
