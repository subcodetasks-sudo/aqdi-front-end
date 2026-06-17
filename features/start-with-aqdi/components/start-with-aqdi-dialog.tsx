"use client";

import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthOrDivider from "@/features/auth/components/auth-or-divider";
import StartWithAqdiContractCard from "@/features/start-with-aqdi/components/start-with-aqdi-contract-card";
import StartWithAqdiDialogHeader from "@/features/start-with-aqdi/components/start-with-aqdi-dialog-header";
import type { ContractType } from "@/features/start-with-aqdi/types/contract-type";
import type { StartWithAqdiDialogLabels } from "@/features/start-with-aqdi/types/start-with-aqdi-dialog-labels";
import CustomIcon from "@/features/shared/components/custom-icon";

type StartWithAqdiDialogProps = {
  children: React.ReactNode;
  labels: StartWithAqdiDialogLabels;
};

export default function StartWithAqdiDialog({
  children,
  labels,
}: StartWithAqdiDialogProps) {
  const [selectedType, setSelectedType] =
    useState<ContractType>("new-contract");

  function handleContinue() {
    console.log("Continue with contract type:", selectedType);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl lg:rounded-[50px]  sm:max-w-lg p-8 max-h-[95vh] overflow-y-auto no-scrollbar"
      >
        <div className="flex items-center justify-between ">
          <DialogTitle className="text-base font-semibold text-foreground">
            {labels.title}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label={labels.close}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="space-y-6 ">
          <StartWithAqdiDialogHeader
            mainTitle={labels.mainTitle}
            subtitle={labels.subtitle}
            ejarLogoAlt={labels.ejarLogoAlt}
            aqdiLogoAlt={labels.aqdiLogoAlt}
          />

          <AuthOrDivider label={labels.divider} />

          <div className="grid  gap-4 grid-cols-2">
            <StartWithAqdiContractCard
              type="new-contract"
              title={labels.newContract.title}
              description={labels.newContract.description}
              imageSrc="/images/ejar-contract.png"
              imageAlt={labels.newContract.imageAlt}
              selected={selectedType === "new-contract"}
              onSelect={setSelectedType}
            />

            <StartWithAqdiContractCard
              type="existing-estate"
              title={labels.estateContract.title}
              description={labels.estateContract.description}
              imageSrc="/images/estate-contract.png"
              imageAlt={labels.estateContract.imageAlt}
              selected={selectedType === "existing-estate"}
              onSelect={setSelectedType}
            />
          </div>

          <Button
            type="button"
            onClick={handleContinue}
            className="h-12 w-full  rounded-full bg-linear-to-l from-brand-secondary to-brand text-base font-semibold text-white hover:opacity-90"
          >
            <CustomIcon src="/icons/arrow-r.svg" size={30} />
            {labels.continue}
            <CustomIcon src="/icons/arrow-l.svg" size={30} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
