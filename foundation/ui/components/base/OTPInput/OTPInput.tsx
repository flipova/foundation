import React from 'react';
import { View, TextInput } from 'react-native';
import { useOTPInputLogic, OTPInputProps } from './OTPInput.logic';
import { useOTPInputStyle } from './OTPInput.style';

/**
 * @component OTPInput
 * @description An auto-advancing, multi-cell verification code input.
 */
const OTPInput: React.FC<OTPInputProps> = (rawProps) => {
  const logic = useOTPInputLogic(rawProps);
  const styles = useOTPInputStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {Array.from({ length: logic.length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => { logic.inputsRef.current[i] = ref; }}
          style={[styles.cell as any, logic.focusedIndex === i && styles.cellFocused]}
          value={logic.internalValue[i]}
          onChangeText={(text) => logic.handleChange(text, i)}
          onKeyPress={(e) => logic.handleKeyPress(e, i)}
          onFocus={() => logic.handleFocus(i)}
          onBlur={() => logic.handleBlur(i)}
          keyboardType="number-pad"
          maxLength={logic.length}
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          testID={`otp-input-${i}`}
        />
      ))}
    </View>
  );
};

export default OTPInput;
