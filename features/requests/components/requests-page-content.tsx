import RequestsHeader from "@/features/requests/components/requests-header";
import RequestsUnitTabs from "@/features/requests/components/requests-unit-tabs";
import type { RequestLabels } from "@/features/requests/types/request-labels";

type RequestsPageContentProps = {
  labels: RequestLabels;
};

export default function RequestsPageContent({
  labels,
}: RequestsPageContentProps) {
  return (
    <section className="container py-8 lg:py-10">
      <RequestsHeader
        backLabel={labels.backLabel}
        pageTitle={labels.pageTitle}
      />

      <RequestsUnitTabs labels={labels} />
    </section>
  );
}
