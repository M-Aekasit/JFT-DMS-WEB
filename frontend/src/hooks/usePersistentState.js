import { useEffect, useState } from "react";

function readStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Cannot read ${key} from localStorage`, error);
    return fallback;
  }
}

export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(readStorage(key, fallback));
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Cannot save ${key} to localStorage`, error);
    }
  }, [key, ready, value]);

  return [value, setValue];
}
