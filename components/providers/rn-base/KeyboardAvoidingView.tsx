import React from 'react';
import { KeyboardAvoidingView as RNKeyboardAvoidingView, Platform } from 'react-native';
import type { KeyboardAvoidingViewProps } from '../../contract';

export function KeyboardAvoidingView({ children, testID }: KeyboardAvoidingViewProps) {
  return (
    <RNKeyboardAvoidingView
      testID={testID}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {children}
    </RNKeyboardAvoidingView>
  );
}
