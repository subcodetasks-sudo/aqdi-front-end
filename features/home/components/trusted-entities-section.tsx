import TrustedEntitiesHeader from "@/features/home/components/trusted-entities-header";
import TrustedEntityCard from "@/features/home/components/trusted-entity-card";
import type { HomeAuthoritiesResolved } from "@/features/home/types/home-content";

type TrustedEntitiesSectionProps = {
  content: HomeAuthoritiesResolved;
};

export default function TrustedEntitiesSection({
  content,
}: TrustedEntitiesSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="container flex flex-col gap-10 md:gap-12">
        <TrustedEntitiesHeader
          badge={content.badge}
          titlePrefix={content.titlePrefix}
          titleAccent={content.titleAccent}
          description={content.description}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.cards.map((entity) => (
            <TrustedEntityCard
              key={entity.id}
              name={entity.name}
              nameEn={entity.nameEn}
              description={entity.description}
              viewLicense={content.viewLicense}
              licenseUrl={entity.licenseUrl}
              logoSrc={entity.logoSrc}
              theme={entity.theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
