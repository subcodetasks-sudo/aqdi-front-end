import Image from "next/image";
import { FaCircleCheck } from "react-icons/fa6";

type HeroFeatureItemProps = {
  label: string;
  image: string;
};

export default function HeroFeatureItem({ label, image }: HeroFeatureItemProps) {
  return (
    <li className="flex items-center gap-3">
      <FaCircleCheck className="size-4 text-brand-secondary shrink-0"   />
      <span className=" font-semibold leading-snug text-black md:text-base text-sm">
        {label}
      </span>
      {image && (
        <Image src={image} alt={label} width={100} height={100} className="md:w-12 w-10 object-contain " />
      )}
    </li>
  );
}
