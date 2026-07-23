"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { getUncompletedContract } from "@/features/create-contract/services/get-uncompleted-contract";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { RequestCardData } from "@/features/requests/types/request";
import { cn } from "@/lib/utils";

type RequestEditContractButtonProps = {
  uuid: string;
  contractType: RequestCardData["contractType"];
  label: string;
  errorLabel: string;
  className?: string;
  showIcon?: boolean;
};

export default function RequestEditContractButton({
  uuid,
  contractType,
  label,
  errorLabel,
  className,
  showIcon = true,
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
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#f3f3f3] px-4 text-sm font-bold text-[#555555] transition-colors hover:bg-[#ebebeb] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {showIcon ? <Eye className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span className="truncate">{label}</span>
    </button>
  );
}
