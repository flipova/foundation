/**
 * @role TextArea Component
 * @description A multi-line text input field for capturing longer user input.
 * @useCases Forms requiring detailed responses, comments, messages, or descriptions.
 * @structure Wraps a native HTML `<textarea>` element and conditionally displays error messages below it.
 * @accessibility Uses `aria-invalid` to indicate error states. Supports native focus management and can be linked to labels using standard `id`/`htmlFor` props.
 */
import React from 'react';
import { useTextAreaLogic, TextAreaProps } from './TextArea.logic';
import { useTextAreaStyle } from './TextArea.style';

const TextArea: React.FC<TextAreaProps> = (rawProps) => {
  const logic = useTextAreaLogic(rawProps);
  const styles = useTextAreaStyle(logic);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...logic.rest.style } as React.CSSProperties} {...logic.rest}>
      <textarea
        style={{ 
          ...styles.input, 
          outline: 'none',
          boxShadow: logic.isFocused && !logic.error ? `0 0 0 2px ${(styles.input as any).borderColor}40` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          cursor: logic.disabled ? 'not-allowed' : 'text',
          resize: 'vertical'
        } as React.CSSProperties}
        rows={logic.lines}
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

export default TextArea;
