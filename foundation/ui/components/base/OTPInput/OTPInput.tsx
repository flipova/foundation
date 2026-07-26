import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { useOTPInputLogic, OTPInputProps } from './OTPInput.logic';
import { useOTPInputStyle } from './OTPInput.style';
import { isWeb, hasTouch } from '@/ui/utils/platform';
import { handleOTPPaste, getInputAccessibilityProps } from '@/ui/utils/inputHelpers';

/**
 * @component OTPInput
 * @description An auto-advancing, multi-cell verification code input.
 * 
 * Features:
 * - Auto-advancing to next cell when digit is entered
 * - Complete paste support (handles full OTP paste on both platforms)
 * - Web: Type="tel" with numeric input mode for better mobile UX
 * - Native: Uses textContentType for auto-fill on iOS
 * - Error states: Visual indication and ARIA descriptions
 * - Accessibility: ARIA labels, describedby for error messages, one-time-code autoComplete
 * - Auto-focus on first cell when mounted or reset
 * 
 * @web Optimized with paste support and better mobile UX
 * @native Uses textContentType for auto-fill on iOS
 */
const OTPInput: React.FC<OTPInputProps> = (rawProps) => {
  const logic = useOTPInputLogic(rawProps);
  const styles = useOTPInputStyle(logic);
  const a11yProps = getInputAccessibilityProps('OTP Input', logic.errorMessage, `Enter ${logic.length}-digit code`);

  const handlePaste = (e: any) => {
    if (!isWeb) return;
    
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text') || '';
    
    if (!pastedText) return;
    
    const otpArray = handleOTPPaste(pastedText, logic.length);
    
    // Update all fields with pasted digits
    otpArray.forEach((digit, index) => {
      if (index < logic.length && /^\d$/.test(digit)) {
        logic.handleChange(digit, index);
      }
    });
    
    // Focus last filled field
    if (otpArray.length > 0) {
      const nextIndex = Math.min(otpArray.length, logic.length - 1);
      logic.inputsRef.current[nextIndex]?.focus();
    }
  };

  return (
    <View
      style={[styles.container as any, logic.error && styles.containerError as any, logic.rest.style]}
      {...logic.rest}
      {...a11yProps}
      role="group"
      aria-describedby={logic.errorMessage ? 'otp-error' : undefined}
    >
      {Array.from({ length: logic.length }).map((_, i) => {
        const isLastField = i === logic.length - 1;
        
        return isWeb ? (
          <input
            key={i}
            ref={(ref: any) => {
              logic.inputsRef.current[i] = ref;
            }}
            type="tel"
            inputMode="numeric"
            style={Object.assign(
              {},
              styles.cell,
              logic.focusedIndex === i ? styles.cellFocused : {},
              logic.error ? styles.cellError : {}
            ) as any}
            value={logic.internalValue[i]}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 1) {
                logic.handleChange(value, i);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !logic.internalValue[i] && i > 0) {
                logic.inputsRef.current[i - 1]?.focus();
              }
            }}
            onFocus={() => logic.handleFocus(i)}
            onBlur={() => logic.handleBlur(i)}
            onPaste={handlePaste}
            maxLength={1}
            autoComplete={isLastField ? 'one-time-code' : 'off'}
            pattern="[0-9]"
            aria-label={`OTP digit ${i + 1} of ${logic.length}`}
            aria-invalid={logic.error}
            disabled={logic.error}
          />
        ) : (
          <TextInput
            key={i}
            ref={(ref: any) => {
              logic.inputsRef.current[i] = ref;
            }}
            style={[
              styles.cell as any,
              logic.focusedIndex === i && styles.cellFocused as any,
              logic.error && (styles.cellError as any),
            ]}
            value={logic.internalValue[i]}
            onChangeText={(text) => logic.handleChange(text, i)}
            onKeyPress={(e) => logic.handleKeyPress(e, i)}
            onFocus={() => logic.handleFocus(i)}
            onBlur={() => logic.handleBlur(i)}
            keyboardType="number-pad"
            maxLength={1}
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            testID={`otp-input-${i}`}
            editable={!logic.error}
            accessible
            accessibilityLabel={`OTP digit ${i + 1} of ${logic.length}`}
            accessibilityRole="spinbutton"
            accessibilityLiveRegion="polite"
          />
        );
      })}
      
      {logic.error && logic.errorMessage && (
        <Text
          id="otp-error"
          style={{
            marginTop: 8,
            color: '#ef4444',
            fontSize: 12,
          } as any}
          role="alert"
          aria-live="assertive"
        >
          {logic.errorMessage}
        </Text>
      )}
    </View>
  );
};

export default OTPInput;
