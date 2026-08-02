import React, { useMemo } from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useBentoLayoutLogic, BentoLayoutProps } from './BentoLayout.logic';
import { useBentoLayoutStyle } from './BentoLayout.style';

/**
 * @component BentoLayout
 * @description
 * BentoLayout implements a "bento box" style grid, dynamically distributing its children 
 * into differently sized rectangular compartments. It aims to create an engaging, masonry-like
 * visual hierarchy.
 *
 * @useCases
 * - Dashboards displaying varying widgets (charts, stats, lists).
 * - Portfolios or media galleries requiring dynamic grid weighting.
 *
 * @structure
 * - Employs a flex-wrap row container to flow items continuously.
 * - Wraps each child in a container that simulates bento sizing (large, medium, or small)
 *   based on its positional index.
 *
 * @accessibility
 * - The semantic ordering matches the visual DOM flow. 
 * - Content should be naturally understandable in sequential order.
 */
const BentoLayout: React.FC<BentoLayoutProps> = (rawProps) => {
  const logic = useBentoLayoutLogic(rawProps);
  const styles = useBentoLayoutStyle(logic);

  // Naive automatic bento distribution for React Native (can be overridden by children)
  // Wrapped in useMemo to prevent unnecessary recalculations on re-renders
  const wrappedChildren = useMemo(() => {
    return React.Children.map(logic.children, (child, i) => {
      const isFirst = i === 0;
      const isEvenRow = Math.floor(i / 3) % 2 === 0;
      const style = isFirst ? styles.itemLarge : (isEvenRow ? styles.itemMedium : styles.itemSmall);
      
      return (
        <View key={i} style={style as any}>
          {child}
        </View>
      );
    });
  }, [logic.children, styles]);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {wrappedChildren}
    </View>
  );
};

export default BentoLayout;
