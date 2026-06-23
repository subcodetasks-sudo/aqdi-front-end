"use client";

import { IdCard, Phone } from "lucide-react";

import CreatePropertyBirthDateFields from "@/features/create-property/components/create-property-birth-date-fields";
import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyIconInputField from "@/features/create-property/components/create-property-icon-input-field";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyAgentDataState } from "@/features/create-property/types/owner-step";

type CreatePropertyAgentDataPhaseProps = {
  labels: CreatePropertyLabels["owner"]["agentData"];
  birthDateLabels: CreatePropertyLabels["owner"]["birthDate"];
  value: PropertyAgentDataState;
  onChange: (value: PropertyAgentDataState) => void;
};

export default function CreatePropertyAgentDataPhase({
  labels,
  birthDateLabels,
  value,
  onChange,
}: CreatePropertyAgentDataPhaseProps) {
  function updateField<K extends keyof PropertyAgentDataState>(
    field: K,
    fieldValue: PropertyAgentDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="space-y-5">
      <CreatePropertyIconInputField
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

      <CreatePropertyBirthDateFields
        labels={{
          ...birthDateLabels,
          label: labels.birthDateLabel,
        }}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
      />

      <CreatePropertyIconInputField
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

      <CreatePropertyDeedImageUpload
        labels={labels.powerOfAttorney}
        value={value.powerOfAttorneyFiles}
        onChange={(powerOfAttorneyFiles) =>
          updateField("powerOfAttorneyFiles", powerOfAttorneyFiles)
        }
      />
    </div>
  );
}
