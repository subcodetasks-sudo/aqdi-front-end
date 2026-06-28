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
    <article className="rounded-[40px] border border-[#ececec] bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 text-start">
          <h3 className="text-base font-extrabold leading-snug text-brand md:text-lg">
            {property.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {t("requestDateLabel")} {property.date}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <MyPropertyViewDeedButton deedImageUrl={property.deedImageUrl} />
          <MyPropertyDeleteButton />
        </div>
      </div>

      <div className="mt-6 space-y-3">
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
