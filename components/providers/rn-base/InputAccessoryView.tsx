import React from 'react';
import { InputAccessoryView as RNInputAccessoryView, Platform } from 'react-native';
import type { InputAccessoryViewProps } from '../../contract';

/** iOS only: other platforms have no such view, so the children are simply not shown. */
export function InputAccessoryView({ nativeID, children }: InputAccessoryViewProps) {
  if (Platform.OS !== 'ios') return null;
  return <RNInputAccessoryView nativeID={nativeID}>{children}</RNInputAccessoryView>;
}
