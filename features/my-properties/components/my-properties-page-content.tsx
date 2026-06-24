import MyPropertiesAddButton from "@/features/my-properties/components/my-properties-add-button";
import MyPropertiesGrid from "@/features/my-properties/components/my-properties-grid";
import MyPropertiesHeader from "@/features/my-properties/components/my-properties-header";
import type { MyPropertiesLabels } from "@/features/my-properties/types/my-properties-labels";

type MyPropertiesPageContentProps = {
  labels: MyPropertiesLabels;
};

export default function MyPropertiesPageContent({
  labels,
}: MyPropertiesPageContentProps) {
  return (
    <section className="container py-8 lg:py-10">
      <MyPropertiesHeader
        backLabel={labels.backLabel}
        pageTitle={labels.pageTitle}
      />

      <MyPropertiesGrid items={labels.items} />

      <div className="mt-10 flex justify-center">
        <MyPropertiesAddButton />
      </div>
    </section>
  );
}
