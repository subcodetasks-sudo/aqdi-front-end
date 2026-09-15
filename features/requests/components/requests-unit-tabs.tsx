"use client";

import RequestsGrid from "@/features/requests/components/requests-grid";
import { useRequestsTabs } from "@/features/requests/hooks/use-requests-tabs";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";
import { cn } from "@/lib/utils";

type RequestsUnitTabsProps = {
  labels: RequestLabels;
  residentialItems: RequestCardData[];
  commercialItems: RequestCardData[];
};

export default function RequestsUnitTabs({
  labels,
  residentialItems,
  commercialItems,
}: RequestsUnitTabsProps) {
  const { activeTab, selectTab } = useRequestsTabs();

  const items =
    activeTab === "residential" ? residentialItems : commercialItems;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-brand-background p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectTab("residential")}
            className={cn(
              "rounded-[22px] py-4 text-sm font-extrabold transition-colors md:text-base",
              activeTab === "residential"
                ? "bg-brand text-white"
                : "bg-white text-[#bdbdbd]",
            )}
          >
            {labels.tabs.residential}
          </button>
          <button
            type="button"
            onClick={() => selectTab("commercial")}
            className={cn(
              "rounded-[22px] py-4 text-sm font-extrabold transition-colors md:text-base",
              activeTab === "commercial"
                ? "bg-brand text-white"
                : "bg-white text-[#bdbdbd]",
            )}
          >
            {labels.tabs.commercial}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-3xl bg-white px-6 py-12 text-center text-sm text-muted-foreground shadow-sm">
          {labels.emptyState}
        </p>
      ) : (
        <RequestsGrid items={items} labels={labels.card} />
      )}
    </div>
  );
}
