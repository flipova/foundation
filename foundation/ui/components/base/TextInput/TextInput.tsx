import React from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';
import { useTextInputLogic, TextInputProps } from './TextInput.logic';
import { useTextInputStyle } from './TextInput.style';

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
 * - Error text should ideally be linked to the input via accessibility hints or announcements in a fully accessible form setup.
 */
const TextInput: React.FC<TextInputProps> = (rawProps) => {
  const logic = useTextInputLogic(rawProps);
  const styles = useTextInputStyle(logic);

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
      />
      {logic.error ? <Text style={styles.errorText as any}>{logic.error}</Text> : null}
    </View>
  );
};

export default TextInput;
