"use client";

import { useEffect, useState } from "react";

function readStoredEndTime(storageKey: string): number | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredEndTime(storageKey: string, endTime: number) {
  try {
    window.localStorage.setItem(storageKey, String(endTime));
  } catch {
    // ignore storage failures (e.g. private browsing)
  }
}

function getSecondsRemaining(endTime: number) {
  return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
}

export function useOtpTimer(initialSeconds = 300, storageKey?: string) {
  // Renders the same on server and first client pass; the real end time
  // (which may come from localStorage) is only read after mount, in an
  // effect, to avoid a hydration mismatch.
  const [endTime, setEndTime] = useState(() => Date.now() + initialSeconds * 1000);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = storageKey ? readStoredEndTime(storageKey) : null;
    const resolvedEndTime = stored && stored > Date.now() ? stored : endTime;

    if (storageKey && !stored) {
      writeStoredEndTime(storageKey, resolvedEndTime);
    }

    setEndTime(resolvedEndTime);
    setSeconds(getSecondsRemaining(resolvedEndTime));
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getSecondsRemaining(endTime) <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSeconds(getSecondsRemaining(endTime));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [endTime]);

  function reset() {
    const next = Date.now() + initialSeconds * 1000;
    if (storageKey) {
      writeStoredEndTime(storageKey, next);
    }
    setEndTime(next);
    setSeconds(initialSeconds);
  }

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");

  return {
    seconds,
    formatted: `${minutes}:${remainingSeconds}`,
    isExpired: seconds <= 0,
    isReady,
    reset,
  };
}
