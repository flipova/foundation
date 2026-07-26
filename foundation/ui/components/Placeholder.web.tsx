import React from 'react';

export const Placeholder = ({ label }: { label: string }) => {
  return (
    <div style={{
      display: 'flex',
      flex: 1,
      minHeight: 40,
      minWidth: 40,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'rgba(150, 150, 150, 0.5)',
      borderRadius: 4,
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(150, 150, 150, 0.05)',
    }}>
      <span style={{
        color: 'rgba(150, 150, 150, 0.8)',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
};
export default Placeholder;
