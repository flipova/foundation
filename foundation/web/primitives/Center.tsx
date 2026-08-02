import React from 'react';
import { Box, WebBoxProps } from './Box';

export const Center: React.FC<WebBoxProps> = ({ style, children, ...rest }) => (
  <Box
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    }}
    {...rest}
  >
    {children}
  </Box>
);
