"use client";

import { FilePenLine, IdCard, Phone } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import CreateContractSaudiMobileField from "@/features/create-contract/components/create-contract-saudi-mobile-field";
import CreateContractTenantDelegationTypeSelect from "@/features/create-contract/components/create-contract-tenant-delegation-type-select";
import CreateContractUnifiedRecordNumberField from "@/features/create-contract/components/create-contract-unified-record-number-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { OrganizationTenantData } from "@/features/create-contract/types/tenant-step";
import { toSaudiMobileInputValue } from "@/lib/validation/format-saudi-mobile-for-form";

type CreateContractTenantOrganizationDataPhaseProps = {
  labels: CreateContractLabels["tenant"]["organizationData"];
  birthDateLabels: CreateContractLabels["tenant"]["birthDate"];
  value: OrganizationTenantData;
  onChange: (value: OrganizationTenantData) => void;
};

export default function CreateContractTenantOrganizationDataPhase({
  labels,
  birthDateLabels,
  value,
  onChange,
}: CreateContractTenantOrganizationDataPhaseProps) {
  function updateField<K extends keyof OrganizationTenantData>(
    field: K,
    fieldValue: OrganizationTenantData[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  function updateDelegationType(
    delegationType: OrganizationTenantData["delegationType"],
  ) {
    onChange({
      ...value,
      delegationType,
      powerOfAttorneyFiles:
        delegationType === "agent-authorized"
          ? value.powerOfAttorneyFiles
          : [],
    });
  }

  return (
    <div className="mt-5 space-y-5">
      <CreateContractTenantDelegationTypeSelect
        labels={labels.delegationType}
        value={value.delegationType}
        onChange={updateDelegationType}
      />

      {value.delegationType ? (
        <>
          <CreateContractUnifiedRecordNumberField
            label={labels.unifiedRecordNumber.label}
            placeholder={labels.unifiedRecordNumber.placeholder}
            value={value.unifiedRecordNumber}
            onChange={(unifiedRecordNumber) =>
              updateField("unifiedRecordNumber", unifiedRecordNumber)
            }
            icon={FilePenLine}
          />

          <CreateContractIconInputField
            label={labels.ownerIdNumber.label}
            placeholder={labels.ownerIdNumber.placeholder}
            value={value.ownerIdNumber}
            onChange={(ownerIdNumber) =>
              updateField(
                "ownerIdNumber",
                ownerIdNumber.replace(/\D/g, "").slice(0, 10),
              )
            }
            icon={IdCard}
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
          />

          <CreateContractBirthDateFields
            labels={{
              ...birthDateLabels,
              label: labels.ownerBirthDateLabel,
            }}
            value={value.ownerBirthDate}
            onChange={(ownerBirthDate) =>
              updateField("ownerBirthDate", ownerBirthDate)
            }
          />

          <CreateContractSaudiMobileField
            label={labels.ownerPhone.label}
            placeholder={labels.ownerPhone.placeholder}
            value={value.ownerPhone}
            onChange={(ownerPhone) =>
              updateField("ownerPhone", toSaudiMobileInputValue(ownerPhone))
            }
            icon={Phone}
          />

          {value.delegationType === "agent-authorized" ? (
            <CreateContractDeedImageUpload
              labels={labels.powerOfAttorney}
              value={value.powerOfAttorneyFiles}
              onChange={(powerOfAttorneyFiles) =>
                updateField("powerOfAttorneyFiles", powerOfAttorneyFiles)
              }
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
