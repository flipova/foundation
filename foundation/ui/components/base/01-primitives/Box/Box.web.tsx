/**
 * @role Box Component
 * @description A primitive layout container serving as the foundation for structuring UI elements.
 * @useCases Creating wrappers, mapping React Native spacing props to web CSS, and building flexbox layouts.
 * @structure Renders a styled `div` and translates cross-platform style props (like paddingHorizontal) into standard web CSS properties.
 * @accessibility As a generic container, it does not have inherent semantics. Appropriate ARIA roles should be added via props if it serves a specific structural purpose.
 */
import React from 'react';
import { useBoxLogic, BoxProps } from './Box.logic';
import { useBoxStyle } from './Box.style';

const Box: React.FC<BoxProps> = (rawProps) => {
  const logic = useBoxLogic(rawProps);
  const styles = useBoxStyle(logic);

  // Map React Native specific padding/margin properties to Web CSS
  const webStyle: React.CSSProperties = { ...styles.container };
  
  if ('paddingHorizontal' in webStyle) {
    const val = (webStyle as any).paddingHorizontal;
    webStyle.paddingLeft = val;
    webStyle.paddingRight = val;
    delete (webStyle as any).paddingHorizontal;
  }
  if ('paddingVertical' in webStyle) {
    const val = (webStyle as any).paddingVertical;
    webStyle.paddingTop = val;
    webStyle.paddingBottom = val;
    delete (webStyle as any).paddingVertical;
  }
  if ('marginHorizontal' in webStyle) {
    const val = (webStyle as any).marginHorizontal;
    webStyle.marginLeft = val;
    webStyle.marginRight = val;
    delete (webStyle as any).marginHorizontal;
  }
  if ('marginVertical' in webStyle) {
    const val = (webStyle as any).marginVertical;
    webStyle.marginTop = val;
    webStyle.marginBottom = val;
    delete (webStyle as any).marginVertical;
  }

  // Ensure flex default behavior matches React Native
  webStyle.display = 'flex';
  if (!webStyle.flexDirection) {
    webStyle.flexDirection = 'column';
  }

  return (
    <div style={{ ...webStyle, ...logic.rest.style }} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default Box;
