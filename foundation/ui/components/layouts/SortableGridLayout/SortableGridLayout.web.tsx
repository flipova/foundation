import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortableGridLayoutLogic, SortableGridLayoutProps } from './SortableGridLayout.logic';
import { useSortableGridLayoutStyle } from './SortableGridLayout.style';

/**
 * @component SortableGridLayout (Web)
 * @description
 * Web-optimized drag and drop grid using @dnd-kit.
 * Uses `rectSortingStrategy` to perfectly handle 2D grid drag and drop.
 * 
 * @role layout
 * @useCases 
 * - Reorderable photo galleries, dashboards, or widget layouts.
 * - Any interface requiring 2D grid item arrangement by the user.
 * 
 * @structure
 * - Wraps content in a `DndContext` and `SortableContext`.
 * - Maps through items and renders each within a `SortableItem` that handles drag refs and transforms.
 * 
 * @accessibility
 * - Integrates `KeyboardSensor` to allow reordering via keyboard operations.
 * - Ensure draggable items have appropriate ARIA roles indicating they are grab-able and sortable.
 */
function SortableGridLayoutWeb<T>(rawProps: SortableGridLayoutProps<T>) {
  const logic = useSortableGridLayoutLogic(rawProps);
  const styles = useSortableGridLayoutStyle(logic);
  const [containerWidth, setContainerWidth] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = logic.items.findIndex((_, idx) => logic.keyExtractor(logic.items[idx], idx) === active.id);
      const newIndex = logic.items.findIndex((_, idx) => logic.keyExtractor(logic.items[idx], idx) === over.id);
      logic.handleReorder(oldIndex, newIndex);
    }
  };

  const itemWidth = containerWidth > 0 ? containerWidth / logic.columns : `${100 / logic.columns}%`;
  const itemKeys = logic.items.map((item, index) => logic.keyExtractor(item, index));

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <View style={[styles.container as any, logic.rest.style]} onLayout={onLayout} {...logic.rest}>
        <SortableContext 
          items={itemKeys}
          strategy={rectSortingStrategy}
        >
          {logic.items.map((item, index) => {
            const key = logic.keyExtractor(item, index);
            return (
              <SortableItem 
                key={key} 
                id={key}
                itemWidth={itemWidth}
                wrapperStyle={styles.itemWrapper}
              >
                {logic.renderItem(item, index)}
              </SortableItem>
            );
          })}
        </SortableContext>
      </View>
    </DndContext>
  );
}

const SortableItem = ({ id, children, itemWidth, wrapperStyle }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    width: itemWidth,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <View style={wrapperStyle}>
        {children}
      </View>
    </div>
  );
};

export default SortableGridLayoutWeb;
