"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { TenantRole } from "@/features/create-contract/types/tenant-role";
import {
  getTenantRoleTitle,
  isDailyFineRole,
  isSecurityDepositRole,
  resolveTenantRoleIcon,
} from "@/features/create-contract/utils/tenant-role-helpers";
import {
  fieldChromeIconClass,
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractTenantRoleDialogProps = {
  labels: CreateContractLabels["finance"]["tenantPermissions"];
  role: TenantRole | null;
  open: boolean;
  value: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: string) => void;
};

function formatAmount(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return Number(digits).toLocaleString("en-US");
}

export default function CreateContractTenantRoleDialog({
  labels,
  role,
  open,
  value,
  onOpenChange,
  onConfirm,
}: CreateContractTenantRoleDialogProps) {
  const inputId = useId();
  const [draft, setDraft] = useState(value);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(value);
      setShowError(false);
    }
  }, [open, value]);

  if (!role) {
    return null;
  }

  const title = getTenantRoleTitle(role);
  const requiresInput = role.has_user_input;
  const isNumber = role.input_field_type === "number";
  const InputIcon = resolveTenantRoleIcon(role.input_icon ?? role.icon);
  const currencySuffix = isNumber
    ? isDailyFineRole(role)
      ? labels.currencyPerDay
      : labels.currency
    : null;
  const showDepositNote = isSecurityDepositRole(role);
  const definition = role.service_definition?.trim() ?? "";
  const inputLabel =
    role.input_field_label?.trim() || labels.inputFallbackLabel;
  const trimmed = draft.trim();
  const isValidInput =
    !requiresInput ||
    (trimmed !== "" &&
      (!isNumber || (/^\d+$/.test(trimmed.replace(/\D/g, "")) && Number(trimmed.replace(/\D/g, "")) > 0)));

  function handleConfirm() {
    if (requiresInput) {
      const digits = isNumber ? draft.replace(/\D/g, "") : draft.trim();
      if (!digits || (isNumber && Number(digits) <= 0)) {
        setShowError(true);
        return;
      }
      onConfirm(isNumber ? digits : digits);
      return;
    }

    onConfirm("");
  }

  const chrome = resolveFieldChromeState({
    invalid: showError,
    valid: requiresInput && isValidInput && trimmed !== "",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl p-5 sm:max-w-md sm:p-6"
      >
        <div className="relative flex items-center justify-center pb-2">
          <DialogTitle className="text-center text-base font-extrabold text-[#222222]">
            {title}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute start-0 size-8 rounded-full bg-[#f0f0f0] text-[#666666] hover:bg-[#e8e8e8] hover:text-[#444444]"
              aria-label={labels.close}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-2 flex justify-center">
          <Image
            src="/images/logo.png"
            alt=""
            width={36}
            height={28}
            className="h-7 w-auto object-contain"
          />
        </div>

        {definition ? (
          <div className="mt-5 space-y-2">
            <p className="text-sm font-extrabold text-brand">
              {labels.serviceDefinitionLabel}
            </p>
            <div className="rounded-2xl bg-brand-background px-3.5 py-3">
              <p className="whitespace-pre-line text-sm leading-7 text-[#555555]">
                {definition}
              </p>
            </div>
          </div>
        ) : null}

        {showDepositNote ? (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-[#f0d9a8] bg-[#fff8eb] px-3.5 py-3">
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-[#e39b2d]"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-[#555555]">
              {labels.depositNote}
            </p>
          </div>
        ) : null}

        {requiresInput ? (
          <div className="mt-4">
            <div
              className={cn(
                "flex h-14 w-full items-center gap-2 rounded-2xl border px-3",
                fieldChromeSurfaceClass(chrome, {
                  defaultBgClassName: "bg-white",
                }),
              )}
            >
              <span
                className={cn(
                  "inline-flex size-9 shrink-0 items-center justify-center",
                  fieldChromeIconClass(chrome),
                )}
              >
                <InputIcon className="size-5" aria-hidden="true" />
              </span>

              <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

              <Input
                id={inputId}
                type="text"
                inputMode={isNumber ? "numeric" : "text"}
                value={isNumber ? formatAmount(draft) : draft}
                onChange={(event) => {
                  setShowError(false);
                  setDraft(
                    isNumber
                      ? event.target.value.replace(/\D/g, "")
                      : event.target.value,
                  );
                }}
                placeholder={inputLabel}
                aria-invalid={showError}
                className="h-auto flex-1 border-0 bg-transparent px-1 text-center text-sm font-semibold shadow-none focus-visible:ring-0"
              />

              {currencySuffix ? (
                <>
                  <span
                    className="h-6 w-px shrink-0 bg-[#dcdcdc]"
                    aria-hidden="true"
                  />
                  <span className="shrink-0 text-sm font-bold text-brand">
                    {currencySuffix}
                  </span>
                </>
              ) : null}
            </div>

            {showError ? (
              <p className="mt-1.5 text-xs font-medium text-[#c62828]">
                {labels.inputRequired}
              </p>
            ) : null}
          </div>
        ) : null}

        <Button
          type="button"
          onClick={handleConfirm}
          className="mt-5 h-12 w-full rounded-2xl bg-brand text-base font-extrabold text-white hover:bg-brand/90"
        >
          {`${labels.confirmPrefix} ${title}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
