export type ContractJourneyStepState = "completed" | "current" | "pending";

export type ContractStatusType = "contract" | "draft";

export type ContractJourneyStep = {
  key: string;
  status: string;
  status_label: string;
  description: string;
  state: ContractJourneyStepState;
};

export type ContractStatusSnapshot = {
  contractId: number;
  status: string;
  status_label: string;
  status_type: ContractStatusType;
  status_id: number | null;
  status_color?: string | null;
  status_description?: string | null;
  journey_status: string;
  journey_status_label: string;
  journey: ContractJourneyStep[];
};

export type ContractDetail = ContractStatusSnapshot & {
  uuid?: string;
  is_completed?: boolean;
  is_draft?: boolean;
  step?: number;
};

export type ContractDetailApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: Record<string, unknown>;
};
