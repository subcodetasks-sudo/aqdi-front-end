"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import RequestsGrid from "@/features/requests/components/requests-grid";
import type { RequestCardData, RequestUnitTab } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";
import { cn } from "@/lib/utils";

type RequestsListContentProps = {
  labels: RequestLabels;
  items: RequestCardData[];
};

export default function RequestsListContent({
  labels,
  items,
}: RequestsListContentProps) {
  const t = useTranslations("requests");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RequestUnitTab>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        filter === "all" || item.contractType === filter;
      const matchesSearch =
        query.length === 0 || item.searchText.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, items, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <header className="min-w-0 space-y-2">
          <h1 className="text-3xl font-extrabold text-brand md:text-4xl">
            {labels.pageTitle}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[#7a7a7a] md:text-base">
            {labels.pageSubtitle}
          </p>
        </header>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
          <div className="relative min-w-0 flex-1 lg:w-72">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#b0b0b0]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={labels.searchPlaceholder}
              className="h-11 w-full rounded-2xl border border-[#ececec] bg-white pe-3 ps-10 text-sm text-[#333333] outline-none transition-colors placeholder:text-[#b0b0b0] focus:border-brand/40"
            />
          </div>

          <div className="relative flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#ececec] bg-white px-4 text-sm font-bold text-[#555555] transition-colors hover:bg-[#fafafa]"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              {labels.filtersLabel}
            </button>

            <span className="inline-flex items-center rounded-full bg-brand-background-green px-3.5 py-1.5 text-sm font-bold text-brand">
              {t("requestsCount", { count: filteredItems.length })}
            </span>

            {filtersOpen ? (
              <div className="absolute end-0 top-[calc(100%+0.5rem)] z-20 min-w-44 overflow-hidden rounded-2xl border border-[#ececec] bg-white p-1.5 shadow-lg">
                {(
                  [
                    ["all", labels.filterAll],
                    ["residential", labels.tabs.residential],
                    ["commercial", labels.tabs.commercial],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setFilter(value);
                      setFiltersOpen(false);
                    }}
                    className={cn(
                      "flex w-full rounded-xl px-3 py-2.5 text-start text-sm font-semibold transition-colors",
                      filter === value
                        ? "bg-brand-background-green text-brand"
                        : "text-[#555555] hover:bg-[#f7f7f7]",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="rounded-3xl bg-white px-6 py-12 text-center text-sm text-muted-foreground shadow-sm">
          {labels.emptyState}
        </p>
      ) : (
        <RequestsGrid items={filteredItems} labels={labels.card} />
      )}
    </div>
  );
}
