"use client";

import { Info, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTenantRoles } from "@/features/create-contract/hooks/use-tenant-roles";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type CreateContractTenantPermissionsDialogProps = {
  labels: CreateContractLabels["finance"]["tenantPermissionsDialog"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: number[];
  onSave: (value: number[]) => void;
};

type CreateContractFinancePermissionOptionProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function CreateContractFinancePermissionOption({
  label,
  checked,
  onCheckedChange,
}: CreateContractFinancePermissionOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <Checkbox
        checked={checked}
        onCheckedChange={(nextValue) => onCheckedChange(nextValue === true)}
        className="size-5 rounded-full border-brand-secondary data-checked:border-brand-secondary data-checked:bg-brand-secondary"
      />
      <span className="flex flex-1 items-center gap-1.5 text-end text-sm font-semibold text-brand">
        {label}
        <Info className="size-4 shrink-0 text-[#bdbdbd]" aria-hidden="true" />
      </span>
    </label>
  );
}

export default function CreateContractTenantPermissionsDialog({
  labels,
  open,
  onOpenChange,
  value,
  onSave,
}: CreateContractTenantPermissionsDialogProps) {
  const { data: tenantRoles = [], isLoading, error } = useTenantRoles();
  const [draft, setDraft] = useState<number[]>(value);

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  function toggleRole(roleId: number, checked: boolean) {
    setDraft((current) =>
      checked
        ? [...current, roleId]
        : current.filter((id) => id !== roleId),
    );
  }

  function handleContinue() {
    onSave(draft);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-[50px] p-12 sm:min-w-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4">
          <DialogTitle className="text-base font-bold leading-snug text-[#333333]">
            {labels.title}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-[#999999] hover:bg-brand-background hover:text-[#666666]"
              aria-label={labels.close}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-secondary shadow-lg shadow-brand-secondary/40">
            <UserPlus className="size-8 text-white" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-xl font-extrabold leading-relaxed text-brand md:text-2xl">
              {labels.heading}
            </p>
            <p className="text-sm text-[#7f7f7f]">{labels.subtitle}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {error ? (
            <p className="text-sm text-red-500">
              {error instanceof Error ? error.message : labels.optionsError}
            </p>
          ) : null}

          {isLoading ? (
            <div className="space-y-3 py-2">
              <div className="h-10 animate-pulse rounded-full bg-brand-background" />
              <div className="h-10 animate-pulse rounded-full bg-brand-background" />
            </div>
          ) : (
            tenantRoles.map((role) => (
              <CreateContractFinancePermissionOption
                key={role.id}
                label={role.text_of_reason}
                checked={draft.includes(role.id)}
                onCheckedChange={(checked) => toggleRole(role.id, checked)}
              />
            ))
          )}
        </div>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={isLoading || Boolean(error)}
          className={cn(
            "mt-8 h-12 w-full rounded-xl text-base font-extrabold",
            "bg-linear-to-br from-brand-secondary via-brand to-brand text-white hover:opacity-90",
          )}
        >
          <CustomIcon src="/icons/arrow-r.svg" size={24} />
          {labels.continue}
          <CustomIcon src="/icons/arrow-l.svg" size={24} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
