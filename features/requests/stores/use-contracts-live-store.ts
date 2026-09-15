"use client";

import { create } from "zustand";

import type {
  ContractJourneyStep,
  ContractStatusSnapshot,
  ContractStatusType,
} from "@/features/requests/types/contract-journey";

export type ContractLivePatch = {
  contractId: number;
  status?: string;
  status_label?: string;
  status_type?: ContractStatusType;
  status_id?: number | null;
  status_color?: string | null;
  status_description?: string | null;
  journey_status?: string;
  journey_status_label?: string;
  journey?: ContractJourneyStep[];
  revision?: number;
};

type ContractsLiveState = {
  byId: Record<number, ContractLivePatch>;
  lastEventId: number;
  applySnapshot: (snapshot: ContractStatusSnapshot) => void;
  applyFirebasePatch: (patch: ContractLivePatch) => void;
  clear: (contractId?: number) => void;
};

export const useContractsLiveStore = create<ContractsLiveState>((set) => ({
  byId: {},
  lastEventId: 0,
  applySnapshot: (snapshot) =>
    set((state) => ({
      lastEventId: state.lastEventId + 1,
      byId: {
        ...state.byId,
        [snapshot.contractId]: {
          contractId: snapshot.contractId,
          status: snapshot.status,
          status_label: snapshot.status_label,
          status_type: snapshot.status_type,
          status_id: snapshot.status_id,
          status_color: snapshot.status_color,
          status_description: snapshot.status_description,
          journey_status: snapshot.journey_status,
          journey_status_label: snapshot.journey_status_label,
          journey: snapshot.journey,
          revision: (state.byId[snapshot.contractId]?.revision ?? 0) + 1,
        },
      },
    })),
  applyFirebasePatch: (patch) =>
    set((state) => {
      const previous = state.byId[patch.contractId] ?? {
        contractId: patch.contractId,
      };

      return {
        lastEventId: state.lastEventId + 1,
        byId: {
          ...state.byId,
          [patch.contractId]: {
            ...previous,
            ...patch,
            contractId: patch.contractId,
            revision: (previous.revision ?? 0) + 1,
          },
        },
      };
    }),
  clear: (contractId) =>
    set((state) => {
      if (contractId == null) {
        return { byId: {}, lastEventId: state.lastEventId + 1 };
      }

      const next = { ...state.byId };
      delete next[contractId];
      return { byId: next, lastEventId: state.lastEventId + 1 };
    }),
}));
