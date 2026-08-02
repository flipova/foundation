import { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

/**
 * Props for the SkeletonWrapper component.
 */
export interface SkeletonWrapperProps {
  /** Whether the component is currently loading. If true, shows skeleton. */
  isLoading: boolean;
  /** Children elements to measure and optionally render */
  children: React.ReactNode;
  /** Any other props for the container */
  [key: string]: any;
}

export function useSkeletonWrapperLogic(rawProps: SkeletonWrapperProps) {
  const { isLoading, children, ...rest } = rawProps;
  
  // Track layout dimensions to size the skeleton properly
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasMeasured, setHasMeasured] = useState(false);

  const onLayout = (e: LayoutChangeEvent) => {
    // Capture layout for the overlay sizing
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
      setHasMeasured(true);
    }
  };

  return {
    isLoading,
    children,
    dimensions,
    hasMeasured,
    onLayout,
    rest
  };
}
