import type { PaymentMethodOption } from "@/features/create-contract/types/finance-step";

const PAYMENT_TYPE_ID_BY_METHOD: Record<PaymentMethodOption, number> = {
  monthly: 1,
  quarterly: 2,
  "semi-annual": 3,
  annual: 4,
};

export function mapPaymentMethodToTypeId(paymentMethod: PaymentMethodOption) {
  return PAYMENT_TYPE_ID_BY_METHOD[paymentMethod];
}
