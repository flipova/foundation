import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useHeaderContentLayoutLogic, HeaderContentLayoutProps } from './HeaderContentLayout.logic';
import { useHeaderContentLayoutStyle } from './HeaderContentLayout.style';

/**
 * A standard layout providing a fixed top header area and a flexible main content area below.
 * 
 * Use cases:
 * - App screens with a persistent top navigation bar or title area.
 * - Views where content scrolls under a stationary header.
 * 
 * Accessibility considerations:
 * - Ensure the header element has an appropriate accessibility role (like `header` or `heading`)
 *   to provide proper landmarks for screen reader navigation.
 */
const HeaderContentLayout: React.FC<HeaderContentLayoutProps> = (rawProps) => {
  const logic = useHeaderContentLayoutLogic(rawProps);
  const styles = useHeaderContentLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.header as any}>
          {logic.header || <Placeholder label="header" />}
        </View>
      <View style={styles.content as any}>
        {logic.children || <Placeholder label="children" />}
      </View>
    </View>
  );
};

export default HeaderContentLayout;
