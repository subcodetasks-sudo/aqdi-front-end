export type TenantRoleOption = {
  id: number;
  text_of_reason: string;
  created_at: string | null;
  updated_at: string | null;
};

export type TenantRolesApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: TenantRoleOption[];
};
