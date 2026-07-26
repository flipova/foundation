import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useKeyboardAvoidWrapperLogic, KeyboardAvoidWrapperProps } from './KeyboardAvoidWrapper.logic';
import { useKeyboardAvoidWrapperStyle } from './KeyboardAvoidWrapper.style';
import { isWeb } from '@/ui/utils/platform';

/**
 * @component KeyboardAvoidWrapper
 * @description Automatically handles keyboard layout shifting for its wrapped children.
 * 
 * On native platforms (iOS/Android), uses KeyboardAvoidingView to shift content up when keyboard appears.
 * On web, keyboard doesn't affect layout the same way, so this is a pass-through View component.
 */
const KeyboardAvoidWrapper: React.FC<KeyboardAvoidWrapperProps> = (rawProps) => {
  const logic = useKeyboardAvoidWrapperLogic(rawProps);
  const styles = useKeyboardAvoidWrapperStyle(logic);

  // Web doesn't need keyboard avoidance - just render children in a View
  if (isWeb) {
    return (
      <View
        style={[{ flex: 1 } as any, logic.rest.style]}
        {...logic.rest}
      >
        {logic.children}
      </View>
    );
  }

  // Native: use KeyboardAvoidingView
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={logic.offset}
      style={[{ flex: 1 } as any, logic.rest.style]} 
      {...logic.rest}
    >
      {logic.children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidWrapper;
