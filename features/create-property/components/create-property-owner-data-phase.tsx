"use client";

import { IdCard, Phone } from "lucide-react";

import CreatePropertyBirthDateFields from "@/features/create-property/components/create-property-birth-date-fields";
import CreatePropertyFormSelect from "@/features/create-property/components/create-property-form-select";
import CreatePropertyIconInputField from "@/features/create-property/components/create-property-icon-input-field";
import CreatePropertySaudiMobileField from "@/features/create-property/components/create-property-saudi-mobile-field";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import {
  PROPERTY_HAS_AGENT_OPTIONS,
  type PropertyOwnerDataState,
} from "@/features/create-property/types/owner-step";
import {
  getIdNumberFieldError,
  getPhoneFieldError,
  isPhoneComplete,
} from "@/lib/validation/owner-step-validation";
import { isAdultBirthDateComplete } from "@/lib/validation/birth-date-year-options";
import { toSaudiMobileInputValue } from "@/lib/validation/format-saudi-mobile-for-form";

type CreatePropertyOwnerDataPhaseProps = {
  labels: CreatePropertyLabels["owner"]["ownerData"];
  birthDateLabels: CreatePropertyLabels["owner"]["birthDate"];
  validationLabels: CreatePropertyLabels["owner"]["validation"]["fieldErrors"];
  value: PropertyOwnerDataState;
  onChange: (value: PropertyOwnerDataState) => void;
  showFieldErrors?: boolean;
};

function isIdNumberComplete(idNumber: string) {
  return idNumber.replace(/\D/g, "").length === 10;
}

export default function CreatePropertyOwnerDataPhase({
  labels,
  birthDateLabels,
  validationLabels,
  value,
  onChange,
  showFieldErrors = false,
}: CreatePropertyOwnerDataPhaseProps) {
  function updateField<K extends keyof PropertyOwnerDataState>(
    field: K,
    fieldValue: PropertyOwnerDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  const hasAgentOptions = PROPERTY_HAS_AGENT_OPTIONS.map((option) => ({
    value: option,
    label: labels.hasAgent.options[option],
  }));

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
  const hasAgentInvalid = showFieldErrors && value.hasAgent === "";
  const idValid = !idInvalid && isIdNumberComplete(value.idNumber);
  const phoneValid = !phoneInvalid && isPhoneComplete(value.phone);
  const hasAgentValid = !hasAgentInvalid && value.hasAgent !== "";

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
        labels={birthDateLabels}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
        invalid={birthDateInvalid}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <CreatePropertySaudiMobileField
          label={labels.phone.label}
          placeholder={labels.phone.placeholder}
          value={value.phone}
          onChange={(phone) =>
            updateField("phone", toSaudiMobileInputValue(phone))
          }
          icon={Phone}
          errorMessage={phoneError}
          invalid={phoneInvalid}
          valid={phoneValid}
        />

        <CreatePropertyFormSelect
          label={labels.hasAgent.label}
          placeholder={labels.hasAgent.placeholder}
          options={hasAgentOptions}
          value={value.hasAgent}
          onChange={(hasAgent) =>
            updateField(
              "hasAgent",
              hasAgent as PropertyOwnerDataState["hasAgent"],
            )
          }
          invalid={hasAgentInvalid}
          valid={hasAgentValid}
        />
      </div>
    </div>
  );
}
