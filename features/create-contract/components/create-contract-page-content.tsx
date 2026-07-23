"use client";

import { useEffect, useState } from "react";

import CreateContractWizard from "@/features/create-contract/components/create-contract-wizard";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { cn } from "@/lib/utils";

type CreateContractPageContentProps = {
  labels: CreateContractLabels;
  contractType: ContractTypeId;
};

export default function CreateContractPageContent({
  labels,
  contractType,
}: CreateContractPageContentProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const shell = document.querySelector<HTMLElement>("[data-services-layout]");

    if (!shell) {
      return;
    }

    if (isDarkMode) {
      shell.classList.add("dark", "create-contract-dark-shell");
    } else {
      shell.classList.remove("dark", "create-contract-dark-shell");
    }

    return () => {
      shell.classList.remove("dark", "create-contract-dark-shell");
    };
  }, [isDarkMode]);

  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        hideBack
      />

      <div className={cn("create-contract-flow", isDarkMode && "dark")}>
        <CreateContractWizard
          labels={labels}
          contractType={contractType}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((current) => !current)}
        />
      </div>
    </>
  );
}
