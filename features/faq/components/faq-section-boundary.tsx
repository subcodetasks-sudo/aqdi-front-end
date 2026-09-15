import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import FaqSection from "@/features/faq/components/faq-section";
import { faqKeys } from "@/features/faq/query-keys";
import { getCommonQuestions } from "@/features/faq/services/get-common-questions";
import { getQueryClient } from "@/lib/react-query/get-query-client";

export default async function FaqSectionBoundary() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: faqKeys.list(),
    queryFn: getCommonQuestions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FaqSection />
    </HydrationBoundary>
  );
}
