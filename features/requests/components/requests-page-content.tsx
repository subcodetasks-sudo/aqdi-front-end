import RequestsListContent from "@/features/requests/components/requests-list-content";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";

type RequestsPageContentProps = {
  labels: RequestLabels;
  items: RequestCardData[];
};

export default function RequestsPageContent({
  labels,
  items,
}: RequestsPageContentProps) {
  return (
    <>
      <ServicesPageBackConfig backLabel={labels.backLabel} backHref="/" />

      <RequestsListContent labels={labels} items={items} />
    </>
  );
}
