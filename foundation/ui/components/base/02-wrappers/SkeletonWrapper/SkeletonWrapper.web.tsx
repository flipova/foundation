import React, { useEffect, useRef } from 'react';
import { useSkeletonWrapperLogic, SkeletonWrapperProps } from './SkeletonWrapper.logic';
import { useSkeletonWrapperStyle } from './SkeletonWrapper.style';

/**
 * @component SkeletonWrapper (Web)
 * @description
 * Web-optimized shimmer effect using standard CSS keyframe animations.
 * Achieves 60FPS fluid shimmer without JavaScript thread overhead.
 * 
 * @role wrapper
 * @useCases
 * - Placeholder for content that is loading.
 * - Simulating layout before data is fetched.
 * @structure
 * - Container `div` that houses children.
 * - An overlay `div` that renders the animated gradient.
 * @accessibility
 * - Includes a visual-only indicator; ARIA attributes (like aria-busy) should ideally be handled at a higher level or passed down.
 */
const SkeletonWrapperWeb: React.FC<SkeletonWrapperProps> = (rawProps) => {
  const logic = useSkeletonWrapperLogic(rawProps);
  const styles = useSkeletonWrapperStyle(logic);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logic.isLoading && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && !logic.hasMeasured) {
        logic.onLayout({ nativeEvent: { layout: { width: rect.width, height: rect.height, x: 0, y: 0 } } } as any);
      }
    }
  }, [logic.isLoading, logic.children]);

  return (
    <div 
      ref={containerRef}
      style={{
        ...styles.container,
        ...(logic.rest.style as any)
      }} 
      {...logic.rest}
    >
      <div style={logic.isLoading ? styles.childrenHidden : styles.childrenVisible}>
        {logic.children}
      </div>
      
      {logic.isLoading && logic.hasMeasured && (
        <>
          <div style={{
            ...styles.skeletonOverlay,
            animation: 'skeleton-shimmer 1.5s infinite linear',
            background: 'linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)',
            backgroundSize: '200% 100%',
          } as React.CSSProperties} />
          <style>
            {`
              @keyframes skeleton-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}
          </style>
        </>
      )}
    </div>
  );
};

export default SkeletonWrapperWeb;
