"use client";

import { IdCard, Phone } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import CreateContractSaudiMobileField from "@/features/create-contract/components/create-contract-saudi-mobile-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { OwnerDataState } from "@/features/create-contract/types/owner-step";
import {
  getIdNumberFieldError,
  getPhoneFieldError,
} from "@/lib/validation/owner-step-validation";
import { toSaudiMobileInputValue } from "@/lib/validation/format-saudi-mobile-for-form";

type CreateContractOwnerDataPhaseProps = {
  labels: CreateContractLabels["owner"]["ownerData"];
  birthDateLabels: CreateContractLabels["owner"]["birthDate"];
  validationLabels: CreateContractLabels["owner"]["validation"]["fieldErrors"];
  value: OwnerDataState;
  onChange: (value: OwnerDataState) => void;
};

export default function CreateContractOwnerDataPhase({
  labels,
  birthDateLabels,
  validationLabels,
  value,
  onChange,
}: CreateContractOwnerDataPhaseProps) {
  function updateField<K extends keyof OwnerDataState>(
    field: K,
    fieldValue: OwnerDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  const idNumberError = getIdNumberFieldError(value.idNumber, {
    required: validationLabels.idNumberLength,
    length: validationLabels.idNumberLength,
  });
  const phoneError = getPhoneFieldError(value.phone, {
    required: validationLabels.phoneLength,
    length: validationLabels.phoneLength,
  });
  const hasAgentChecked = value.hasAgent === "yes";

  return (
    <div className="space-y-5">
      <CreateContractIconInputField
        label={labels.idNumber.label}
        placeholder={labels.idNumber.placeholder}
        value={value.idNumber}
        onChange={(idNumber) =>
          updateField("idNumber", idNumber.replace(/\D/g, "").slice(0, 10))
        }
        icon={IdCard}
        dir="ltr"
        inputMode="numeric"
        maxLength={10}
        errorMessage={idNumberError}
      />

      <CreateContractBirthDateFields
        labels={birthDateLabels}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
      />

      <CreateContractSaudiMobileField
        label={labels.phone.label}
        placeholder={labels.phone.placeholder}
        value={value.phone}
        onChange={(phone) =>
          updateField("phone", toSaudiMobileInputValue(phone))
        }
        icon={Phone}
        errorMessage={phoneError}
      />

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-4">
        <span className="min-w-0 space-y-1 text-start">
          <span className="block text-sm font-bold text-brand">
            {labels.hasAgent.title}
          </span>
          <span className="block text-xs leading-5 text-[#9a9a9a]">
            {labels.hasAgent.description}
          </span>
        </span>
        <Switch
          dir="ltr"
          checked={hasAgentChecked}
          onCheckedChange={(checked) =>
            updateField("hasAgent", checked ? "yes" : "no")
          }
          className="h-6 w-11 shrink-0 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9]"
        />
      </label>
    </div>
  );
}
