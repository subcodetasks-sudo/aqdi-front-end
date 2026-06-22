"use client";

import CreateContractHeader from "@/features/create-contract/components/create-contract-header";
import CreateContractWizard from "@/features/create-contract/components/create-contract-wizard";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

type CreateContractPageContentProps = {
  labels: CreateContractLabels;
  contractType: ContractTypeId;
};

export default function CreateContractPageContent({
  labels,
  contractType,
}: CreateContractPageContentProps) {
  const pageTitle =
    contractType === "residential"
      ? labels.pageTitleResidential
      : labels.pageTitleCommercial;

  return (
    <section className="space-y-8">
      <section className="container pt-8 lg:pt-12 ">
        <CreateContractHeader
          backLabel={labels.backLabel}
          pageTitle={pageTitle}
        />
      </section>
      <section className="container pb-8 lg:pb-12 lg:max-w-2xl mx-auto">
        <CreateContractWizard labels={labels} contractType={contractType} />
      </section>
    </section>
  );
}
