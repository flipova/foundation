import React, { useCallback, useRef } from 'react';
import { useTutoContext } from './TutoContext';

export interface TutoElementProps {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const TutoElement: React.FC<TutoElementProps> = ({ id, children, style }) => {
  const { registerElement, unregisterElement } = useTutoContext();
  const divRef = useRef<HTMLDivElement>(null);

  const measureAndRegister = useCallback(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      registerElement(id, { x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    }
  }, [id, registerElement]);

  React.useEffect(() => {
    measureAndRegister();
    window.addEventListener('resize', measureAndRegister);
    return () => {
      window.removeEventListener('resize', measureAndRegister);
      unregisterElement(id);
    };
  }, [id, unregisterElement, measureAndRegister]);

  return (
    <div ref={divRef} style={style}>
      {children}
    </div>
  );
};

export default TutoElement;
