"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
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
import PropertiesTypeDialogHeader from "@/features/properties/components/properties-type-dialog-header";
import { PROPERTY_TYPES } from "@/features/properties/types/property-type";
import StartWithAqdiContractCard from "@/features/start-with-aqdi/components/start-with-aqdi-contract-card";
import StartWithAqdiContractTypeOption from "@/features/start-with-aqdi/components/start-with-aqdi-contract-type-option";
import StartWithAqdiDialogHeader from "@/features/start-with-aqdi/components/start-with-aqdi-dialog-header";
import type { ContractType } from "@/features/start-with-aqdi/types/contract-type";
import type { StartWithAqdiDialogLabels } from "@/features/start-with-aqdi/types/start-with-aqdi-dialog-labels";
import CustomIcon from "@/features/shared/components/custom-icon";

type StartWithAqdiDialogProps = {
  children: React.ReactNode;
  labels: StartWithAqdiDialogLabels;
};

type DialogStep = "flow" | "contract-type";

const CONTRACT_TYPE_ICONS = {
  residential: "/icons/housing.svg",
  commercial: "/icons/commercial.svg",
} as const;

export default function StartWithAqdiDialog({
  children,
  labels,
}: StartWithAqdiDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("flow");
  const [selectedType, setSelectedType] =
    useState<ContractType>("new-contract");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setStep("flow");
      setSelectedType("new-contract");
    }
  }

  function handleContinue() {
    if (selectedType === "existing-estate") {
      setOpen(false);
      router.push("/properties/my-properties");
      return;
    }

    setStep("contract-type");
  }

  function handleContractTypeNavigate() {
    setOpen(false);
    setStep("flow");
    setSelectedType("new-contract");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="no-scrollbar max-h-[95vh] gap-0 overflow-hidden overflow-y-auto rounded-3xl p-6 sm:max-w-lg sm:p-8 lg:rounded-[50px]"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="text-base font-semibold text-foreground">
            {step === "flow" ? labels.title : labels.contractTypeDialog.title}
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

        {step === "flow" ? (
          <div className="mt-6 space-y-6">
            <StartWithAqdiDialogHeader
              mainTitle={labels.mainTitle}
              subtitle={labels.subtitle}
              ejarLogoAlt={labels.ejarLogoAlt}
              aqdiLogoAlt={labels.aqdiLogoAlt}
            />

            <AuthOrDivider label={labels.divider} />

            <div className="grid grid-cols-2 gap-4">
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
              className="h-12 w-full rounded-full bg-linear-to-l from-brand-secondary to-brand text-base font-semibold text-white hover:opacity-90"
            >
              <CustomIcon src="/icons/arrow-r.svg" size={30} />
              {labels.continue}
              <CustomIcon src="/icons/arrow-l.svg" size={30} />
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <PropertiesTypeDialogHeader
              mainTitle={labels.contractTypeDialog.mainTitle}
              subtitle={labels.contractTypeDialog.subtitle}
              iconAlt={labels.contractTypeDialog.iconAlt}
            />

            <div className="space-y-3">
              {PROPERTY_TYPES.map((type) => (
                <StartWithAqdiContractTypeOption
                  key={type}
                  type={type}
                  title={labels.contractTypeDialog.options[type].title}
                  description={labels.contractTypeDialog.options[type].description}
                  iconSrc={CONTRACT_TYPE_ICONS[type]}
                  iconAlt={labels.contractTypeDialog.options[type].iconAlt}
                  onNavigate={handleContractTypeNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
