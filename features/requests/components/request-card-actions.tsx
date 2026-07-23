import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import RequestCompletePaymentButton from "@/features/requests/components/request-complete-payment-button";
import RequestInvoiceButton from "@/features/requests/components/request-invoice-button";
import RequestReceiveContractButton from "@/features/requests/components/request-receive-contract-button";
import RequestViewDataButton from "@/features/requests/components/request-view-data-button";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestCardLabels } from "@/features/requests/types/request-labels";

type RequestCardActionsProps = {
  card: Pick<
    RequestCardData,
    | "actionType"
    | "uuid"
    | "contractId"
    | "contractType"
    | "requestNumber"
    | "showDownloadInvoice"
  >;
  labels: RequestCardLabels;
};

export default function RequestCardActions({
  card,
  labels,
}: RequestCardActionsProps) {
  const contractTypeLabel =
    card.contractType === "commercial"
      ? labels.contractTypes.commercial
      : labels.contractTypes.housing;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#f0f0f0] pt-4">
      {/* RTL visual (right → left): WhatsApp, View, Invoice?, When, Pay? */}
      <Link
        href={labels.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsappLabel}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f8ee] text-[#25D366] transition-opacity hover:opacity-90"
      >
        <FaWhatsapp className="size-5" aria-hidden="true" />
      </Link>

      <RequestViewDataButton
        uuid={card.uuid}
        requestNumber={card.requestNumber}
        label={labels.viewData}
        loadErrorLabel={labels.editError}
        detailsLabels={labels.detailsDialog}
      />

      {card.showDownloadInvoice ? (
        <RequestInvoiceButton
          label={labels.downloadInvoice}
          contractId={card.contractId}
          uuid={card.uuid}
          contractTypeLabel={contractTypeLabel}
          invoiceLabels={labels.invoiceDialog}
        />
      ) : null}

      <RequestReceiveContractButton
        label={labels.whenReceiveContract}
        actionType={card.actionType}
        contractId={card.contractId}
        contractUuid={card.uuid}
        completePaymentLabel={labels.completePayment}
        completePaymentLoadingLabel={labels.completePaymentLoading}
        paymentFlowLabels={labels.paymentFlow}
        dialogLabels={labels.receiveContractDialog}
      />

      {card.actionType === "complete-payment" ? (
        <RequestCompletePaymentButton
          contractId={card.contractId}
          contractUuid={card.uuid}
          label={labels.completePayment}
          payingLabel={labels.completePaymentLoading}
          paymentFlowLabels={labels.paymentFlow}
        />
      ) : null}
    </div>
  );
}
