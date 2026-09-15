"use server";

import { apiRequest } from "@/lib/api/api-request";
import type {
  CommonQuestion,
  CommonQuestionsApiResponse,
} from "@/features/faq/types/common-question";

export async function getCommonQuestions(): Promise<CommonQuestion[]> {
  const response = await apiRequest<CommonQuestionsApiResponse>(
    "/common-questions",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error || response.data?.message || "Failed to fetch common questions",
    );
  }

  return response.data.data.map((item, index) => ({
    id: `faq-${index}`,
    question: item.title,
    answer: item.answer,
  }));
}
