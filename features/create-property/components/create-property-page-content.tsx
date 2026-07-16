"use client";

import CreatePropertyWizard from "@/features/create-property/components/create-property-wizard";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyTypeId } from "@/features/properties/types/property-type";
import type { PropertyEditDraftData } from "@/features/create-property/utils/map-property-api-to-draft";

type CreatePropertyPageContentProps = {
  labels: CreatePropertyLabels;
  propertyType: PropertyTypeId;
  initialEditDraft: PropertyEditDraftData | null;
};

export default function CreatePropertyPageContent({
  labels,
  propertyType,
  initialEditDraft,
}: CreatePropertyPageContentProps) {
  const isEditMode = Boolean(initialEditDraft);
  const pageTitle = isEditMode
    ? propertyType === "residential"
      ? labels.editPageTitleResidential
      : labels.editPageTitleCommercial
    : propertyType === "residential"
      ? labels.pageTitleResidential
      : labels.pageTitleCommercial;

  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        pageTitle={pageTitle}
        useRouterBack
      />

      <div className="mx-auto max-w-2xl">
        <CreatePropertyWizard
          labels={labels}
          propertyType={propertyType}
          initialEditDraft={initialEditDraft}
        />
      </div>
    </>
  );
}
