import React from 'react';
import { View, Text } from 'react-native';
import { useBadgeWrapperLogic, BadgeWrapperProps } from './BadgeWrapper.logic';
import { useBadgeWrapperStyle } from './BadgeWrapper.style';

/**
 * @component BadgeWrapper
 * @description Wraps an element and places a customizable notification badge in the top right corner.
 */
const BadgeWrapper: React.FC<BadgeWrapperProps> = (rawProps) => {
  const logic = useBadgeWrapperLogic(rawProps);
  const styles = useBadgeWrapperStyle(logic);

  return (
    <View style={[{ position: 'relative' } as any, logic.rest.style]} {...logic.rest}>
      {logic.children}
      {logic.isVisible && (
        <View style={{
          position: 'absolute', top: -5, right: -5, backgroundColor: logic.color, 
          borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4
        } as any}>
          {logic.count !== undefined && logic.count > 0 && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' } as any}>{logic.count > 99 ? '99+' : logic.count}</Text>}
        </View>
      )}
    </View>
  );

};

export default BadgeWrapper;
