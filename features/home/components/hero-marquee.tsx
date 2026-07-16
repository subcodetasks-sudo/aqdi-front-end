"use client"
import Image from "next/image"
import { Marquee } from "@/components/ui/marquee"
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
<p className=" text-brand-secondary font-bold text-right">متوافق مع </p>

<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:40s] [--gap:2rem]">
        {featureLogos.map((logo) => (
          <Image
            key={logo}
            src={logo}
            alt="logo"
            width={100}
            height={100}
            className="size-16 object-contain"
          />
        ))}
      </Marquee>
      {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
        {featureLogos.map((logo) => (
          <Image src={logo} alt="logo" width={100} height={100} className="size-25 object-contain" />
        ))}
      </Marquee> */}
      <div className="from-brand-background-green pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-linear-to-r"></div>
      <div className="from-brand-background-green pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-linear-to-l"></div>
    </div>
    </div>
  )
}
