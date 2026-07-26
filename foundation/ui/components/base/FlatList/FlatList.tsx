import React, { useMemo } from 'react';
import { FlatList as RNFlatList, View, ScrollView } from 'react-native';
import { useFlatListLogic, FlatListProps } from './FlatList.logic';
import { useFlatListStyle } from './FlatList.style';
import { isWeb } from '@/ui/utils/platform';

/**
 * FlatList component is a wrapper around React Native's FlatList for efficient rendering of large data lists.
 * 
 * Role & Use Cases:
 * Use this component whenever you need to display a scrollable list of items, such as feeds, contact lists, or menus.
 * It is highly performant as it only renders items currently visible on the screen (on native).
 * On web, it falls back to a scrollable container for compatibility.
 * 
 * Structure:
 * - Native: Extends the native `FlatList` for virtualization and performance.
 * - Web: Uses ScrollView with mapped items for simplicity (developers should implement virtualization if needed).
 * 
 * Accessibility:
 * Inherits the standard list accessibility features from React Native. 
 * Ensure to pass appropriate accessibility props to the `renderItem` components.
 * On web, ensure proper ARIA roles are set via the parent container.
 */
const FlatList: React.FC<FlatListProps> = (rawProps) => {
  const logic = useFlatListLogic(rawProps);
  const styles = useFlatListStyle(logic);

  // Native rendering - uses virtualization
  if (!isWeb) {
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
  }

  // Web rendering - fallback to ScrollView + mapped items
  // For production, consider react-window or react-virtualized for better performance
  const renderedItems = useMemo(() => {
    return logic.data?.map((item: any, index: number) => {
      const key = logic.keyExtractor?.(item, index) || index;
      const renderItem = logic.renderItem as any;
      
      if (!renderItem) return null;
      
      const result = renderItem({ item, index });
      return <View key={key}>{result}</View>;
    });
  }, [logic.data, logic.renderItem, logic.keyExtractor]);

  return (
    <ScrollView
      style={[styles.container as any, logic.rest.style]}
      horizontal={logic.horizontal}
      scrollEventThrottle={16}
      aria-label="List"
    >
      <View
        style={{
          flexDirection: logic.horizontal ? 'row' : 'column',
          gap: (logic.rest as any)?.gap || 0,
        }}
      >
        {renderedItems}
      </View>
    </ScrollView>
  );
};

export default FlatList;
