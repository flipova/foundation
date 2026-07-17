import React from 'react';
import { useTutoLayoutLogic, TutoLayoutProps } from './TutoLayout.logic';
import { useTutoLayoutStyle } from './TutoLayout.style';

/**
 * @component TutoLayout (Web)
 * @description
 * A tutorial/onboarding layout that displays a series of steps with navigation controls.
 * 
 * @role layout
 * @useCases 
 * - App onboarding experiences introducing features.
 * - Step-by-step wizards or guides.
 * 
 * @structure
 * - Shows the current step in a centrally aligned flex container.
 * - Renders a bottom control bar containing pagination dots and a "Next" / "Finish" button.
 * 
 * @accessibility
 * - Active steps should be announced to screen readers.
 * - Ensure pagination controls and buttons are keyboard focusable and adequately labeled (e.g., "Step 1 of 3").
 */
const TutoLayout: React.FC<TutoLayoutProps> = (rawProps) => {
  const logic = useTutoLayoutLogic(rawProps);
  const styles = useTutoLayoutStyle(logic);

  if (!logic.steps || logic.steps.length === 0) return null;

  return (
    <div style={{ ...styles.container, display: 'flex', position: 'relative' } as React.CSSProperties} {...logic.rest}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {logic.steps[logic.currentStep]}
      </div>
      <div style={{ ...styles.controls as any, display: 'flex' } as React.CSSProperties}>
        {logic.steps.map((_, idx) => (
          <div key={idx} style={{ 
            ...((styles.dot as any) as any), 
            ...(logic.currentStep === idx ? (styles.dotActive as any) : {})
          } as React.CSSProperties} />
        ))}
        <button style={styles.nextBtn as any as React.CSSProperties} onClick={logic.nextStep}>
          {logic.currentStep === logic.steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default TutoLayout;
