"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ServicesPageAction = {
  label: string;
  href: string;
};

export type ServicesPageMeta = {
  backLabel: string;
  backHref?: string;
  useRouterBack?: boolean;
  pageTitle?: string;
  hideBack?: boolean;
  pageBadge?: string;
  pageAction?: ServicesPageAction;
};

type ServicesPageContextValue = {
  meta: ServicesPageMeta | null;
  setMeta: (meta: ServicesPageMeta | null) => void;
};

const ServicesPageContext = createContext<ServicesPageContextValue | null>(null);

export function ServicesPageProvider({ children }: { children: ReactNode }) {
  const [meta, setMetaState] = useState<ServicesPageMeta | null>(null);

  const setMeta = useCallback((nextMeta: ServicesPageMeta | null) => {
    setMetaState(nextMeta);
  }, []);

  const value = useMemo(
    () => ({
      meta,
      setMeta,
    }),
    [meta, setMeta],
  );

  return (
    <ServicesPageContext.Provider value={value}>
      {children}
    </ServicesPageContext.Provider>
  );
}

export function useServicesPageMeta() {
  const context = useContext(ServicesPageContext);

  if (!context) {
    throw new Error("useServicesPageMeta must be used within ServicesPageProvider");
  }

  return context;
}
