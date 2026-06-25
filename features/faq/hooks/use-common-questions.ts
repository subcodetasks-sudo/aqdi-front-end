"use client";

import { useQuery } from "@tanstack/react-query";

import { faqKeys } from "@/features/faq/query-keys";
import { getCommonQuestions } from "@/features/faq/services/get-common-questions";

export function useCommonQuestions() {
  return useQuery({
    queryKey: faqKeys.list(),
    queryFn: getCommonQuestions,
  });
}
