export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};
