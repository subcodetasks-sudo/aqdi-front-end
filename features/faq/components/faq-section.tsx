"use client";

import { ChevronDown, ChevronUp, Info, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

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

export default function FaqSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const [openId, setOpenId] = useState<string>(items[1]?.id ?? items[0]?.id ?? "");

  return (
    <section className="bg-brand py-16 md:py-20">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          <header className="space-y-3 text-center text-white lg:text-start">
            <h2 className="text-3xl font-extrabold md:text-4xl">{t("title")}</h2>
            <p className="text-sm text-white/80 md:text-base">{t("description")}</p>
          </header>

          <Accordion
            type="single"
            collapsible
            value={openId}
            onValueChange={setOpenId}
            className=" space-y-4 "
          >
            {items.map((item) => {
              const isOpen = openId === item.id;

              return (
                <AccordionItem key={item.id} value={item.id} className="border-none">
                  <div className={ cn("w-full rounded-[1.65rem]  px-4 py-3 md:px-6 md:py-4" ,isOpen?"bg-white":"bg-transparent")}>
                    <AccordionTrigger className="w-full py-0 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                      <div className="flex w-full items-center gap-4">
                        {
                            isOpen ? (
                                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                                    <Plus className="size-5" aria-hidden="true" />
                                </span>
                            ) : (
                                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-background text-gray-500">
                                    <Info className="size-5" aria-hidden="true" />
                                </span>
                            )
                        }
                        <div className="flex-1 text-start">
                          <p className={cn("text-lg font-medium ", isOpen ? "text-black" : "text-white")}>{item.question}</p>
                        </div>
                        <span className={ cn("mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-300", isOpen ? "bg-brand-secondary size-8" : "bg-brand-background text-brand-secondary ")}>
                          {isOpen ? (
                            <ChevronUp className="size-4" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="size-4 " aria-hidden="true" />
                          )}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pe-14 ps-12 pt-2 pb-1 text-base leading-8 text-gray-600">
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
