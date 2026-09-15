"use client";

import { useCallback, useState } from "react";

import { getInstrumentTypePopup } from "@/features/shared/services/get-instrument-type-popup";
import type {
  InstrumentTypePopupContext,
  InstrumentTypePopupItem,
} from "@/features/shared/types/instrument-type-popup";
import { resolvePopupInstrumentType } from "@/features/shared/utils/resolve-popup-instrument-type";

function isPopupEnabledForContext(
  item: InstrumentTypePopupItem,
  context: InstrumentTypePopupContext,
) {
  const status =
    context === "contract"
      ? item.popup_status_contract
      : item.popup_status_realestate;

  return status === true || status === 1;
}

async function fetchPopupItems(
  instrumentType: string,
  context: InstrumentTypePopupContext,
) {
  const popupInstrumentType = resolvePopupInstrumentType(instrumentType);
  const items = await getInstrumentTypePopup(popupInstrumentType, context);

  if (items.length > 0 || popupInstrumentType === instrumentType) {
    return items;
  }

  return getInstrumentTypePopup(instrumentType, context);
}

export function useInstrumentTypeDeedPopup(context: InstrumentTypePopupContext) {
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState<InstrumentTypePopupItem | null>(null);
  const [deedTypeLabel, setDeedTypeLabel] = useState("");

  const showPopupFor = useCallback(
    async (instrumentType: string, label: string) => {
      try {
        const items = await fetchPopupItems(instrumentType, context);
        const item = items.find((entry) => isPopupEnabledForContext(entry, context));

        if (!item) {
          return;
        }

        setPopup(item);
        setDeedTypeLabel(label);
        setOpen(true);
      } catch {
        // Popup is informational only — do not block deed selection on failure.
      }
    },
    [context],
  );

  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    setOpen,
    popup,
    deedTypeLabel,
    showPopupFor,
    closePopup,
  };
}
