"use client";

import { Building2, CalendarDays, Hash, Layers3 } from "lucide-react";

import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import CreatePropertyFormSelect from "@/features/create-property/components/create-property-form-select";
import CreatePropertyIconInputField from "@/features/create-property/components/create-property-icon-input-field";
import {
  usePropertyTypeOptions,
  usePropertyUsageOptions,
} from "@/features/create-property/hooks/use-property-lookup-options";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyDetailsState } from "@/features/create-property/types/property-details";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import {
  propertyDeedTypeIsAdversePossession,
  type PropertyDeedTypeId,
} from "@/features/create-property/types/deed-type";

type CreatePropertyDetailsFieldsProps = {
  labels: CreatePropertyLabels["deed"]["propertyDetails"];
  contractType: PropertyContractType;
  selectedDeedType: PropertyDeedTypeId | "";
  value: PropertyDetailsState;
  onChange: (value: PropertyDetailsState) => void;
  showFieldErrors?: boolean;
};

export default function CreatePropertyDetailsFields({
  labels,
  contractType,
  selectedDeedType,
  value,
  onChange,
  showFieldErrors = false,
}: CreatePropertyDetailsFieldsProps) {
  const typesQuery = usePropertyTypeOptions(contractType);
  const usagesQuery = usePropertyUsageOptions(contractType);
  const showStrongArgument = propertyDeedTypeIsAdversePossession(selectedDeedType);

  const typeOptions = (typesQuery.data ?? []).map((item) => ({
    value: String(item.id),
    label: item.name,
  }));
  const usageOptions = (usagesQuery.data ?? []).map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const ownershipOptions = [
    { value: "owner", label: labels.ownership.owner },
    { value: "tenant", label: labels.ownership.tenant },
  ];

  function updateField<K extends keyof PropertyDetailsState>(
    field: K,
    fieldValue: PropertyDetailsState[K],
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <div className="space-y-3 rounded-[24px] border border-[#ececec] bg-[#fbfdfc] p-3 md:p-4 dark:border-[#2f403b] dark:bg-[#121a18]">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[#333333] dark:text-white">
          {labels.title}
        </h3>
        <p className="text-xs text-[#9a9a9a]">{labels.subtitle}</p>
      </div>

      <CreatePropertyFormSelect
        label={labels.propertyType.label}
        placeholder={
          typesQuery.isLoading
            ? labels.propertyType.loading
            : labels.propertyType.placeholder
        }
        value={value.propertyTypeId === "" ? "" : String(value.propertyTypeId)}
        onChange={(next) =>
          updateField("propertyTypeId", next ? Number(next) : "")
        }
        options={typeOptions}
        invalid={showFieldErrors && value.propertyTypeId === ""}
      />

      <CreatePropertyFormSelect
        label={labels.propertyUsage.label}
        placeholder={
          usagesQuery.isLoading
            ? labels.propertyUsage.loading
            : labels.propertyUsage.placeholder
        }
        value={
          value.propertyUsagesId === "" ? "" : String(value.propertyUsagesId)
        }
        onChange={(next) =>
          updateField("propertyUsagesId", next ? Number(next) : "")
        }
        options={usageOptions}
        invalid={showFieldErrors && value.propertyUsagesId === ""}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <CreatePropertyIconInputField
          label={labels.numberOfFloors.label}
          placeholder={labels.numberOfFloors.placeholder}
          value={value.numberOfFloors}
          onChange={(next) =>
            updateField("numberOfFloors", next.replace(/\D/g, ""))
          }
          icon={Layers3}
          inputMode="numeric"
          invalid={showFieldErrors && value.numberOfFloors.trim() === ""}
        />
        <CreatePropertyIconInputField
          label={labels.numberOfUnits.label}
          placeholder={labels.numberOfUnits.placeholder}
          value={value.numberOfUnitsInRealEstate}
          onChange={(next) => updateField("numberOfUnitsInRealEstate", next)}
          icon={Building2}
          invalid={
            showFieldErrors && value.numberOfUnitsInRealEstate.trim() === ""
          }
        />
        <CreatePropertyIconInputField
          label={labels.unitsPerFloor.label}
          placeholder={labels.unitsPerFloor.placeholder}
          value={value.numberOfUnitsPerFloor}
          onChange={(next) =>
            updateField("numberOfUnitsPerFloor", next.replace(/\D/g, ""))
          }
          icon={Hash}
          inputMode="numeric"
          invalid={showFieldErrors && value.numberOfUnitsPerFloor.trim() === ""}
        />
        <CreatePropertyIconInputField
          label={labels.propertyAge.label}
          placeholder={labels.propertyAge.placeholder}
          value={value.ageOfTheProperty}
          onChange={(next) =>
            updateField("ageOfTheProperty", next.replace(/\D/g, ""))
          }
          icon={CalendarDays}
          inputMode="numeric"
          invalid={showFieldErrors && value.ageOfTheProperty.trim() === ""}
        />
      </div>

      <CreatePropertyFormSelect
        label={labels.electricityOwnership.label}
        placeholder={labels.electricityOwnership.placeholder}
        value={value.electricityMeterOwnership}
        onChange={(next) =>
          updateField(
            "electricityMeterOwnership",
            next === "owner" || next === "tenant" ? next : "",
          )
        }
        options={ownershipOptions}
        invalid={showFieldErrors && value.electricityMeterOwnership === ""}
      />

      <CreatePropertyFormSelect
        label={labels.waterOwnership.label}
        placeholder={labels.waterOwnership.placeholder}
        value={value.waterMeterOwnership}
        onChange={(next) =>
          updateField(
            "waterMeterOwnership",
            next === "owner" || next === "tenant" ? next : "",
          )
        }
        options={ownershipOptions}
        invalid={showFieldErrors && value.waterMeterOwnership === ""}
      />

      {showStrongArgument ? (
        <div className="space-y-3 border-t border-dashed border-[#d9d9d9] pt-3">
          <CreatePropertyIconInputField
            label={labels.registryNumber.label}
            placeholder={labels.registryNumber.placeholder}
            value={value.realEstateRegistryNumber}
            onChange={(next) => updateField("realEstateRegistryNumber", next)}
            icon={Hash}
            invalid={
              showFieldErrors && value.realEstateRegistryNumber.trim() === ""
            }
          />

          <CreatePropertyFieldLabel label={labels.registryDate.label} />
          <div className="grid grid-cols-3 gap-2">
            <CreatePropertyIconInputField
              label={labels.registryDate.day}
              placeholder={labels.registryDate.dayPlaceholder}
              value={value.dateFirstRegistrationDay}
              onChange={(next) =>
                updateField(
                  "dateFirstRegistrationDay",
                  next.replace(/\D/g, "").slice(0, 2),
                )
              }
              icon={CalendarDays}
              inputMode="numeric"
              invalid={
                showFieldErrors &&
                value.dateFirstRegistrationDay.replace(/\D/g, "") === ""
              }
            />
            <CreatePropertyIconInputField
              label={labels.registryDate.month}
              placeholder={labels.registryDate.monthPlaceholder}
              value={value.dateFirstRegistrationMonth}
              onChange={(next) =>
                updateField(
                  "dateFirstRegistrationMonth",
                  next.replace(/\D/g, "").slice(0, 2),
                )
              }
              icon={CalendarDays}
              inputMode="numeric"
              invalid={
                showFieldErrors &&
                value.dateFirstRegistrationMonth.replace(/\D/g, "") === ""
              }
            />
            <CreatePropertyIconInputField
              label={labels.registryDate.year}
              placeholder={labels.registryDate.yearPlaceholder}
              value={value.dateFirstRegistrationYear}
              onChange={(next) =>
                updateField(
                  "dateFirstRegistrationYear",
                  next.replace(/\D/g, "").slice(0, 4),
                )
              }
              icon={CalendarDays}
              inputMode="numeric"
              invalid={
                showFieldErrors &&
                value.dateFirstRegistrationYear.replace(/\D/g, "") === ""
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
