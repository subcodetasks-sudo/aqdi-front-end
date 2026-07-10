"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { getUncompletedContract } from "@/features/create-contract/services/get-uncompleted-contract";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { RequestCardData } from "@/features/requests/types/request";

type RequestEditContractButtonProps = {
  uuid: string;
  contractType: RequestCardData["contractType"];
  label: string;
  errorLabel: string;
};

export default function RequestEditContractButton({
  uuid,
  contractType,
  label,
  errorLabel,
}: RequestEditContractButtonProps) {
  const router = useRouter();
  const loadUncompletedContract = useCreateContractDraftStore(
    (state) => state.loadUncompletedContract,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await getUncompletedContract(uuid);

      if (!result.ok) {
        toast.error(result.error || errorLabel);
        return;
      }

      loadUncompletedContract(result.data);
      router.push(`/create-contract?id=${contractType}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isLoading}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f0f0f0] px-4 text-sm font-bold text-foreground/70 transition-colors hover:bg-[#e6e6e6] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Eye className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
