"use client";

import { useEffect, useState } from "react";

export function useOtpTimer(initialSeconds = 59) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [seconds]);

  function reset() {
    setSeconds(initialSeconds);
  }

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");

  return {
    seconds,
    formatted: `${minutes}:${remainingSeconds}`,
    isExpired: seconds <= 0,
    reset,
  };
}
