import { useState, useCallback } from "react";

export function useExplorerScreen() {


  const [getusers, setGetusers] = useState<any[]>([]);

  const handleRootLayoutScreenFocus = useCallback(() => {
    console.log("hey");
  }, []);

  return {
    getusers,
    setGetusers,
    handleRootLayoutScreenFocus,
  };
}
