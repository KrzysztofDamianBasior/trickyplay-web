import React, { useState, useEffect } from "react";

export function useStopwatch(): {
  time: number;
  start: () => void;
  reset: () => void;
  pause: () => void;
} {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const pause = () => {
    setIsPaused((prev) => !prev);
  };

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const reset = () => {
    setIsActive(false);
    setTime(0);
  };

  return { time, start, reset, pause };
}
