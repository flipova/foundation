import React from 'react';
import { FoundationProvider } from '@flipova/foundation/config';

// Default configuration for the documentation site
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <FoundationProvider>
      {children}
    </FoundationProvider>
  );
}
