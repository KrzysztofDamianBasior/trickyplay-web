import { useState, useEffect } from "react";

function getSavedValue({
  key,
  initialValue,
}: {
  key: string;
  initialValue: any;
}) {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    const savedValue = JSON.parse(storedValue);
    if (savedValue) return savedValue;
  }

  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export function useLocalStorage({
  key,
  initialValue,
}: {
  key: string;
  initialValue: any;
}) {
  const [value, setValue] = useState(() => {
    return getSavedValue({ key, initialValue });
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
