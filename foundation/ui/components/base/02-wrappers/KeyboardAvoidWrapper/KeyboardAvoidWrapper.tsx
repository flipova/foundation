import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useKeyboardAvoidWrapperLogic, KeyboardAvoidWrapperProps } from './KeyboardAvoidWrapper.logic';
import { useKeyboardAvoidWrapperStyle } from './KeyboardAvoidWrapper.style';

/**
 * @component KeyboardAvoidWrapper
 * @description Automatically handles keyboard layout shifting for its wrapped children.
 */
const KeyboardAvoidWrapper: React.FC<KeyboardAvoidWrapperProps> = (rawProps) => {
  const logic = useKeyboardAvoidWrapperLogic(rawProps);
  const styles = useKeyboardAvoidWrapperStyle(logic);

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
