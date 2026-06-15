import HeroFeatureItem from "@/features/home/components/hero-feature-item";

type HeroFeatureListProps = {
  features: string[];
};

const images = [
  "/images/ejar.png",
  "/images/hesab.png",
  "/images/daman.png",
  "/images/tegara.png",
  "/images/najez.png",
];
export default function HeroFeatureList({ features }: HeroFeatureListProps) {
  return (
    <ul className="space-y-4">
      {features.map((feature, index) => (
        <HeroFeatureItem key={feature} label={feature} image={images[index]} />
      ))}
    </ul>
  );
}
