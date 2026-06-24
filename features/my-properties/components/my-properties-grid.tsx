import MyPropertyCard from "@/features/my-properties/components/my-property-card";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";

type MyPropertiesGridProps = {
  items: MyPropertyCardData[];
};

export default function MyPropertiesGrid({ items }: MyPropertiesGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((property) => (
        <MyPropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
