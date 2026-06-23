"use client";

import { useState } from "react";

import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";

export function useCreatePropertyDeedStep() {
  const [selectedDeedType, setSelectedDeedTypeState] = useState<
    PropertyDeedTypeId | ""
  >("");
  const [deedFiles, setDeedFiles] = useState<File[]>([]);

  const canContinue = selectedDeedType !== "" && deedFiles.length > 0;

  function setSelectedDeedType(value: PropertyDeedTypeId | "") {
    setSelectedDeedTypeState(value);

    if (value === "") {
      setDeedFiles([]);
    }
  }

  return {
    selectedDeedType,
    setSelectedDeedType,
    deedFiles,
    setDeedFiles,
    canContinue,
  };
}
