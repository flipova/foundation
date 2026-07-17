import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useRootLayoutLogic, RootLayoutProps } from './RootLayout.logic';
import { useRootLayoutStyle } from './RootLayout.style';
// Using SafeAreaProvider from react-native-safe-area-context
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * RootLayout serves as the top-level container for an application or major screen.
 * It wraps its content in a SafeAreaProvider to ensure content avoids device notches and system bars.
 * 
 * Accessibility considerations:
 * - This layout establishes a base view; ensure child elements properly handle semantic roles.
 */
const RootLayout: React.FC<RootLayoutProps> = (rawProps) => {
  const logic = useRootLayoutLogic(rawProps);
  const styles = useRootLayoutStyle(logic);

  return (
    <SafeAreaProvider>
      <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
        {logic.children || <Placeholder label="children" />}
      </View>
    </SafeAreaProvider>
  );
};

export default RootLayout;
