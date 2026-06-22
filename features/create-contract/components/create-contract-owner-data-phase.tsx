"use client";

import { IdCard, Phone, User } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import { HAS_AGENT_OPTIONS } from "@/features/create-contract/types/owner-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { OwnerDataState } from "@/features/create-contract/types/owner-step";

type CreateContractOwnerDataPhaseProps = {
  labels: CreateContractLabels["owner"]["ownerData"];
  birthDateLabels: CreateContractLabels["owner"]["birthDate"];
  value: OwnerDataState;
  onChange: (value: OwnerDataState) => void;
};

export default function CreateContractOwnerDataPhase({
  labels,
  birthDateLabels,
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

  const hasAgentOptions = HAS_AGENT_OPTIONS.map((option) => ({
    value: option,
    label: labels.hasAgent.options[option],
  }));

  return (
    <div className="space-y-5">
      <CreateContractIconInputField
        label={labels.fullName.label}
        placeholder={labels.fullName.placeholder}
        value={value.fullName}
        onChange={(fullName) => updateField("fullName", fullName)}
        icon={User}
      />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

        <CreateContractFormSelect
          label={labels.hasAgent.label}
          placeholder={labels.hasAgent.placeholder}
          options={hasAgentOptions}
          value={value.hasAgent}
          onChange={(hasAgent) =>
            updateField("hasAgent", hasAgent as OwnerDataState["hasAgent"])
          }
        />
      </div>
    </div>
  );
}
