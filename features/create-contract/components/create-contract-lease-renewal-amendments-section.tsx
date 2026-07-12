"use client";

import { FilePenLine } from "lucide-react";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import CreateContractLeaseRenewalNotesDialog from "@/features/create-contract/components/create-contract-lease-renewal-notes-dialog";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractLeaseRenewalAmendmentsSectionProps = {
  labels: CreateContractLabels["tenant"]["leaseRenewal"];
  addNotes: boolean;
  notes: string;
  onAddNotesChange: (value: boolean) => void;
  onNotesChange: (value: string) => void;
};

export default function CreateContractLeaseRenewalAmendmentsSection({
  labels,
  addNotes,
  notes,
  onAddNotesChange,
  onNotesChange,
}: CreateContractLeaseRenewalAmendmentsSectionProps) {
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);

  function handleToggle(checked: boolean) {
    onAddNotesChange(checked);

    if (checked) {
      setNotesDialogOpen(true);
    }
  }

  function handleEdit() {
    onAddNotesChange(true);
    setNotesDialogOpen(true);
  }

  return (
    <>
      <div className="rounded-3xl">

        <div className="mt-5 flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-3">
            <Switch
              dir="ltr"
              checked={addNotes}
              onCheckedChange={handleToggle}
              className="h-6 w-11 shrink-0 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9]"
            />
            <span className="text-sm font-semibold text-brand">
              {labels.addNotesToggle}
            </span>
          </label>
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary"
          >
            <FilePenLine className="size-4" aria-hidden="true" />
            {labels.edit}
          </button>

  
        </div>
      </div>

      <CreateContractLeaseRenewalNotesDialog
        labels={labels.notesDialog}
        open={notesDialogOpen}
        onOpenChange={setNotesDialogOpen}
        value={notes}
        onSave={onNotesChange}
      />
    </>
  );
}
