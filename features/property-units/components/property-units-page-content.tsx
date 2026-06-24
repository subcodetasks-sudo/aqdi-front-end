import PropertyUnitsHeader from "@/features/property-units/components/property-units-header";
import PropertyUnitsTabs from "@/features/property-units/components/property-units-tabs";
import type { PropertyUnitsLabels } from "@/features/property-units/types/property-units-labels";

type PropertyUnitsPageContentProps = {
  labels: PropertyUnitsLabels;
};

export default function PropertyUnitsPageContent({
  labels,
}: PropertyUnitsPageContentProps) {
  return (
    <section className="container py-8 lg:py-10">
      <PropertyUnitsHeader
        backLabel={labels.backLabel}
        pageTitle={labels.pageTitle}
      />

      <PropertyUnitsTabs labels={labels} />
    </section>
  );
}
