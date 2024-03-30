import { useState, useEffect } from "react";

export function useStopwatch(): {
  time: number;
  startStopwatch: () => void;
  resetStopwatch: () => void;
  pauseStopwatch: () => void;
  stopStopwatch: () => void;
} {
  const [time, setTime] = useState<number>(0);
  const [timerState, setTimerState] = useState<
    "active" | "paused" | "inactive"
  >("inactive");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (timerState === "active") {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timerState]);

  const pauseStopwatch = () => {
    if (timerState === "active") setTimerState("paused");
    if (timerState === "paused") setTimerState("active");
  };

  const startStopwatch = () => {
    setTimerState("active");
  };

  const stopStopwatch = () => {
    setTimerState("inactive");
  };

  const resetStopwatch = () => {
    setTimerState("inactive");
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
