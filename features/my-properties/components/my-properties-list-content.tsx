"use client";

import MyPropertiesEmptyState from "@/features/my-properties/components/my-properties-empty-state";
import MyPropertiesGrid from "@/features/my-properties/components/my-properties-grid";
import MyPropertiesPagination from "@/features/my-properties/components/my-properties-pagination";
import { useMyPropertiesPagination } from "@/features/my-properties/hooks/use-my-properties-pagination";
import type { MyPropertiesLabels } from "@/features/my-properties/types/my-properties-labels";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";

type MyPropertiesListContentProps = {
  labels: MyPropertiesLabels;
  items: MyPropertyCardData[];
};

export default function MyPropertiesListContent({
  labels,
  items,
}: MyPropertiesListContentProps) {
  const { currentPage, totalPages, paginatedItems, selectPage } =
    useMyPropertiesPagination(items);

  if (items.length === 0) {
    return (
      <MyPropertiesEmptyState
        title={labels.emptyStateTitle}
        description={labels.emptyStateDescription}
        addPropertyLabel={labels.addProperty}
      />
    );
  }

  return (
    <div className="space-y-6">
      <MyPropertiesGrid items={paginatedItems} />
      <MyPropertiesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        previousLabel={labels.pagination.previous}
        nextLabel={labels.pagination.next}
        onPageChange={selectPage}
      />
    </div>
  );
}
