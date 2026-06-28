"use client";

import { CreditCard, IdCard, Phone, User } from "lucide-react";

import CreatePropertyBirthDateFields from "@/features/create-property/components/create-property-birth-date-fields";
import CreatePropertyFormSelect from "@/features/create-property/components/create-property-form-select";
import CreatePropertyIconInputField from "@/features/create-property/components/create-property-icon-input-field";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import {
  PROPERTY_HAS_AGENT_OPTIONS,
  type PropertyOwnerDataState,
} from "@/features/create-property/types/owner-step";
import {
  getIdNumberFieldError,
  getPhoneFieldError,
} from "@/lib/validation/owner-step-validation";
import { isPropertyOwnerIbanComplete } from "@/features/create-property/utils/property-owner-api";

type CreatePropertyOwnerDataPhaseProps = {
  labels: CreatePropertyLabels["owner"]["ownerData"];
  birthDateLabels: CreatePropertyLabels["owner"]["birthDate"];
  validationLabels: CreatePropertyLabels["owner"]["validation"]["fieldErrors"];
  value: PropertyOwnerDataState;
  onChange: (value: PropertyOwnerDataState) => void;
};

export default function CreatePropertyOwnerDataPhase({
  labels,
  birthDateLabels,
  validationLabels,
  value,
  onChange,
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
  const ibanError =
    (value.iban ?? "").trim() && !isPropertyOwnerIbanComplete(value.iban)
      ? validationLabels.iban
      : undefined;

  return (
    <div className="space-y-5">
      <CreatePropertyIconInputField
        label={labels.fullName.label}
        placeholder={labels.fullName.placeholder}
        value={value.fullName}
        onChange={(fullName) => updateField("fullName", fullName)}
        icon={User}
      />

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
      />

      <CreatePropertyBirthDateFields
        labels={birthDateLabels}
        value={value.birthDate}
        onChange={(birthDate) => updateField("birthDate", birthDate)}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
          errorMessage={phoneError}
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
        />
      </div>

      <CreatePropertyIconInputField
        label={labels.iban.label}
        placeholder={labels.iban.placeholder}
        value={value.iban ?? ""}
        onChange={(iban) =>
          updateField("iban", iban.replace(/\s/g, "").toUpperCase().slice(0, 24))
        }
        icon={CreditCard}
        dir="ltr"
        maxLength={24}
        errorMessage={ibanError}
      />
    </div>
  );
}
