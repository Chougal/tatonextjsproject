"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue(prev => {
          // Always use latest state via functional update
          const valueToStore = value instanceof Function ? value(prev) : value;
          try {
            if (typeof window !== "undefined") {
              window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
          } catch (err) {
            console.warn(`Error writing localStorage key "${key}":`, err);
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [isMounted ? storedValue : initialValue, setValue, isMounted] as const;
}
