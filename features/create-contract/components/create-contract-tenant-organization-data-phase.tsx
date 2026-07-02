"use client";

import { FilePenLine, IdCard, Phone } from "lucide-react";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractDeedImageUpload from "@/features/create-contract/components/create-contract-deed-image-upload";
import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import CreateContractTenantDelegationTypeSelect from "@/features/create-contract/components/create-contract-tenant-delegation-type-select";
import {
  useCityOptions,
  useRegionOptions,
} from "@/features/create-contract/hooks/use-location-lookup-options";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { OrganizationTenantData } from "@/features/create-contract/types/tenant-step";

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
  const { data: regions = [], isLoading: isRegionsLoading } = useRegionOptions();
  const { data: cities = [], isLoading: isCitiesLoading } = useCityOptions(
    value.regionId,
  );

  const regionOptions = regions.map((region) => ({
    value: String(region.id),
    label: region.name,
  }));
  const cityOptions = cities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }));

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
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <CreateContractFormSelect
              label={labels.region.label}
              placeholder={
                isRegionsLoading ? labels.region.loading : labels.region.placeholder
              }
              options={regionOptions}
              value={value.regionId === "" ? "" : String(value.regionId)}
              onChange={(regionId) => {
                onChange({
                  ...value,
                  regionId: regionId ? Number(regionId) : "",
                  cityId: "",
                });
              }}
            />

            <CreateContractFormSelect
              label={labels.city.label}
              placeholder={
                value.regionId === ""
                  ? labels.city.selectRegionFirst
                  : isCitiesLoading
                    ? labels.city.loading
                    : labels.city.placeholder
              }
              options={cityOptions}
              value={value.cityId === "" ? "" : String(value.cityId)}
              onChange={(cityId) =>
                updateField("cityId", cityId ? Number(cityId) : "")
              }
            />
          </div>

          <CreateContractIconInputField
            label={labels.unifiedRecordNumber.label}
            placeholder={labels.unifiedRecordNumber.placeholder}
            value={value.unifiedRecordNumber}
            onChange={(unifiedRecordNumber) =>
              updateField(
                "unifiedRecordNumber",
                unifiedRecordNumber.replace(/\D/g, "").slice(0, 10),
              )
            }
            icon={FilePenLine}
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
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

          <CreateContractIconInputField
            label={labels.ownerPhone.label}
            placeholder={labels.ownerPhone.placeholder}
            value={value.ownerPhone}
            onChange={(ownerPhone) =>
              updateField(
                "ownerPhone",
                ownerPhone.replace(/\D/g, "").slice(0, 10),
              )
            }
            icon={Phone}
            type="tel"
            dir="ltr"
            inputMode="tel"
            maxLength={10}
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
