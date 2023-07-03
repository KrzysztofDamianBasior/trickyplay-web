import { useEffect } from "react";

export function useOnUpdateLogger(value: any) {
  useEffect(() => {
    console.log(value);
  }, [value]);
}
