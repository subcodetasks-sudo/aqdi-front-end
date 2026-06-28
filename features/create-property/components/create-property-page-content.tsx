"use client";

import CreatePropertyHeader from "@/features/create-property/components/create-property-header";
import CreatePropertyWizard from "@/features/create-property/components/create-property-wizard";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyTypeId } from "@/features/properties/types/property-type";

type CreatePropertyPageContentProps = {
  labels: CreatePropertyLabels;
  propertyType: PropertyTypeId;
};

export default function CreatePropertyPageContent({
  labels,
  propertyType,
}: CreatePropertyPageContentProps) {
  const pageTitle =
    propertyType === "residential"
      ? labels.pageTitleResidential
      : labels.pageTitleCommercial;

  return (
    <section className="space-y-8">
      <section className="container pt-8 lg:pt-12">
        <CreatePropertyHeader backLabel={labels.backLabel} pageTitle={pageTitle} />
      </section>

      <section className="container mx-auto pb-8 lg:max-w-2xl lg:pb-12">
        <CreatePropertyWizard labels={labels} propertyType={propertyType} />
      </section>
    </section>
  );
}
