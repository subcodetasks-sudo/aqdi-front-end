import { getTranslations } from "next-intl/server";

import RequestsPageContent from "@/features/requests/components/requests-page-content";
import { getContracts } from "@/features/requests/services/get-contracts";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";
import { mapContractToRequestCard } from "@/features/requests/utils/map-contract-to-request-card";

export default async function RequestsPage() {
  const t = await getTranslations("requests");
  const tPayment = await getTranslations("createContract.payment");

  const labels: RequestLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    searchPlaceholder: t("searchPlaceholder"),
    filtersLabel: t("filtersLabel"),
    emptyState: t("emptyState"),
    filterAll: t("filterAll"),
    tabs: {
      residential: t("tabs.residential"),
      commercial: t("tabs.commercial"),
    },
    contractTypes: {
      housing: t("contractTypes.housing"),
      commercial: t("contractTypes.commercial"),
    },
    card: {
      requestNumberLabel: t("card.requestNumberLabel"),
      copyRequestNumber: t("card.copyRequestNumber"),
      lastUpdatedLabel: t("card.lastUpdatedLabel"),
      requestStatusLabel: t("card.requestStatusLabel"),
      paymentSuccessful: t("card.paymentSuccessful"),
      awaitingClientPayment: t("card.awaitingClientPayment"),
      unitType: {
        residential: t("card.unitType.residential"),
        commercial: t("card.unitType.commercial"),
      },
      contractTypes: {
        housing: t("contractTypes.housing"),
        commercial: t("contractTypes.commercial"),
      },
      viewData: t("card.viewData"),
      viewShort: t("card.viewShort"),
      completeRequest: t("card.completeRequest"),
      draftIncompleteBadge: t("card.draftIncompleteBadge"),
      incompleteValidityNotice: t("card.incompleteValidityNotice"),
      editError: t("card.editError"),
      incompleteProgressDialog: {
        title: t("card.incompleteProgressDialog.title", {
          number: "{number}",
        }),
        close: t("card.incompleteProgressDialog.close"),
        loading: t("card.incompleteProgressDialog.loading"),
        requestNumberLabel: t("card.incompleteProgressDialog.requestNumberLabel"),
        contractTypeLabel: t("card.incompleteProgressDialog.contractTypeLabel"),
        financialFeeLabel: t("card.incompleteProgressDialog.financialFeeLabel"),
        pathTitle: t("card.incompleteProgressDialog.pathTitle"),
        continueCta: t("card.incompleteProgressDialog.continueCta"),
        currency: t("card.incompleteProgressDialog.currency"),
        draftBadge: t("card.incompleteProgressDialog.draftBadge"),
        stepStatus: {
          completed: t("card.incompleteProgressDialog.stepStatus.completed"),
          current: t("card.incompleteProgressDialog.stepStatus.current"),
          pending: t("card.incompleteProgressDialog.stepStatus.pending"),
        },
        steps: {
          contractType: t("card.incompleteProgressDialog.steps.contractType"),
          deed: t("card.incompleteProgressDialog.steps.deed"),
          owner: t("card.incompleteProgressDialog.steps.owner"),
          tenant: t("card.incompleteProgressDialog.steps.tenant"),
          unit: t("card.incompleteProgressDialog.steps.unit"),
          finance: t("card.incompleteProgressDialog.steps.finance"),
          payment: t("card.incompleteProgressDialog.steps.payment"),
        },
      },
      detailsDialog: {
        title: t("card.detailsDialog.title", { number: "{number}" }),
        subtitle: t("card.detailsDialog.subtitle"),
        close: t("card.detailsDialog.close"),
        loading: t("card.detailsDialog.loading"),
        emptyValue: t("card.detailsDialog.emptyValue"),
        ownerSection: t("card.detailsDialog.ownerSection"),
        tenantSection: t("card.detailsDialog.tenantSection"),
        unitSection: t("card.detailsDialog.unitSection"),
        financeSection: t("card.detailsDialog.financeSection"),
        fields: {
          name: t("card.detailsDialog.fields.name"),
          idNumber: t("card.detailsDialog.fields.idNumber"),
          mobile: t("card.detailsDialog.fields.mobile"),
          unitType: t("card.detailsDialog.fields.unitType"),
          usage: t("card.detailsDialog.fields.usage"),
          area: t("card.detailsDialog.fields.area"),
          floor: t("card.detailsDialog.fields.floor"),
          electricityMeter: t("card.detailsDialog.fields.electricityMeter"),
          waterMeter: t("card.detailsDialog.fields.waterMeter"),
          annualRent: t("card.detailsDialog.fields.annualRent"),
          contractDuration: t("card.detailsDialog.fields.contractDuration"),
          paymentsCount: t("card.detailsDialog.fields.paymentsCount"),
          financialFee: t("card.detailsDialog.fields.financialFee"),
        },
        duration: {
          oneYear: t("card.detailsDialog.duration.oneYear"),
          years: t("card.detailsDialog.duration.years", { count: "{count}" }),
          months: t("card.detailsDialog.duration.months", { count: "{count}" }),
        },
        payments: {
          monthly: t("card.detailsDialog.payments.monthly"),
          quarterly: t("card.detailsDialog.payments.quarterly"),
          semiAnnual: t("card.detailsDialog.payments.semiAnnual"),
          annual: t("card.detailsDialog.payments.annual"),
        },
        currency: t("card.detailsDialog.currency"),
        areaUnit: t("card.detailsDialog.areaUnit"),
      },
      completePayment: t("card.completePayment"),
      completePaymentLoading: t("card.completePaymentLoading"),
      paymentFlow: {
        methodDialog: {
          title: tPayment("methodDialog.title"),
          question: tPayment("methodDialog.question"),
          submitting: tPayment("methodDialog.submitting"),
          draft: {
            title: tPayment("methodDialog.draft.title"),
            description: tPayment("methodDialog.draft.description"),
          },
          payNow: {
            title: tPayment("methodDialog.payNow.title"),
            description: tPayment("methodDialog.payNow.description"),
          },
          missingContractSession: tPayment("methodDialog.missingContractSession"),
          draftError: tPayment("methodDialog.draftError"),
        },
        draftSuccessDialog: {
          title: tPayment("draftSuccessDialog.title"),
          paymentStatusLabel: tPayment("draftSuccessDialog.paymentStatusLabel"),
          paymentStatusDescription: tPayment(
            "draftSuccessDialog.paymentStatusDescription",
          ),
          orderNumberLabel: tPayment("draftSuccessDialog.orderNumberLabel"),
          copy: tPayment("draftSuccessDialog.copy"),
          copySuccess: tPayment("draftSuccessDialog.copySuccess"),
          copyError: tPayment("draftSuccessDialog.copyError"),
          preparationDescription: tPayment(
            "draftSuccessDialog.preparationDescription",
          ),
          whatsappCta: tPayment("draftSuccessDialog.whatsappCta"),
          whatsappHref: tPayment("draftSuccessDialog.whatsappHref"),
        },
        payError: tPayment("navigation.payError"),
      },
      whenReceiveContract: t("card.whenReceiveContract"),
      receiveContractDialog: {
        title: t("card.receiveContractDialog.title"),
        subtitle: t("card.receiveContractDialog.subtitle", {
          number: "{number}",
        }),
        close: t("card.receiveContractDialog.close"),
        loading: t("card.receiveContractDialog.loading"),
        retry: t("card.receiveContractDialog.retry"),
        draftBadge: t("card.receiveContractDialog.draftBadge"),
        statusUpdatedToast: t("card.receiveContractDialog.statusUpdatedToast"),
        expectedDurationTitle: t("card.receiveContractDialog.expectedDurationTitle"),
        expectedDurationBody: t("card.receiveContractDialog.expectedDurationBody"),
        contactPrompt: t("card.receiveContractDialog.contactPrompt"),
        whatsappCta: t("card.receiveContractDialog.whatsappCta"),
        whatsappHref: t("card.receiveContractDialog.whatsappHref"),
      },
      downloadInvoice: t("card.downloadInvoice"),
      invoiceDialog: {
        close: t("card.invoiceDialog.close"),
        loading: t("card.invoiceDialog.loading"),
        retry: t("card.invoiceDialog.retry"),
        loadError: t("card.invoiceDialog.loadError"),
        customerLabel: t("card.invoiceDialog.customerLabel"),
        requestNumberLabel: t("card.invoiceDialog.requestNumberLabel"),
        contractTypeLabel: t("card.invoiceDialog.contractTypeLabel"),
        tableIndex: t("card.invoiceDialog.tableIndex"),
        tableDescription: t("card.invoiceDialog.tableDescription"),
        tableAmount: t("card.invoiceDialog.tableAmount"),
        title: t("card.invoiceDialog.title"),
        platformName: t("card.invoiceDialog.platformName"),
        platformSubtitle: t("card.invoiceDialog.platformSubtitle"),
        printLabel: t("card.invoiceDialog.printLabel"),
        totalDueLabel: t("card.invoiceDialog.totalDueLabel"),
        unpaidStatusLabel: t("card.invoiceDialog.unpaidStatusLabel"),
        paidStatusLabel: t("card.invoiceDialog.paidStatusLabel"),
      },
      whatsappLabel: t("card.whatsappLabel"),
      whatsappHref: t("card.whatsappHref"),
      status: {
        completed: t("card.status.completed"),
        incomplete: t("card.status.incomplete"),
        inProgress: t("card.status.inProgress"),
        returned: t("card.status.returned"),
      },
    },
  };

  let items: RequestCardData[] = [];

  try {
    const contracts = await getContracts();

    items = contracts
      .map((contract) =>
        mapContractToRequestCard(contract, {
          housing: labels.contractTypes.housing,
          commercial: labels.contractTypes.commercial,
        }),
      )
      .sort((a, b) => Number(b.contractId) - Number(a.contractId));
  } catch {
    items = [];
  }

  return <RequestsPageContent labels={labels} items={items} />;
}
