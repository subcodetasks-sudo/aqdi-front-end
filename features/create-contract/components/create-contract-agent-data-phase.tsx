"use client";

import { IdCard } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import CreateContractSaudiMobileField from "@/features/create-contract/components/create-contract-saudi-mobile-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { AgentDataState } from "@/features/create-contract/types/owner-step";
import {
  getIdNumberFieldError,
  getPhoneFieldError,
  isPhoneComplete,
} from "@/lib/validation/owner-step-validation";
import { isAdultBirthDateComplete } from "@/lib/validation/birth-date-year-options";
import { toSaudiMobileInputValue } from "@/lib/validation/format-saudi-mobile-for-form";
import { isSaudiNationalIdComplete } from "@/lib/validation/saudi-national-id";

type CreateContractAgentDataPhaseProps = {
  labels: {
    sectionTitle: string;
    sectionDescription: string;
    footerNote: string;
    idNumber: {
      label: string;
      placeholder: string;
    };
    birthDateLabel: string;
    phone: {
      label: string;
      placeholder: string;
    };
    powerOfAttorney: CreateContractLabels["owner"]["agentData"]["powerOfAttorney"];
  };
  birthDateLabels: CreateContractLabels["owner"]["birthDate"];
  validationLabels: {
    idNumberLength: string;
    phoneLength: string;
    iban?: string;
  };
  value: AgentDataState;
  onChange: (value: AgentDataState) => void;
  showFieldErrors?: boolean;
  /** When the step itself is titled for the agent (deceased-owner flow). */
  hideSectionHeader?: boolean;
  /** Step1/step2 already stored the POA — re-upload is optional. */
  existingPoaUrl?: string | null;
  /** When true, treat the document as already attached even without a URL/file. */
  documentAlreadyAttached?: boolean;
  /** Overrides the default footer note under the uploader. */
  documentHint?: string;
};

export default function CreateContractAgentDataPhase({
  labels,
  birthDateLabels,
  validationLabels,
  value,
  onChange,
  showFieldErrors = false,
  hideSectionHeader = false,
  existingPoaUrl = null,
  documentAlreadyAttached = false,
  documentHint,
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

  const idNumberError = getIdNumberFieldError(value.idNumber, {
    required: validationLabels.idNumberLength,
    length: validationLabels.idNumberLength,
  });
  const phoneError = getPhoneFieldError(value.phone, {
    required: validationLabels.phoneLength,
    length: validationLabels.phoneLength,
  });
  const idInvalid =
    Boolean(idNumberError) || (showFieldErrors && !isSaudiNationalIdComplete(value.idNumber));
  const phoneInvalid =
    Boolean(phoneError) || (showFieldErrors && !isPhoneComplete(value.phone));
  const birthDateInvalid = showFieldErrors && !isAdultBirthDateComplete(value.birthDate);
  const hasPoa =
    value.powerOfAttorneyFiles.length > 0 ||
    Boolean(existingPoaUrl) ||
    documentAlreadyAttached;
  const powerOfAttorneyInvalid = showFieldErrors && !hasPoa;
  const idValid = !idInvalid && isSaudiNationalIdComplete(value.idNumber);
  const phoneValid = !phoneInvalid && isPhoneComplete(value.phone);

  return (
    <div className="space-y-3">
      {!hideSectionHeader ? (
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-extrabold text-brand md:text-xl">
            {labels.sectionTitle}
          </h3>
          <p className="text-sm text-[#9a9a9a]">{labels.sectionDescription}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          invalid={idInvalid}
          valid={idValid}
        />

        <CreateContractSaudiMobileField
          label={labels.phone.label}
          placeholder={labels.phone.placeholder}
          value={value.phone}
          onChange={(phone) =>
            updateField("phone", toSaudiMobileInputValue(phone))
          }
          errorMessage={phoneError}
          invalid={phoneInvalid}
          valid={phoneValid}
        />
      </div>

      <CreateContractBirthDateFields
        labels={{
          ...birthDateLabels,
          label: labels.birthDateLabel,
        }}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
        invalid={birthDateInvalid}
      />

      <CreateContractDeedImageUpload
        labels={labels.powerOfAttorney}
        value={value.powerOfAttorneyFiles}
        onChange={(powerOfAttorneyFiles) =>
          updateField("powerOfAttorneyFiles", powerOfAttorneyFiles)
        }
        invalid={powerOfAttorneyInvalid}
        existingImageUrl={existingPoaUrl}
        alreadyAttached={documentAlreadyAttached}
        single
        variant="dashed"
        hint={documentHint}
      />

      {!documentHint ? (
        <p className="text-xs leading-6 text-[#9a9a9a]">{labels.footerNote}</p>
      ) : null}
    </div>
  );
}
