"use client";

import { useEffect } from "react";

type CreateFlowDraftHydratorProps = {
  hydrate: () => void;
};

export default function CreateFlowDraftHydrator({
  hydrate,
}: CreateFlowDraftHydratorProps) {
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
