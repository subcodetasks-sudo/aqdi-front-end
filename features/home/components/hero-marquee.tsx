import Image from "next/image";

import { Marquee } from "@/components/ui/marquee";

const featureLogos = [
  "/images/ejar.png",
  "/images/hesab.png",
  "/images/daman.png",
  "/images/tegara.png",
  "/images/najez.png",
];

export default function HeroMarquee() {
  return (
    <div dir="ltr">
      <p className="text-right text-brand-secondary font-bold">متوافق مع </p>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s] [--gap:2rem]">
          {featureLogos.map((logo) => (
            <Image
              key={logo}
              src={logo}
              alt=""
              width={64}
              height={64}
              className="size-16 object-contain"
              sizes="64px"
            />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-linear-to-r from-brand-background-green" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-linear-to-l from-brand-background-green" />
      </div>
    </div>
  );
}
