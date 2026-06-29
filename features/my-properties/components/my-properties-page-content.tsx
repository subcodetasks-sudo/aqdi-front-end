import MyPropertiesAddButton from "@/features/my-properties/components/my-properties-add-button";
import MyPropertiesGrid from "@/features/my-properties/components/my-properties-grid";
import MyPropertiesHeader from "@/features/my-properties/components/my-properties-header";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";
import type { MyPropertiesLabels } from "@/features/my-properties/types/my-properties-labels";

type MyPropertiesPageContentProps = {
  labels: MyPropertiesLabels;
  items: MyPropertyCardData[];
};

export default function MyPropertiesPageContent({
  labels,
  items,
}: MyPropertiesPageContentProps) {
  return (
    <section className="container py-8 lg:py-10">
      <MyPropertiesHeader
        backLabel={labels.backLabel}
        pageTitle={labels.pageTitle}
      />

      {items.length > 0 ? (
        <MyPropertiesGrid items={items} />
      ) : (
        <p className="rounded-3xl border border-dashed border-[#e8e8e8] bg-white px-6 py-12 text-center text-sm text-muted-foreground">
          {labels.emptyState}
        </p>
      )}

      <div className="mt-10 flex justify-center">
        <MyPropertiesAddButton
          label={labels.addProperty}
        />
      </div>
    </section>
  );
}
