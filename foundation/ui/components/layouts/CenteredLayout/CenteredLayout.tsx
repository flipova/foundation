import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useCenteredLayoutLogic, CenteredLayoutProps } from './CenteredLayout.logic';
import { useCenteredLayoutStyle } from './CenteredLayout.style';

/**
 * @component CenteredLayout
 * @description
 * CenteredLayout is a simple utility layout that perfectly centers its children 
 * both horizontally and vertically within the available space.
 *
 * @useCases
 * - Loading screens with a central spinner.
 * - Error states or "empty" states displaying a central icon and message.
 * - Splash screens.
 *
 * @structure
 * - A single Flexbox container taking up all available space.
 * - Employs justifyContent and alignItems to center contents.
 *
 * @accessibility
 * - Transparent from an accessibility perspective; it simply groups elements visually.
 * - Ensure child elements have appropriate accessibility roles if needed.
 */
const CenteredLayout: React.FC<CenteredLayoutProps> = (rawProps) => {
  const logic = useCenteredLayoutLogic(rawProps);
  const styles = useCenteredLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {logic.children || <Placeholder label="children" />}
    </View>
  );
};

export default CenteredLayout;
