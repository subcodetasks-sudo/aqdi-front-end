"use client";

import CreateContractWizard from "@/features/create-contract/components/create-contract-wizard";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
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
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        pageTitle={pageTitle}
        useRouterBack
      />

      <div className="mx-auto max-w-2xl">
        <CreateContractWizard labels={labels} contractType={contractType} />
      </div>
    </>
  );
}
