import { ArrowLeft, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SupportSection() {
  const t = await getTranslations("support");

  return (
    <section className="bg-brand py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 space-y-5 text-center text-white lg:order-1 lg:text-start">
            <p className="text-sm font-medium text-white/90">{t("eyebrow")}</p>
            <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
              <br />
              {t("titleLine3")}
            </h2>
            <p className="mx-auto max-w-lg text-sm leading-7 text-white lg:mx-0">
              {t("description")}
            </p>

            <div className="pt-1">
              <Link
                href="#"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-2 py-2  text-sm font-bold text-brand transition hover:bg-white/95"
              >
                <span>{t("cta")}</span>
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand-secondary text-white">
                  <ArrowLeft className="size-4 rotate-45 transition-transform duration-300 group-hover:rotate-0" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden ">
              <Image
                src="/images/support-banner.png"
                alt={t("imageAlt")}
                width={920}
                height={648}
                className="h-auto w-full rounded-[2.2rem] object-cover"
                priority
              />

              <span className="absolute inset-s-6 top-8 inline-flex -rotate-12 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white shadow-lg">
                {t("satisfaction")}
              </span>

              <span className="absolute bottom-10 inset-e-6 inline-flex rotate-12 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white shadow-lg">
                <MessageCircle className="size-4" aria-hidden="true" />
                {t("responseTime")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
