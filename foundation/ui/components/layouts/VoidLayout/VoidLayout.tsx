import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useVoidLayoutLogic, VoidLayoutProps } from './VoidLayout.logic';
import { useVoidLayoutStyle } from './VoidLayout.style';

/**
 * @component VoidLayout
 * @description An intentionally blank layout acting purely as a passthrough fragment or unthemed wrapper.
 * Useful for structural hierarchy without visual overhead or as a base class.
 * @accessibility
 * - Purely transparent container, no inherent accessibility role, leaving it to its children.
 */
const VoidLayout: React.FC<VoidLayoutProps> = (rawProps) => {
  const logic = useVoidLayoutLogic(rawProps);
  const styles = useVoidLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children || <Placeholder label="children" />}
    </View>
  );
};

export default VoidLayout;
