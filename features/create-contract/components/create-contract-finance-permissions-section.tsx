"use client";

import { Checkbox } from "@/components/ui/checkbox";
import CreateContractFinanceAccordion from "@/features/create-contract/components/create-contract-finance-accordion";
import { useTenantRoles } from "@/features/create-contract/hooks/use-tenant-roles";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractFinancePermissionsSectionProps = {
  labels: CreateContractLabels["finance"]["tenantPermissions"];
  value: number[];
  onChange: (roleIds: number[]) => void;
};

export default function CreateContractFinancePermissionsSection({
  labels,
  value,
  onChange,
}: CreateContractFinancePermissionsSectionProps) {
  const { data: tenantRoles = [], isLoading, error } = useTenantRoles();

  function toggleRole(roleId: number, checked: boolean) {
    onChange(
      checked
        ? [...value, roleId]
        : value.filter((id) => id !== roleId),
    );
  }

  return (
    <CreateContractFinanceAccordion
      title={labels.title}
      subtitle={labels.subtitle}
      defaultOpen={value.length > 0}
    >
      <p className="text-xs leading-5 text-[#9a9a9a]">{labels.instruction}</p>

      {error ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : labels.optionsError}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-12 animate-pulse rounded-2xl bg-brand-background" />
          <div className="h-12 animate-pulse rounded-2xl bg-brand-background" />
        </div>
      ) : (
        <div className="space-y-2">
          {tenantRoles.map((role) => {
            const checked = value.includes(role.id);

            return (
              <label
                key={role.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(nextValue) =>
                    toggleRole(role.id, nextValue === true)
                  }
                  className="size-5 rounded-full border-brand-secondary data-checked:border-brand-secondary data-checked:bg-brand-secondary"
                />
                <span className="flex-1 text-sm font-semibold text-brand">
                  {role.text_of_reason}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </CreateContractFinanceAccordion>
  );
}
