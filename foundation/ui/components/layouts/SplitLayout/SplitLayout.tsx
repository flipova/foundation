import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useSplitLayoutLogic, SplitLayoutProps } from './SplitLayout.logic';
import { useSplitLayoutStyle } from './SplitLayout.style';

/**
 * SplitLayout divides the available width between two panes (left and right) based on a specified percentage ratio.
 * It is ideal for side-by-side comparative views, master-detail interfaces, or any scenario needing a proportional split.
 * 
 * Accessibility considerations:
 * - Ensure meaningful content flow so that navigating left-to-right makes sense contextually.
 */
const SplitLayout: React.FC<SplitLayoutProps> = (rawProps) => {
  const logic = useSplitLayoutLogic(rawProps);
  const styles = useSplitLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.left as any}>
        {logic.left || <Placeholder label="left" />}
      </View>
      <View style={styles.right as any}>
        {logic.right || <Placeholder label="right" />}
      </View>
    </View>
  );
};

export default SplitLayout;
