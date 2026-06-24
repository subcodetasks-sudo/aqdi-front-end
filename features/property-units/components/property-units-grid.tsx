import PropertyUnitCard from "@/features/property-units/components/property-unit-card";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";

type PropertyUnitsGridProps = {
  items: PropertyUnitCardData[];
};

export default function PropertyUnitsGrid({ items }: PropertyUnitsGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((unit) => (
        <PropertyUnitCard key={unit.id} unit={unit} />
      ))}
    </div>
  );
}
