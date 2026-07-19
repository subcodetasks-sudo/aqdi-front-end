"use client";

import { IdCard, Phone } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import CreateContractSaudiMobileField from "@/features/create-contract/components/create-contract-saudi-mobile-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { AgentDataState } from "@/features/create-contract/types/owner-step";
import { toSaudiMobileInputValue } from "@/lib/validation/format-saudi-mobile-for-form";

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
    <div className="space-y-5 border-t border-[#f0f0f0] pt-6">
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-extrabold text-brand">{labels.sectionTitle}</h3>
        <p className="text-sm text-[#9a9a9a]">{labels.sectionDescription}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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

        <CreateContractSaudiMobileField
          label={labels.phone.label}
          placeholder={labels.phone.placeholder}
          value={value.phone}
          onChange={(phone) =>
            updateField("phone", toSaudiMobileInputValue(phone))
          }
          icon={Phone}
        />
      </div>

      <CreateContractBirthDateFields
        labels={{
          ...birthDateLabels,
          label: labels.birthDateLabel,
        }}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
      />

      <CreateContractDeedImageUpload
        labels={labels.powerOfAttorney}
        value={value.powerOfAttorneyFiles}
        onChange={(powerOfAttorneyFiles) =>
          updateField("powerOfAttorneyFiles", powerOfAttorneyFiles)
        }
      />

      <p className="text-xs leading-6 text-[#9a9a9a]">{labels.footerNote}</p>
    </div>
  );
}
