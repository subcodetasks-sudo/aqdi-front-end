"use client";

import { IdCard, Phone } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import CreateContractSaudiMobileField from "@/features/create-contract/components/create-contract-saudi-mobile-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { IndividualTenantData } from "@/features/create-contract/types/tenant-step";
import { isPhoneComplete } from "@/lib/validation/owner-step-validation";
import { isAdultBirthDateComplete } from "@/lib/validation/birth-date-year-options";
import { toSaudiMobileInputValue } from "@/lib/validation/format-saudi-mobile-for-form";

type CreateContractTenantIndividualDataPhaseProps = {
  labels: CreateContractLabels["tenant"]["individualData"];
  birthDateLabels: CreateContractLabels["tenant"]["birthDate"];
  value: IndividualTenantData;
  onChange: (value: IndividualTenantData) => void;
  showFieldErrors?: boolean;
};

function isIdNumberComplete(idNumber: string) {
  return idNumber.replace(/\D/g, "").length === 10;
}

export default function CreateContractTenantIndividualDataPhase({
  labels,
  birthDateLabels,
  value,
  onChange,
  showFieldErrors = false,
}: CreateContractTenantIndividualDataPhaseProps) {
  function updateField<K extends keyof IndividualTenantData>(
    field: K,
    fieldValue: IndividualTenantData[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="mt-5 space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          invalid={showFieldErrors && !isIdNumberComplete(value.idNumber)}
          valid={isIdNumberComplete(value.idNumber)}
        />

        <CreateContractSaudiMobileField
          label={labels.phone.label}
          placeholder={labels.phone.placeholder}
          value={value.phone}
          onChange={(phone) =>
            updateField("phone", toSaudiMobileInputValue(phone))
          }
          icon={Phone}
          invalid={showFieldErrors && !isPhoneComplete(value.phone)}
          valid={isPhoneComplete(value.phone)}
        />
      </div>

      <CreateContractBirthDateFields
        labels={birthDateLabels}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
        invalid={showFieldErrors && !isAdultBirthDateComplete(value.birthDate)}
      />
    </div>
  );
}
