import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  CircleDot,
  Clock,
  Coins,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import type { TenantRole } from "@/features/create-contract/types/tenant-role";

export type TenantRoleSelectionState = {
  selectedIds: number[];
  values: Record<string, string>;
};

export type TenantRoleToggleResult = TenantRoleSelectionState & {
  openModal: TenantRole | null;
};

const ICON_MAP: Record<string, LucideIcon> = {
  "fa-key": KeyRound,
  key: KeyRound,
  "fa-clock": Clock,
  clock: Clock,
  "fa-shield": ShieldCheck,
  "fa-shield-alt": ShieldCheck,
  "fa-shield-halved": ShieldCheck,
  shield: ShieldCheck,
  "fa-coins": Coins,
  coins: Coins,
  "fa-money-bill": Banknote,
  "fa-money-bill-wave": Banknote,
  "money-bill": Banknote,
};

function normalizeIconName(icon: string | null | undefined) {
  if (!icon) {
    return "";
  }

  return icon.trim().toLowerCase().replace(/^fas?\s+/, "");
}

export function resolveTenantRoleIcon(
  icon: string | null | undefined,
): LucideIcon {
  const key = normalizeIconName(icon);
  return ICON_MAP[key] ?? CircleDot;
}

export function getTenantRoleTitle(role: TenantRole) {
  return role.name?.trim() || role.text_of_reason;
}

export function isDailyFineRole(role: TenantRole) {
  const haystack = `${role.name} ${role.text_of_reason} ${role.icon ?? ""} ${role.input_icon ?? ""}`;
  return /يوم|clock/i.test(haystack);
}

export function isSecurityDepositRole(role: TenantRole) {
  const haystack = `${role.name} ${role.text_of_reason} ${role.icon ?? ""} ${role.input_icon ?? ""}`;
  return /ضمان|shield/i.test(haystack);
}

export function onToggleTenantRole(
  role: TenantRole,
  checked: boolean,
  state: TenantRoleSelectionState,
): TenantRoleToggleResult {
  if (!checked) {
    return {
      selectedIds: state.selectedIds.filter((id) => id !== role.id),
      values: Object.fromEntries(
        Object.entries(state.values).filter(([key]) => key !== String(role.id)),
      ),
      openModal: null,
    };
  }

  const selectedIds = [...new Set([...state.selectedIds, role.id])];
  const values = role.has_user_input
    ? {
        ...state.values,
        [String(role.id)]: state.values[String(role.id)] ?? "",
      }
    : state.values;

  if (role.pop) {
    return { selectedIds, values, openModal: role };
  }

  return { selectedIds, values, openModal: null };
}

export function buildStep6TenantPayload(
  selectedIds: number[],
  values: Record<string, string>,
  roles: TenantRole[] = [],
) {
  const byId = Object.fromEntries(roles.map((role) => [role.id, role]));
  const tenant_role_values: Record<string, string> = {};

  for (const id of selectedIds) {
    const key = String(id);
    const role = byId[id];

    if (role) {
      if (role.has_user_input) {
        tenant_role_values[key] = values[key] ?? "";
      }
      continue;
    }

    if (key in values) {
      tenant_role_values[key] = values[key] ?? "";
    }
  }

  return {
    tenant_roles: selectedIds.length > 0,
    tenant_role_ids: selectedIds,
    tenant_role_values,
  };
}

export function areTenantRoleValuesComplete(
  selectedIds: number[],
  values: Record<string, string>,
) {
  return selectedIds.every((id) => {
    const key = String(id);
    if (!(key in values)) {
      return true;
    }

    const raw = values[key]?.trim() ?? "";
    if (!raw) {
      return false;
    }

    if (/^\d+(\.\d+)?$/.test(raw)) {
      return Number(raw) > 0;
    }

    return true;
  });
}

export function normalizeTenantRole(raw: Partial<TenantRole> & { id: number }): TenantRole {
  const inputType = raw.input_field_type;
  const normalizedType =
    inputType === "text" || inputType === "number" ? inputType : null;

  return {
    id: raw.id,
    text_of_reason: raw.text_of_reason ?? raw.name ?? "",
    name: raw.name ?? raw.text_of_reason ?? "",
    service_definition: raw.service_definition ?? null,
    input_field_label: raw.input_field_label ?? null,
    input_field_type: normalizedType,
    has_user_input: Boolean(raw.has_user_input),
    icon: raw.icon ?? null,
    input_icon: raw.input_icon ?? null,
    pop: Boolean(raw.pop),
  };
}
