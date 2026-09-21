"use client";

import { useMemo, useState } from "react";

const MY_PROPERTIES_PAGE_SIZE = 9;

export function useMyPropertiesPagination<T>(items: T[]) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / MY_PROPERTIES_PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * MY_PROPERTIES_PAGE_SIZE;
    return items.slice(startIndex, startIndex + MY_PROPERTIES_PAGE_SIZE);
  }, [items, currentPage]);

  function selectPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return { currentPage, totalPages, paginatedItems, selectPage };
}
