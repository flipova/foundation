import React, { useCallback, useRef } from 'react';
import { View, LayoutChangeEvent, ViewStyle, InteractionManager } from 'react-native';
import { useTutoContext } from './TutoContext';

export interface TutoElementProps {
  id: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * @component TutoElement
 * @description
 * Wraps an element and automatically registers its bounding box into the TutoLayout registry.
 * Uses measureLayout to calculate position relative to the TutoLayout root.
 */
export const TutoElement: React.FC<TutoElementProps> = ({ id, children, style }) => {
  const { registerElement, unregisterElement, rootRef } = useTutoContext();
  const viewRef = useRef<View>(null);

  const measureAndRegister = useCallback(() => {
    if (viewRef.current && rootRef.current) {
      viewRef.current.measureLayout(
        rootRef.current,
        (x, y, width, height) => {
          registerElement(id, { x, y, width, height });
        },
        () => {
          // Fallback if measureLayout fails (e.g. not in same view hierarchy yet)
        }
      );
    }
  }, [id, registerElement, rootRef]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    // Wait for the next tick to ensure layout is fully computed
    InteractionManager.runAfterInteractions(() => {
      measureAndRegister();
    });
  }, [measureAndRegister]);

  React.useEffect(() => {
    return () => {
      unregisterElement(id);
    };
  }, [id, unregisterElement]);

  return (
    <View ref={viewRef} style={style} onLayout={handleLayout} collapsable={false}>
      {children}
    </View>
  );
};

export default TutoElement;
