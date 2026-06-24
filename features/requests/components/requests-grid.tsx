import RequestCard from "@/features/requests/components/request-card";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestCardLabels } from "@/features/requests/types/request-labels";

type RequestsGridProps = {
  items: RequestCardData[];
  labels: RequestCardLabels;
};

export default function RequestsGrid({ items, labels }: RequestsGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((card) => (
        <RequestCard key={card.id} card={card} labels={labels} />
      ))}
    </div>
  );
}
