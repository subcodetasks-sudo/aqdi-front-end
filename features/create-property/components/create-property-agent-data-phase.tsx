"use client";

import { IdCard, Phone } from "lucide-react";

import CreatePropertyBirthDateFields from "@/features/create-property/components/create-property-birth-date-fields";
import CreatePropertyDeedImageUpload from "@/features/create-property/components/create-property-deed-image-upload";
import CreatePropertyIconInputField from "@/features/create-property/components/create-property-icon-input-field";
import CreatePropertySaudiMobileField from "@/features/create-property/components/create-property-saudi-mobile-field";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyAgentDataState } from "@/features/create-property/types/owner-step";
import {
  getIdNumberFieldError,
  getPhoneFieldError,
  isPhoneComplete,
} from "@/lib/validation/owner-step-validation";
import { isAdultBirthDateComplete } from "@/lib/validation/birth-date-year-options";
import { toSaudiMobileInputValue } from "@/lib/validation/format-saudi-mobile-for-form";

type CreatePropertyAgentDataPhaseProps = {
  labels: CreatePropertyLabels["owner"]["agentData"];
  birthDateLabels: CreatePropertyLabels["owner"]["birthDate"];
  validationLabels: CreatePropertyLabels["owner"]["validation"]["fieldErrors"];
  value: PropertyAgentDataState;
  onChange: (value: PropertyAgentDataState) => void;
  showFieldErrors?: boolean;
  hasExistingPowerOfAttorney?: boolean;
};

function isIdNumberComplete(idNumber: string) {
  return idNumber.replace(/\D/g, "").length === 10;
}

export default function CreatePropertyAgentDataPhase({
  labels,
  birthDateLabels,
  validationLabels,
  value,
  onChange,
  showFieldErrors = false,
  hasExistingPowerOfAttorney = false,
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

  const idNumberError = getIdNumberFieldError(value.idNumber, {
    required: validationLabels.idNumberLength,
    length: validationLabels.idNumberLength,
  });
  const phoneError = getPhoneFieldError(value.phone, {
    required: validationLabels.phoneLength,
    length: validationLabels.phoneLength,
  });
  const idInvalid =
    Boolean(idNumberError) ||
    (showFieldErrors && !isIdNumberComplete(value.idNumber));
  const phoneInvalid =
    Boolean(phoneError) || (showFieldErrors && !isPhoneComplete(value.phone));
  const birthDateInvalid =
    showFieldErrors && !isAdultBirthDateComplete(value.birthDate);
  const powerOfAttorneyInvalid =
    showFieldErrors &&
    value.powerOfAttorneyFiles.length !== 1 &&
    !hasExistingPowerOfAttorney;
  const idValid = !idInvalid && isIdNumberComplete(value.idNumber);
  const phoneValid = !phoneInvalid && isPhoneComplete(value.phone);

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
        errorMessage={idNumberError}
        invalid={idInvalid}
        valid={idValid}
      />

      <CreatePropertyBirthDateFields
        labels={{
          ...birthDateLabels,
          label: labels.birthDateLabel,
        }}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
        invalid={birthDateInvalid}
      />

      <CreatePropertySaudiMobileField
        label={labels.phone.label}
        placeholder={labels.phone.placeholder}
        value={value.phone}
        onChange={(phone) => updateField("phone", toSaudiMobileInputValue(phone))}
        icon={Phone}
        errorMessage={phoneError}
        invalid={phoneInvalid}
        valid={phoneValid}
      />

      <CreatePropertyDeedImageUpload
        labels={labels.powerOfAttorney}
        value={value.powerOfAttorneyFiles}
        onChange={(powerOfAttorneyFiles) =>
          updateField("powerOfAttorneyFiles", powerOfAttorneyFiles)
        }
        invalid={powerOfAttorneyInvalid}
        variant="dropzone"
      />
    </div>
  );
}
