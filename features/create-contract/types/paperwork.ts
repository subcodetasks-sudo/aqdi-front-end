export type PaperworkItem = {
  id: number;
  name: string;
  icon: string;
};

export type PaperworkApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: PaperworkItem[];
};
