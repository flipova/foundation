/**
 * @role TextInput Component
 * @description A single-line text input field for capturing brief user input.
 * @useCases Search bars, login forms, profile editing, and any standard text data entry.
 * @structure Wraps a native HTML `<input type="text">` element and conditionally displays error text below it.
 * @accessibility Includes `aria-invalid` for error states, supports native HTML input attributes, and can be easily associated with a semantic label.
 */
import React from 'react';
import { useTextInputLogic, TextInputProps } from './TextInput.logic';
import { useTextInputStyle } from './TextInput.style';

const TextInput: React.FC<TextInputProps> = (rawProps) => {
  const logic = useTextInputLogic(rawProps);
  const styles = useTextInputStyle(logic);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...logic.rest.style } as React.CSSProperties} {...logic.rest}>
      <input
        type="text"
        style={{ 
          ...styles.input, 
          outline: 'none',
          boxShadow: logic.isFocused && !logic.error ? `0 0 0 2px ${styles.input.borderColor}40` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          cursor: logic.disabled ? 'not-allowed' : 'text'
        } as React.CSSProperties}
        value={logic.value}
        defaultValue={logic.defaultValue}
        onChange={(e) => logic.onChangeText?.(e.target.value)}
        placeholder={logic.placeholder}
        disabled={logic.disabled}
        aria-invalid={!!logic.error}
        onFocus={() => logic.setIsFocused(true)}
        onBlur={() => logic.setIsFocused(false)}
      />
      {logic.error && <span style={styles.errorText as React.CSSProperties}>{logic.error}</span>}
    </div>
  );
};

export default TextInput;
