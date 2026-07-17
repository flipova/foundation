import React from 'react';
import { usePasswordInputLogic, PasswordInputProps } from './PasswordInput.logic';
import { usePasswordInputStyle } from './PasswordInput.style';

/**
 * @component PasswordInput (Web)
 * @description A secure text input with visibility toggle.
 */
const PasswordInputWeb: React.FC<PasswordInputProps> = (rawProps) => {
  const logic = usePasswordInputLogic(rawProps);
  const styles = usePasswordInputStyle(logic);

  return (

    <div style={styles.container as any} {...logic.rest}>
      <input type={logic.isVisible ? 'text' : 'password'} value={logic.value || ''} onChange={(e) => logic.onChangeText?.(e.target.value)} placeholder={logic.placeholder} style={styles.input as any} />
      <button onClick={logic.toggleVisibility} style={styles.icon as any}>{logic.isVisible ? 'Hide' : 'Show'}</button>
    </div>
  );
};

export default PasswordInputWeb;
