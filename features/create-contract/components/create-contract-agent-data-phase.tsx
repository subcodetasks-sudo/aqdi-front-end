"use client";

import { IdCard, Phone } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { AgentDataState } from "@/features/create-contract/types/owner-step";

type CreateContractAgentDataPhaseProps = {
  labels: CreateContractLabels["owner"]["agentData"];
  birthDateLabels: CreateContractLabels["owner"]["birthDate"];
  value: AgentDataState;
  onChange: (value: AgentDataState) => void;
};

export default function CreateContractAgentDataPhase({
  labels,
  birthDateLabels,
  value,
  onChange,
}: CreateContractAgentDataPhaseProps) {
  function updateField<K extends keyof AgentDataState>(
    field: K,
    fieldValue: AgentDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

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
      />

      <CreateContractBirthDateFields
        labels={{
          ...birthDateLabels,
          label: labels.birthDateLabel,
        }}
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

      <CreateContractDeedImageUpload
        labels={labels.powerOfAttorney}
        value={value.powerOfAttorneyFiles}
        onChange={(powerOfAttorneyFiles) =>
          updateField("powerOfAttorneyFiles", powerOfAttorneyFiles)
        }
      />
    </div>
  );
}
