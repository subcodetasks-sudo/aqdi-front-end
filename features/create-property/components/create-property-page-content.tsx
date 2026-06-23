"use client";

import CreatePropertyHeader from "@/features/create-property/components/create-property-header";
import CreatePropertyWizard from "@/features/create-property/components/create-property-wizard";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";

type CreatePropertyPageContentProps = {
  labels: CreatePropertyLabels;
};

export default function CreatePropertyPageContent({
  labels,
}: CreatePropertyPageContentProps) {
  return (
    <section className="space-y-8">
      <section className="container pt-8 lg:pt-12">
        <CreatePropertyHeader
          backLabel={labels.backLabel}
          pageTitle={labels.pageTitle}
        />
      </section>

      <section className="container mx-auto pb-8 lg:max-w-2xl lg:pb-12">
        <CreatePropertyWizard labels={labels} />
      </section>
    </section>
  );
}
