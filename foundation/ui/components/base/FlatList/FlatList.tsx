import React from 'react';
import { FlatList as RNFlatList } from 'react-native';
import { useFlatListLogic, FlatListProps } from './FlatList.logic';
import { useFlatListStyle } from './FlatList.style';

/**
 * FlatList component is a wrapper around React Native's FlatList for efficient rendering of large data lists.
 * 
 * Role & Use Cases:
 * Use this component whenever you need to display a scrollable list of items, such as feeds, contact lists, or menus.
 * It is highly performant as it only renders items currently visible on the screen.
 * 
 * Structure:
 * Extends the native `FlatList` and automatically applies theme-based styling and meta configurations.
 * 
 * Accessibility:
 * Inherits the standard list accessibility features from React Native. Ensure to pass appropriate accessibility props to the `renderItem` components.
 */
const FlatList: React.FC<FlatListProps> = (rawProps) => {
  const logic = useFlatListLogic(rawProps);
  const styles = useFlatListStyle(logic);

  return (
    <RNFlatList
      style={[styles.container as any, logic.rest.style]}
      data={logic.data}
      renderItem={logic.renderItem as any}
      keyExtractor={logic.keyExtractor}
      horizontal={logic.horizontal}
      {...logic.rest}
    />
  );
};

export default FlatList;
