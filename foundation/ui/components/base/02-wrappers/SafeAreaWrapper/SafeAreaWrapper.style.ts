import { useMemo } from 'react';

export function useSafeAreaWrapperStyle(logic: any) {
  return useMemo(() => ({}), [logic]);
}
