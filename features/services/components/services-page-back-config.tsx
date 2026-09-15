"use client";

import { useLayoutEffect } from "react";

import {
  useServicesPageMeta,
  type ServicesPageMeta,
} from "@/features/services/components/services-page-provider";

export default function ServicesPageBackConfig(props: ServicesPageMeta) {
  const { setMeta } = useServicesPageMeta();

  useLayoutEffect(() => {
    setMeta(props);

    return () => {
      setMeta(null);
    };
  }, [
    props.backLabel,
    props.backHref,
    props.pageTitle,
    props.useRouterBack,
    props.hideBack,
    props.pageBadge,
    props.pageAction?.label,
    props.pageAction?.href,
    setMeta,
  ]);

  return null;
}
