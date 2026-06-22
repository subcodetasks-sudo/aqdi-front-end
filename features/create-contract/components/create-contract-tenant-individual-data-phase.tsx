"use client";

import { IdCard, Phone } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { IndividualTenantData } from "@/features/create-contract/types/tenant-step";

type CreateContractTenantIndividualDataPhaseProps = {
  labels: CreateContractLabels["tenant"]["individualData"];
  birthDateLabels: CreateContractLabels["tenant"]["birthDate"];
  value: IndividualTenantData;
  onChange: (value: IndividualTenantData) => void;
};

export default function CreateContractTenantIndividualDataPhase({
  labels,
  birthDateLabels,
  value,
  onChange,
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
      />

      <CreateContractBirthDateFields
        labels={birthDateLabels}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
      />

      <CreateContractIconInputField
        label={labels.phone.label}
        placeholder={labels.phone.placeholder}
        value={value.phone}
        onChange={(phone) =>
          updateField("phone", phone.replace(/\D/g, "").slice(0, 10))
        }
        icon={Phone}
        type="tel"
        dir="ltr"
        inputMode="tel"
        maxLength={10}
      />
    </div>
  );
}
