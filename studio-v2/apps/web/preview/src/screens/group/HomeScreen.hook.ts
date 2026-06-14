import { useState, useCallback } from "react";

export function useHomeScreen() {


  const [getusers, setGetusers] = useState<any[]>([]);


  return {
    getusers,
    setGetusers,
  };
}
