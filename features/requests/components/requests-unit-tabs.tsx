"use client";

import RequestsGrid from "@/features/requests/components/requests-grid";
import { useRequestsTabs } from "@/features/requests/hooks/use-requests-tabs";
import type { RequestLabels } from "@/features/requests/types/request-labels";
import { cn } from "@/lib/utils";

type RequestsUnitTabsProps = {
  labels: RequestLabels;
};

export default function RequestsUnitTabs({ labels }: RequestsUnitTabsProps) {
  const { activeTab, selectTab } = useRequestsTabs();

  const items =
    activeTab === "residential"
      ? labels.residentialItems
      : labels.commercialItems;

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

      <RequestsGrid items={items} labels={labels.card} />
    </div>
  );
}
