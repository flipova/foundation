import React from 'react';
import { useButtonLogic, ButtonProps } from './Button.logic';
import { useButtonStyle } from './Button.style';

/**
 * @component Button (Web)
 * @description An interactive element that triggers an action when clicked.
 * @useCases Submitting forms, opening modals, triggering navigation, or executing actions.
 * @structure A native HTML button element, containing a text label and an optional loading spinner.
 * @accessibility Utilizes native button interactions. Implements aria-disabled for disabled states and aria-busy when in a loading state.
 */
const Button: React.FC<ButtonProps> = (rawProps) => {
  const logic = useButtonLogic(rawProps);
  const styles = useButtonStyle(logic);

  return (
    <button
      style={{
        ...styles.container,
        display: 'inline-flex',
        cursor: logic.disabled ? 'not-allowed' : 'pointer'
      } as React.CSSProperties}
      onClick={logic.onPress}
      disabled={logic.disabled}
      aria-disabled={logic.disabled}
      aria-busy={logic.loading}
      {...logic.rest}
    >
      {logic.loading && (
        <div style={{ marginRight: logic.label ? 8 : 0, width: 16, height: 16, borderRadius: '50%', border: `2px solid ${styles.spinner.color}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      )}
      {logic.label && <span style={styles.label as React.CSSProperties}>{logic.label}</span>}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default Button;
