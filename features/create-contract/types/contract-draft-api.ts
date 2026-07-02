export type ContractDraftApiData = {
  id: number;
  uuid: string;
  is_draft: boolean;
};

export type ContractDraftApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: ContractDraftApiData;
};
