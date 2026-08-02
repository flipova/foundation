/**
 * Styles for the FlipLayout component.
 * 
 * Structural choices:
 * - The container centers its children content.
 * - 'card' styling defines full width/height taking advantage of absolute positioning from logic.
 * - 'backfaceVisibility: hidden' ensures that the reversed views do not show their mirrored content during rotation.
 */
export function useFlipLayoutStyle(logic: any) {
  return {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
    },
    back: {
      position: 'absolute',
      top: 0,
    }
  };
}
