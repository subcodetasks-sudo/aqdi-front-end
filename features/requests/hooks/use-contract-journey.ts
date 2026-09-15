"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getContractById,
  type GetContractByIdResult,
} from "@/features/requests/services/get-contract-by-id";
import { useContractsLiveStore } from "@/features/requests/stores/use-contracts-live-store";
import type { ContractDetail } from "@/features/requests/types/contract-journey";

type UseContractJourneyOptions = {
  contractId: number;
  enabled: boolean;
};

export function useContractJourney({
  contractId,
  enabled,
}: UseContractJourneyOptions) {
  const [detail, setDetail] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const livePatch = useContractsLiveStore((state) => state.byId[contractId]);
  const applySnapshot = useContractsLiveStore((state) => state.applySnapshot);
  const lastHandledRevision = useRef<number | null>(null);
  const ignoreNextStoreEvent = useRef(false);
  const requestKey = enabled ? contractId : null;
  const [activeRequestKey, setActiveRequestKey] = useState<number | null>(
    null,
  );

  // Reset during render when a new contract starts loading, so the fetch
  // effect only sets state once the request resolves.
  if (requestKey !== activeRequestKey) {
    setActiveRequestKey(requestKey);
    if (requestKey !== null) {
      setDetail(null);
      setLoading(true);
      setError(null);
    }
  }

  const applyResult = useCallback(
    (result: GetContractByIdResult, silent: boolean) => {
      if (!result.ok) {
        if (!silent) {
          setError(result.error);
          setLoading(false);
        }
        return;
      }

      setDetail(result.data);
      ignoreNextStoreEvent.current = true;
      applySnapshot(result.data);
      setError(null);
      setLoading(false);
    },
    [applySnapshot],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    lastHandledRevision.current = null;
    ignoreNextStoreEvent.current = false;

    void getContractById(contractId).then((result) => {
      if (!cancelled) {
        applyResult(result, false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [applyResult, contractId, enabled]);

  useEffect(() => {
    if (!enabled || !livePatch?.revision) {
      return;
    }

    if (lastHandledRevision.current === livePatch.revision) {
      return;
    }

    if (ignoreNextStoreEvent.current) {
      ignoreNextStoreEvent.current = false;
      lastHandledRevision.current = livePatch.revision;
      return;
    }

    lastHandledRevision.current = livePatch.revision;

    setDetail((previous) => {
      if (!previous) {
        return {
          contractId,
          status: livePatch.status ?? "",
          status_label: livePatch.status_label ?? "",
          status_type: livePatch.status_type ?? "contract",
          status_id: livePatch.status_id ?? null,
          status_color: livePatch.status_color,
          status_description: livePatch.status_description,
          journey_status: livePatch.journey_status ?? "",
          journey_status_label: livePatch.journey_status_label ?? "",
          journey: livePatch.journey ?? [],
        };
      }

      return {
        ...previous,
        status: livePatch.status ?? previous.status,
        status_label: livePatch.status_label ?? previous.status_label,
        status_type: livePatch.status_type ?? previous.status_type,
        status_id:
          livePatch.status_id !== undefined
            ? livePatch.status_id
            : previous.status_id,
        status_color:
          livePatch.status_color !== undefined
            ? livePatch.status_color
            : previous.status_color,
        status_description:
          livePatch.status_description !== undefined
            ? livePatch.status_description
            : previous.status_description,
        journey_status: livePatch.journey_status ?? previous.journey_status,
        journey_status_label:
          livePatch.journey_status_label ?? previous.journey_status_label,
        journey: livePatch.journey ?? previous.journey,
      };
    });

    void getContractById(contractId).then((result) =>
      applyResult(result, true),
    );
  }, [applyResult, contractId, enabled, livePatch]);

  return {
    detail,
    loading,
    error,
    reload: () => {
      setLoading(true);
      setError(null);
      void getContractById(contractId).then((result) =>
        applyResult(result, false),
      );
    },
  };
}
