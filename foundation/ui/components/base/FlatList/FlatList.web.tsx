import React from 'react';
import { useFlatListLogic, FlatListProps } from './FlatList.logic';
import { useFlatListStyle } from './FlatList.style';

/**
 * Role: Renders a scrollable list of data elements.
 * UseCases: Useful for displaying lists, feeds, or any collection of items.
 * Structure: Wraps mapped child components in a scrollable container (`div`) oriented either vertically or horizontally.
 * Accessibility: Uses a standard generic container. Developers should ensure child elements have appropriate semantic roles and aria attributes if needed.
 */
const FlatList: React.FC<FlatListProps> = (rawProps) => {
  const logic = useFlatListLogic(rawProps);
  const styles = useFlatListStyle(logic);

  // A naive virtualization mapping for Web for now, could be replaced with react-window
  return (
    <div 
      style={{
        ...styles.container,
        display: 'flex',
        flexDirection: logic.horizontal ? 'row' : 'column',
        overflowX: logic.horizontal ? 'auto' : 'hidden',
        overflowY: logic.horizontal ? 'hidden' : 'auto',
      } as React.CSSProperties}
      {...logic.rest}
    >
      {logic.data.map((item, index) => (
        <React.Fragment key={logic.keyExtractor(item, index)}>
          {logic.renderItem({ item, index })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FlatList;
