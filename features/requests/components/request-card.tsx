import RequestCardActions from "@/features/requests/components/request-card-actions";
import RequestCardBadges from "@/features/requests/components/request-card-badges";
import RequestCardDivider from "@/features/requests/components/request-card-divider";
import RequestCopyIdButton from "@/features/requests/components/request-copy-id-button";
import RequestDeleteButton from "@/features/requests/components/request-delete-button";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestCardLabels } from "@/features/requests/types/request-labels";

type RequestCardProps = {
  card: RequestCardData;
  labels: RequestCardLabels;
};

export default function RequestCard({ card, labels }: RequestCardProps) {
  return (
    <article className="rounded-[32px] flex flex-col justify-between bg-white p-6 shadow-[0_2px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 text-start">
          <h3 className="text-lg font-extrabold text-brand md:text-xl">
            {card.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {labels.requestDateLabel} {card.date}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <RequestDeleteButton contractId={card.contractId} />
          <RequestCardBadges card={card} labels={labels} />
        </div>
      </div>

      <div className="mt-8 flex justify-start">
        <div className="text-start">
          <p className="text-xs text-muted-foreground">
            {labels.requestNumberLabel}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xl font-extrabold text-foreground">
              {card.requestNumber}
            </span>
            <RequestCopyIdButton
              requestNumber={card.requestNumber}
              copyLabel={labels.copyRequestNumber}
            />
          </div>
        </div>
      </div>

      {card.actionType !== "none" ? (
        <RequestCardDivider text={labels.inquiryDivider} />
      ) : null}

      <RequestCardActions card={card} labels={labels} />
    </article>
  );
}
