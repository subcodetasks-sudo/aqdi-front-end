import type { ContractPaymentMethodLabels } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import type { RequestCardData } from "@/features/requests/types/request";

export type RequestCardLabels = {
  requestDateLabel: string;
  requestNumberLabel: string;
  inquiryDivider: string;
  copyRequestNumber: string;
  paymentSuccessful: string;
  viewOrEdit: string;
  editError: string;
  completePaymentHint: string;
  completePayment: string;
  completePaymentLoading: string;
  paymentFlow: ContractPaymentMethodLabels;
  helpCenter: string;
  whenReceiveContract: string;
  status: {
    completed: string;
    incomplete: string;
    inProgress: string;
    returned: string;
  };
};

export type RequestLabels = {
  backLabel: string;
  pageTitle: string;
  emptyState: string;
  tabs: {
    residential: string;
    commercial: string;
  };
  contractTypes: {
    housing: string;
    commercial: string;
  };
  card: RequestCardLabels;
};
