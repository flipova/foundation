import React from 'react';
import { TutoAnimationType } from './TutoLayout.logic';

export const TutoAnimations: React.FC<{ type: TutoAnimationType }> = ({ type }) => {
  if (type === 'none') return null;

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, left: 0, right: 0, bottom: 0, 
      display: 'flex', 
      justifyContent: "center", 
      alignItems: "center",
      pointerEvents: 'none'
    }}>
      <div style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderStyle: 'solid'
      }} />
    </div>
  );
};
export default TutoAnimations;
