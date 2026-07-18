import React from 'react';
import { useTutoLayoutLogic, TutoLayoutProps } from './TutoLayout.logic';
import { useTutoLayoutStyle } from './TutoLayout.style';
import { TutoContext } from './TutoContext';

/**
 * @component TutoLayout (Web)
 * @description Web placeholder for TutoLayout. 
 * Reanimated has web support, so we can eventually reuse the native code, 
 * but for now this just renders the children safely.
 */
const TutoLayout: React.FC<TutoLayoutProps> = (rawProps) => {
  const logic = useTutoLayoutLogic(rawProps);
  const styles = useTutoLayoutStyle(logic);

  return (
    <TutoContext.Provider value={logic.contextValue}>
      <div style={styles.container as React.CSSProperties} {...logic.rest}>
        {logic.children}
      </div>
    </TutoContext.Provider>
  );
};

export default TutoLayout;
