"use client";

import { useCallback, useSyncExternalStore } from "react";

type PersistStoreApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
};

function noopUnsubscribe() {}

function getServerSnapshot() {
  return false;
}

export function usePersistStoreHydrated(
  persistApi?: PersistStoreApi,
) {
  const subscribe = useCallback(
    (onChange: () => void) =>
      persistApi ? persistApi.onFinishHydration(onChange) : noopUnsubscribe,
    [persistApi],
  );

  const getSnapshot = useCallback(
    () => (persistApi ? persistApi.hasHydrated() : true),
    [persistApi],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
