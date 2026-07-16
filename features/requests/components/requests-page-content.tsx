import RequestsUnitTabs from "@/features/requests/components/requests-unit-tabs";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";

type RequestsPageContentProps = {
  labels: RequestLabels;
  residentialItems: RequestCardData[];
  commercialItems: RequestCardData[];
};

export default function RequestsPageContent({
  labels,
  residentialItems,
  commercialItems,
}: RequestsPageContentProps) {
  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        backHref="/"
        pageTitle={labels.pageTitle}
      />

      <RequestsUnitTabs
        labels={labels}
        residentialItems={residentialItems}
        commercialItems={commercialItems}
      />
    </>
  );
}
