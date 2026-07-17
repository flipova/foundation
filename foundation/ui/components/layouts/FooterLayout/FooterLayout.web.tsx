import React from 'react';
import { useFooterLayoutLogic, FooterLayoutProps } from './FooterLayout.logic';
import { useFooterLayoutStyle } from './FooterLayout.style';

/**
 * @component FooterLayout
 * @description
 * A layout that ensures a footer remains at the bottom of the content area
 * or screen, while the main content is scrollable.
 * 
 * @role layout
 * @useCases
 * - Standard web pages requiring a persistent or push-down footer.
 * @structure
 * - Flexbox container splitting space between scrollable `main` content and `footer`.
 * @accessibility
 * - Uses semantic `main` and `footer` tags to establish clear document landmarks.
 */
const FooterLayout: React.FC<FooterLayoutProps> = (rawProps) => {
  const logic = useFooterLayoutLogic(rawProps);
  const styles = useFooterLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      <main style={{ ...styles.content, display: 'flex', flexDirection: 'column', overflow: 'auto' } as React.CSSProperties}>
        {logic.children}
      </main>
      {logic.footer && (
        <footer style={{ ...styles.footer, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
          {logic.footer}
        </footer>
      )}
    </div>
  );
};

export default FooterLayout;
