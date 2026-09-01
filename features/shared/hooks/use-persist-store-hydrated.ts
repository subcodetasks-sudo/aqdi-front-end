"use client";

import { useEffect, useState } from "react";

type PersistStoreApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
};

export function usePersistStoreHydrated(
  persistApi?: PersistStoreApi,
) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!persistApi) {
      setIsHydrated(true);
      return;
    }

    if (persistApi.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    return persistApi.onFinishHydration(() => {
      setIsHydrated(true);
    });
  }, [persistApi]);

  return isHydrated;
}
