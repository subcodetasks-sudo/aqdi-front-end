import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";

export type CreateContractReviewEditTarget =
  | "overview"
  | "deed"
  | "nationalAddress"
  | "owner"
  | "tenant"
  | "unit"
  | "rent";

export type CreateContractReviewField = {
  label: string;
  value: string;
  href?: string | null;
  viewUrl?: string | null;
};

export type CreateContractReviewSection = {
  id: string;
  title: string;
  editTarget: CreateContractReviewEditTarget;
  fields: CreateContractReviewField[];
  variant?: "default" | "rent";
  incomplete?: boolean;
};

export type CreateContractReviewOrderSummary = {
  orderNumber: string;
  contractUuid: string;
  overview: {
    contractType: string;
    startDate: string;
    duration: string;
  };
  sections: CreateContractReviewSection[];
  copyText: string;
};

export function reviewEditTargetToStep(
  target: CreateContractReviewEditTarget,
): CreateContractStep {
  switch (target) {
    case "overview":
    case "rent":
      return "finance";
    case "deed":
    case "nationalAddress":
      return "deed";
    case "owner":
      return "owner";
    case "tenant":
    case "unit":
      return "tenant";
  }
}
