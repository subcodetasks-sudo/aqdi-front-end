export type RequestStatus =
  | "completed"
  | "incomplete"
  | "in-progress"
  | "returned";

export type RequestActionType =
  | "help-center"
  | "complete-payment"
  | "dual-actions";

export type RequestCardData = {
  id: string;
  contractId: number;
  contractType: "residential" | "commercial";
  title: string;
  date: string;
  requestNumber: string;
  status: RequestStatus;
  paymentSuccessful: boolean;
  showViewEdit: boolean;
  actionType: RequestActionType;
};

export type RequestUnitTab = "residential" | "commercial";
