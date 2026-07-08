export type RequestStatus =
  | "completed"
  | "incomplete"
  | "in-progress"
  | "returned";

export type RequestActionType =
  | "none"
  | "help-center"
  | "complete-payment"
  | "dual-actions";

export type RequestCardData = {
  id: string;
  contractId: number;
  contractType: "residential" | "commercial";
  uuid: string;
  title: string;
  date: string;
  requestNumber: string;
  status: RequestStatus;
  statusName: string | null;
  statusColor: string | null;
  paymentSuccessful: boolean;
  showViewEdit: boolean;
  actionType: RequestActionType;
};

export type RequestUnitTab = "residential" | "commercial";
