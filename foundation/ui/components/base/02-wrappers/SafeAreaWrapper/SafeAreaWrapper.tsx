import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaWrapperLogic, SafeAreaWrapperProps } from './SafeAreaWrapper.logic';
import { useSafeAreaWrapperStyle } from './SafeAreaWrapper.style';

/**
 * @component SafeAreaWrapper
 * @description A convenient wrapper that applies safe area boundaries to specific sections of children.
 */
const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = (rawProps) => {
  const logic = useSafeAreaWrapperLogic(rawProps);
  const styles = useSafeAreaWrapperStyle(logic);

  return (
    <SafeAreaView edges={logic.edges as any} style={[{ flex: 1 } as any, logic.rest.style]} {...logic.rest}>
      {logic.children}
    </SafeAreaView>
  );

};

export default SafeAreaWrapper;
