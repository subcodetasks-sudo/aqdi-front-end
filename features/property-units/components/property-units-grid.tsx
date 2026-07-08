import PropertyUnitCard from "@/features/property-units/components/property-unit-card";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";

type PropertyUnitsGridProps = {
  items: PropertyUnitCardData[];
  property: PropertyWithUnitsApiData | null;
};

export default function PropertyUnitsGrid({ items, property }: PropertyUnitsGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((unit) => (
        <PropertyUnitCard key={unit.id} unit={unit} property={property} />
      ))}
    </div>
  );
}
