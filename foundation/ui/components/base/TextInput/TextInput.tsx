import React from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';
import { useTextInputLogic, TextInputProps } from './TextInput.logic';
import { useTextInputStyle } from './TextInput.style';
import { isWeb } from '@/ui/utils/platform';
import { getInputAccessibilityProps } from '@/ui/utils/inputHelpers';

/**
 * A single-line text input component.
 * 
 * @role
 * Provides a field for users to enter single-line text content, such as names or email addresses.
 * 
 * @useCases
 * - Registration and login forms.
 * - Search bars.
 * 
 * @structure
 * - Wraps a React Native `TextInput` inside a `View` container.
 * - Optionally renders an error `Text` below the input.
 * 
 * @accessibility
 * - The underlying `TextInput` is naturally accessible.
 * - Error text is linked to the input via aria-describedby and aria-invalid.
 * - Proper error announcements for screen readers.
 */
const TextInput: React.FC<TextInputProps> = (rawProps) => {
  const logic = useTextInputLogic(rawProps);
  const styles = useTextInputStyle(logic);
  const a11yProps = getInputAccessibilityProps(
    logic.placeholder,
    logic.error,
    logic.placeholder
  );

  if (isWeb) {
    return (
      <View style={[styles.container as any, logic.rest.style]}>
        <input
          type="text"
          value={logic.value || ''}
          defaultValue={logic.defaultValue}
          onChange={(e) => logic.onChangeText?.(e.target.value)}
          placeholder={logic.placeholder}
          disabled={logic.disabled}
          onFocus={() => logic.setIsFocused(true)}
          onBlur={() => logic.setIsFocused(false)}
          style={{
            ...styles.input,
            borderColor: logic.error ? '#ef4444' : '#d1d5db',
          } as any}
          {...a11yProps}
        />
        {logic.error && (
          <Text 
            style={styles.errorText as any}
            id="text-input-error"
            role="alert"
            aria-live="polite"
          >
            {logic.error}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      <RNTextInput
        style={styles.input as any}
        value={logic.value}
        defaultValue={logic.defaultValue}
        onChangeText={logic.onChangeText}
        placeholder={logic.placeholder}
        placeholderTextColor={styles.placeholderColor}
        editable={!logic.disabled}
        onFocus={() => logic.setIsFocused(true)}
        onBlur={() => logic.setIsFocused(false)}
        accessibilityRole="none"
        {...a11yProps}
      />
      {logic.error && (
        <Text 
          style={styles.errorText as any}
          role="alert"
          accessibilityLiveRegion="polite"
        >
          {logic.error}
        </Text>
      )}
    </View>
  );
};

export default TextInput;
