"use client";

import CreateUnitWizard from "@/features/create-unit/components/create-unit-wizard";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type CreateUnitPageContentProps = {
  labels: CreateUnitLabels;
  propertyId: number | null;
  contractType: PropertyContractType;
  contractTypeLocked: boolean;
  hasExistingUnits: boolean;
  initialUnits: UnitDataState[] | null;
};

export default function CreateUnitPageContent({
  labels,
  propertyId,
  contractType,
  contractTypeLocked,
  hasExistingUnits,
  initialUnits,
}: CreateUnitPageContentProps) {
  const pageTitle = hasExistingUnits ? labels.editPageTitle : labels.pageTitle;

  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        pageTitle={pageTitle}
        useRouterBack
      />

      <div className="mx-auto max-w-2xl">
        <CreateUnitWizard
          labels={labels}
          propertyId={propertyId}
          contractType={contractType}
          contractTypeLocked={contractTypeLocked}
          hasExistingUnits={hasExistingUnits}
          initialUnits={initialUnits}
        />
      </div>
    </>
  );
}
