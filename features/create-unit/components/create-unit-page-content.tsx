"use client";

import CreateUnitHeader from "@/features/create-unit/components/create-unit-header";
import CreateUnitWizard from "@/features/create-unit/components/create-unit-wizard";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";

type CreateUnitPageContentProps = {
  labels: CreateUnitLabels;
};

export default function CreateUnitPageContent({
  labels,
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
        <CreateUnitWizard labels={labels} />
      </section>
    </section>
  );
}
