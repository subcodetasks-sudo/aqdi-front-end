"use client";

import { FileText } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type CreateContractPaperworkIconProps = {
  src: string;
};

export default function CreateContractPaperworkIcon({
  src,
}: CreateContractPaperworkIconProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <FileText className="size-5 text-brand-secondary" aria-hidden="true" />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={20}
      height={20}
      className="size-5 shrink-0 object-contain"
      aria-hidden="true"
      onError={() => setHasError(true)}
    />
  );
}
