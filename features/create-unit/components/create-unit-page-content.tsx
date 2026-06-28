"use client";

import CreateUnitHeader from "@/features/create-unit/components/create-unit-header";
import CreateUnitWizard from "@/features/create-unit/components/create-unit-wizard";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type CreateUnitPageContentProps = {
  labels: CreateUnitLabels;
  propertyId: number | null;
  contractType: PropertyContractType;
};

export default function CreateUnitPageContent({
  labels,
  propertyId,
  contractType,
}: CreateUnitPageContentProps) {
  return (
    <section className="space-y-8">
      <section className="container pt-8 lg:pt-12">
        <CreateUnitHeader
          backLabel={labels.backLabel}
          pageTitle={labels.pageTitle}
        />
      </section>

      <section className="container mx-auto pb-8 lg:max-w-2xl lg:pb-12">
        <CreateUnitWizard
          labels={labels}
          propertyId={propertyId}
          contractType={contractType}
        />
      </section>
    </section>
  );
}
