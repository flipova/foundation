import React from 'react';
import { Placeholder } from '../../Placeholder';
import { useSystemLayoutLogic, SystemLayoutProps } from './SystemLayout.logic';
import { useSystemLayoutStyle } from './SystemLayout.style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

/**
 * @component SystemLayout
 * @description A foundational layout component that provides a safe area for content, 
 * avoiding device notches and status bars. It also handles the system status bar styling.
 * @accessibility
 * - Provides a safe container to ensure UI elements are not obscured by system UI.
 * - Leaves specific accessibility roles and labels to its children.
 */
const SystemLayout: React.FC<SystemLayoutProps> = (rawProps) => {
  const logic = useSystemLayoutLogic(rawProps);
  const styles = useSystemLayoutStyle(logic);

  return (
    <SafeAreaView style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <StatusBar style={logic.statusBarMode} />
      {logic.children || <Placeholder label="children" />}
    </SafeAreaView>
  );
};

export default SystemLayout;
