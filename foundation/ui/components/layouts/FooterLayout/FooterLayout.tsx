import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useFooterLayoutLogic, FooterLayoutProps } from './FooterLayout.logic';
import { useFooterLayoutStyle } from './FooterLayout.style';

/**
 * A standard layout that provides a main content area and a fixed footer area.
 * The content area flexibly consumes the available space above the footer.
 * 
 * Use cases:
 * - App screens that require a persistent bottom action bar or navigation.
 * - Modals or dialogues with sticky bottom confirmation buttons.
 * 
 * Accessibility considerations:
 * - Semantic layout structure; ensure that focus order feels natural and 
 * the footer has an appropriate accessibility role if it acts as a landmark (e.g. bottom navigation).
 */
const FooterLayout: React.FC<FooterLayoutProps> = (rawProps) => {
  const logic = useFooterLayoutLogic(rawProps);
  const styles = useFooterLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.content as any}>
        {logic.children || <Placeholder label="children" />}
      </View>
      <View style={styles.footer as any}>
          {logic.footer || <Placeholder label="footer" />}
        </View>
    </View>
  );
};

export default FooterLayout;
