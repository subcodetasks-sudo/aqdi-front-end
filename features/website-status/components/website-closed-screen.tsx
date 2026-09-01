import { Wrench } from "lucide-react";
import Image from "next/image";

import MaintenancePoller from "@/features/website-status/components/maintenance-poller";
import type { WebsiteClosedView } from "@/features/website-status/utils/get-website-closed-view";

/**
 * Full-screen maintenance notice shown while the backend reports the website as
 * closed. Rendered outside the app providers — no home / auth / contract data
 * loads behind it.
 */
export default function WebsiteClosedScreen({
  view,
}: {
  view: WebsiteClosedView;
}) {
  const { headline, labels } = view;

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-brand-background-green px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white px-8 py-11 shadow-2xl ring-1 ring-black/5 sm:px-10 sm:py-12 lg:rounded-[3rem]">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt={labels.logoAlt}
            width={72}
            height={72}
            className="size-18 object-contain"
            priority
          />
          <p className="mt-4 text-2xl font-extrabold text-brand">
            {labels.brandName}
          </p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {labels.tagline}
          </p>
        </div>

        <div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-brand/10 p-2 text-sm font-bold text-brand">
          <span className="flex size-7 items-center justify-center rounded-full bg-brand text-white">
            <Wrench className="size-4" aria-hidden="true" strokeWidth={2.25} />
          </span>
          {labels.kicker}
        </div>

        <h1 className="mt-8 text-center text-2xl font-bold leading-snug text-foreground sm:text-[1.75rem]">
          {headline}
        </h1>

        <p className="mt-5 text-center text-base leading-8 text-muted-foreground">
          {labels.body}
        </p>

        <div
          className="mt-10 flex items-center justify-center gap-2 opacity-80"
          aria-hidden="true"
        >
          <Image
            src="/images/contract-line-l.svg"
            alt=""
            width={120}
            height={16}
            className="h-4 w-30 object-contain"
          />
          <Image
            src="/images/contract-line-r.svg"
            alt=""
            width={120}
            height={16}
            className="h-4 w-30 object-contain"
          />
        </div>
      </div>

      <p className="mt-6 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        {labels.autoNote}
      </p>

      <MaintenancePoller />
    </main>
  );
}
