import React from 'react';
import { useHeaderContentLayoutLogic, HeaderContentLayoutProps } from './HeaderContentLayout.logic';
import { useHeaderContentLayoutStyle } from './HeaderContentLayout.style';

/**
 * @component HeaderContentLayout
 * @description
 * A vertically stacked layout featuring a top header and a scrollable main content area.
 * 
 * @role layout
 * @useCases
 * - Mobile-first views, standard application screens with a top app bar.
 * @structure
 * - Flexbox container with a fixed `header` and a flexible `main` content area.
 * @accessibility
 * - Leverages semantic `header` and `main` tags to guide assistive technologies.
 */
const HeaderContentLayout: React.FC<HeaderContentLayoutProps> = (rawProps) => {
  const logic = useHeaderContentLayoutLogic(rawProps);
  const styles = useHeaderContentLayoutStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.header && (
        <header style={{ ...styles.header, display: 'flex', flexDirection: 'column' } as React.CSSProperties}>
          {logic.header}
        </header>
      )}
      <main style={{ ...styles.content, display: 'flex', flexDirection: 'column', overflow: 'auto' } as React.CSSProperties}>
        {logic.children}
      </main>
    </div>
  );
};

export default HeaderContentLayout;
