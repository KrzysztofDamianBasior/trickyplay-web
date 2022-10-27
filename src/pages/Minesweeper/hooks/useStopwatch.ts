import React, { useState, useEffect } from "react";

export function useStopwatch(): {
  time: number;
  startStopwatch: () => void;
  resetStopwatch: () => void;
  pauseStopwatch: () => void;
  stopStopwatch: () => void;
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

  const pauseStopwatch = () => {
    setIsPaused((prev) => !prev);
  };

  const startStopwatch = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const stopStopwatch = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  const resetStopwatch = () => {
    setIsActive(false);
    setTime(0);
  };

  return {
    time,
    startStopwatch,
    resetStopwatch,
    pauseStopwatch,
    stopStopwatch,
  };
}
