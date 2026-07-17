import React from 'react';
import { Placeholder } from '../../Placeholder';
import { ScrollView, View } from 'react-native';
import { useSwipe2ScreenLayoutLogic, Swipe2ScreenLayoutProps } from './Swipe2ScreenLayout.logic';
import { useSwipe2ScreenLayoutStyle } from './Swipe2ScreenLayout.style';

/**
 * @component Swipe2ScreenLayout
 * @description A specialized horizontal layout component that allows swiping between exactly two distinct screens.
 * Useful for simple navigation patterns like tabbed views or split experiences where users can pan 
 * horizontally between two distinct primary areas.
 * @accessibility
 * - Includes standard horizontal ScrollView accessibility.
 * - Screen content should dictate their own accessibility roles.
 * - Paging enabled for easy traversal between the two sections.
 */
const Swipe2ScreenLayout: React.FC<Swipe2ScreenLayoutProps> = (rawProps) => {
  const logic = useSwipe2ScreenLayoutLogic(rawProps);
  const styles = useSwipe2ScreenLayoutStyle(logic);

  return (
    <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator={false}
      style={[styles.container as any, logic.rest.style]} 
      {...logic.rest}
    >
      <View style={styles.screen as any}>
        {logic.screen1 || <Placeholder label="screen1" />}
      </View>
      <View style={styles.screen as any}>
        {logic.screen2 || <Placeholder label="screen2" />}
      </View>
    </ScrollView>
  );
};

export default Swipe2ScreenLayout;
