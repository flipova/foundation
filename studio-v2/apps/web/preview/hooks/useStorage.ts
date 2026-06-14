import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStorage<T = string>(key: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(key).then(stored => {
      if (stored !== null) {
        try { setValue(JSON.parse(stored)); } catch { setValue(stored as unknown as T); }
      }
      setLoading(false);
    });
  }, [key]);

  const set = useCallback(async (newValue: T) => {
    setValue(newValue);
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, set, loading];
}

export function useSecureStorage<T = string>(key: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("expo-secure-store").then(SecureStore => {
      SecureStore.getItemAsync(key).then(stored => {
        if (stored !== null) {
          try { setValue(JSON.parse(stored)); } catch { setValue(stored as unknown as T); }
        }
        setLoading(false);
      });
    });
  }, [key]);

  const set = useCallback(async (newValue: T) => {
    setValue(newValue);
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(key, JSON.stringify(newValue));
  }, [key]);

  return [value, set, loading];
}
