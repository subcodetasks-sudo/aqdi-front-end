export type TenantRoleInputFieldType = "text" | "number";

export type TenantRole = {
  id: number;
  text_of_reason: string;
  name: string;
  service_definition: string | null;
  input_field_label: string | null;
  input_field_type: TenantRoleInputFieldType | null;
  has_user_input: boolean;
  icon: string | null;
  input_icon: string | null;
  pop: boolean;
};

export type TenantRoleDetail = TenantRole & {
  value: string | null;
};

/** @deprecated Prefer TenantRole */
export type TenantRoleOption = TenantRole;

export type TenantRolesApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: TenantRole[];
};
