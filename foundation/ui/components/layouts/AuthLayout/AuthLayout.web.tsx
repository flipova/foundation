import React from 'react';
import { useAuthLayoutLogic, AuthLayoutProps } from './AuthLayout.logic';
import { useAuthLayoutStyle } from './AuthLayout.style';

/**
 * @component AuthLayout
 * @description
 * A layout designed for authentication screens (login, register, etc.),
 * featuring a split design with an image area and a form area.
 * 
 * @role layout
 * @useCases
 * - Displaying authentication forms alongside promotional or branding images.
 * - Full-screen layouts for onboarding.
 * @structure
 * - Flexbox container splitting the screen into image and form panels.
 * @accessibility
 * - Follows a logical source order for screen readers (image, then form).
 */
const AuthLayout: React.FC<AuthLayoutProps> = (rawProps) => {
  const logic = useAuthLayoutLogic(rawProps);
  const styles = useAuthLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', minHeight: '100vh' } as React.CSSProperties} {...logic.rest}>
      {logic.image && (
        <div style={{ ...styles.imageContainer, flex: 1 } as React.CSSProperties}>
          {logic.image}
        </div>
      )}
      <div style={{ ...styles.formContainer, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
        {logic.children}
      </div>
    </div>
  );
};

export default AuthLayout;
