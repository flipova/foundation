import React from 'react';
import { Placeholder } from '../../Placeholder';
import { ScrollView, View } from 'react-native';
import { useSwiperLayoutLogic, SwiperLayoutProps } from './SwiperLayout.logic';
import { useSwiperLayoutStyle } from './SwiperLayout.style';

/**
 * @component SwiperLayout
 * @description A horizontal swiping layout that allows paginated navigation through a dynamic 
 * list of children elements. Good for carousels or multi-step flows.
 * @accessibility
 * - ScrollView is inherently accessible, exposing the content as a single scrollable container.
 * - Paging enabled allows screen readers to navigate smoothly across pages.
 */
const SwiperLayout: React.FC<SwiperLayoutProps> = (rawProps) => {
  const logic = useSwiperLayoutLogic(rawProps);
  const styles = useSwiperLayoutStyle(logic);

  return (
    <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator={false}
      style={[styles.container as any, logic.rest.style]} 
      {...logic.rest}
    >
      {React.Children.map(logic.children, (child, index) => (
        <View key={index} style={styles.slide as any}>
          {child}
        </View>
      ))}
    </ScrollView>
  );
};

export default SwiperLayout;
