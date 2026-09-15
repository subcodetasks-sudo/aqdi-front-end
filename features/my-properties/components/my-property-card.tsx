"use client";

import { useTranslations } from "next-intl";

import MyPropertyActionButton from "@/features/my-properties/components/my-property-action-button";
import MyPropertyDeleteButton from "@/features/my-properties/components/my-property-delete-button";
import MyPropertyViewDeedButton from "@/features/my-properties/components/my-property-view-deed-button";
import {
  MY_PROPERTY_ACTIONS_CONFIG,
  buildPropertyActionHref,
} from "@/features/my-properties/data/my-property-actions-config";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";

type MyPropertyCardProps = {
  property: MyPropertyCardData;
};

const ACTION_TRANSLATION_KEYS = {
  "view-edit": "viewEdit",
  "view-units": "viewUnits",
  "add-unit": "addUnit",
  "create-contract": "createContract",
} as const;

export default function MyPropertyCard({ property }: MyPropertyCardProps) {
  const t = useTranslations("myProperties.card");
  const tActions = useTranslations("myProperties.card.actions");

  return (
    <article className="rounded-3xl border border-[#ececec] bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-start">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full bg-brand-secondary"
              aria-hidden="true"
            />
            <h3 className="truncate text-base font-extrabold leading-snug text-brand md:text-lg">
              {property.title}
            </h3>
          </div>
          <p className="mt-2 text-xs text-[#8a8a8a]">
            {t("requestDateLabel")} {property.date}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <MyPropertyViewDeedButton deedImageUrl={property.deedImageUrl} />
          <MyPropertyDeleteButton propertyId={property.propertyId} />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {MY_PROPERTY_ACTIONS_CONFIG.map((action) => (
          <MyPropertyActionButton
            key={`${property.id}-${action.id}`}
            href={buildPropertyActionHref(action.id, property)}
            label={tActions(ACTION_TRANSLATION_KEYS[action.labelKey])}
            iconType={action.iconType}
            iconSrc={action.iconSrc}
          />
        ))}
      </div>
    </article>
  );
}
