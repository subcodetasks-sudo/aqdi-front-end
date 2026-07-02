import RequestsHeader from "@/features/requests/components/requests-header";
import RequestsUnitTabs from "@/features/requests/components/requests-unit-tabs";
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
    <section className="container py-8 lg:py-10">
      <RequestsHeader
        backLabel={labels.backLabel}
        pageTitle={labels.pageTitle}
      />

      <RequestsUnitTabs
        labels={labels}
        residentialItems={residentialItems}
        commercialItems={commercialItems}
      />
    </section>
  );
}
