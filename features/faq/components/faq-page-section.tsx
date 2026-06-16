"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Info, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export default function FaqPageSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const [openId, setOpenId] = useState<string>(items[1]?.id ?? items[0]?.id ?? "");

  return (
    <section className="min-h-screen bg-white py-16 md:py-24">
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">

                    {/* Sticky header */}
                    <div className="space-y-4  lg:text-start">
            <span className="inline-flex items-center rounded-full border bg-brand-background-green px-4 py-1.5 text-sm font-bold text-foreground">
              {t("badge")}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-brand md:text-5xl">
              {t("title")}
            </h1>
            <p className="text-sm leading-8 text-muted-foreground md:text-base">
              {t("description")}
            </p>
          </div>
          {/* Accordion list */}
          <Accordion
            type="single"
            collapsible
            value={openId}
            onValueChange={setOpenId}
            className="space-y-3"
          >
            {items.map((item) => {
              const isOpen = openId === item.id;

              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-none"
                >
                  <div
                    className={cn(
                      "w-full rounded-2xl  px-5 py-4 transition-colors duration-200",
                      isOpen
                        ? " bg-brand-background"
                        : " bg-transparent"
                    )}
                  >
                    <AccordionTrigger className="w-full py-0 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                      <div className="flex w-full items-center gap-4">
                        {isOpen ? (
                          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                            <Plus className="size-5" aria-hidden="true" />
                          </span>
                        ) : (
                          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <Info className="size-5" aria-hidden="true" />
                          </span>
                        )}

                        <p
                          className={cn(
                            "flex-1 text-start text-base font-semibold md:text-lg",
                            isOpen ? "text-brand" : "text-foreground"
                          )}
                        >
                          {item.question}
                        </p>

                        <span
                          className={cn(
                            "inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                            isOpen
                              ? "bg-[#0DB38B] "
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isOpen ? (
                            <ChevronUp className="size-4" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="size-4" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pb-1 pe-14 ps-14 pt-3 text-sm leading-8 text-muted-foreground md:text-base">
                      {item.answer}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>


        </div>
      </div>
    </section>
  );
}
