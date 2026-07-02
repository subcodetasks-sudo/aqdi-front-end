"use client";

import { CreditCard, IdCard, Phone, User } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import { HAS_AGENT_OPTIONS } from "@/features/create-contract/types/owner-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { OwnerDataState } from "@/features/create-contract/types/owner-step";
import { isPropertyOwnerIbanComplete } from "@/features/create-property/utils/property-owner-api";
import {
  getIdNumberFieldError,
  getPhoneFieldError,
} from "@/lib/validation/owner-step-validation";

type CreateContractOwnerDataPhaseProps = {
  labels: CreateContractLabels["owner"]["ownerData"];
  birthDateLabels: CreateContractLabels["owner"]["birthDate"];
  validationLabels: CreateContractLabels["owner"]["validation"]["fieldErrors"];
  value: OwnerDataState;
  onChange: (value: OwnerDataState) => void;
};

export default function CreateContractOwnerDataPhase({
  labels,
  birthDateLabels,
  validationLabels,
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

  const idNumberError = getIdNumberFieldError(value.idNumber, {
    required: validationLabels.idNumberLength,
    length: validationLabels.idNumberLength,
  });
  const phoneError = getPhoneFieldError(value.phone, {
    required: validationLabels.phoneLength,
    length: validationLabels.phoneLength,
  });
  const ibanValue = value.iban ?? "";
  const ibanError =
    ibanValue.trim() && !isPropertyOwnerIbanComplete(ibanValue)
      ? validationLabels.iban
      : undefined;

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
        errorMessage={idNumberError}
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
          errorMessage={phoneError}
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

      <CreateContractIconInputField
        label={labels.iban.label}
        placeholder={labels.iban.placeholder}
        value={ibanValue}
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
