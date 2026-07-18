/**
 * @role Spinner Component
 * @description A visual indicator showing that a process is ongoing.
 * @useCases Used to indicate loading states, such as data fetching, submitting forms, or processing actions.
 * @structure Renders an animated `div` element with a spinning border effect.
 * @accessibility Ensure it is accompanied by appropriate aria attributes (like aria-busy or role="status") in its parent or directly, so screen readers can announce the loading state.
 */
import React from 'react';
import { useSpinnerLogic, SpinnerProps } from './Spinner.logic';
import { useSpinnerStyle } from './Spinner.style';

const Spinner: React.FC<SpinnerProps> = (rawProps) => {
  const logic = useSpinnerLogic(rawProps);
  const styles = useSpinnerStyle(logic);

  const sizePx = logic.size === 'large' ? 32 : logic.size === 'small' ? 16 : (typeof logic.size === 'number' ? logic.size : 16);

  return (
    <div style={{ display: 'inline-flex', ...logic.rest.style }} {...logic.rest}>
      <div style={{
        width: sizePx,
        height: sizePx,
        borderRadius: '50%',
        border: `2px solid ${styles.color}`,
        borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Spinner;
