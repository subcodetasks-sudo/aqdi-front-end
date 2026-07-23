"use client";

import { useEffect, useState } from "react";

import CreatePropertyWizard from "@/features/create-property/components/create-property-wizard";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import type { PropertyTypeId } from "@/features/properties/types/property-type";
import type { PropertyEditDraftData } from "@/features/create-property/utils/map-property-api-to-draft";
import { cn } from "@/lib/utils";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isEditMode = Boolean(initialEditDraft);
  const pageTitle = isEditMode
    ? propertyType === "residential"
      ? labels.editPageTitleResidential
      : labels.editPageTitleCommercial
    : propertyType === "residential"
      ? labels.pageTitleResidential
      : labels.pageTitleCommercial;

  useEffect(() => {
    const shell = document.querySelector<HTMLElement>("[data-services-layout]");

    if (!shell) {
      return;
    }

    if (isDarkMode) {
      shell.classList.add("dark", "create-property-dark-shell");
    } else {
      shell.classList.remove("dark", "create-property-dark-shell");
    }

    return () => {
      shell.classList.remove("dark", "create-property-dark-shell");
    };
  }, [isDarkMode]);

  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        pageTitle={pageTitle}
        useRouterBack
        hideBack
      />

      <div
        className={cn(
          "create-property-flow mx-auto max-w-2xl",
          isDarkMode && "dark",
        )}
      >
        <CreatePropertyWizard
          labels={labels}
          propertyType={propertyType}
          initialEditDraft={initialEditDraft}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((current) => !current)}
        />
      </div>
    </>
  );
}
