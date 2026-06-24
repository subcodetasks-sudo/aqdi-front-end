import type { RequestCardData } from "@/features/requests/types/request";

export type RequestCardLabels = {
  requestDateLabel: string;
  requestNumberLabel: string;
  inquiryDivider: string;
  copyRequestNumber: string;
  paymentSuccessful: string;
  viewOrEdit: string;
  completePaymentHint: string;
  completePayment: string;
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
  tabs: {
    residential: string;
    commercial: string;
  };
  card: RequestCardLabels;
  residentialItems: RequestCardData[];
  commercialItems: RequestCardData[];
};
