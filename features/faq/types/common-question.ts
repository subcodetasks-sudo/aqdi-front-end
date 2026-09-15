export type CommonQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type CommonQuestionsApiItem = {
  title: string;
  answer: string;
};

export type CommonQuestionsApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: CommonQuestionsApiItem[];
};
