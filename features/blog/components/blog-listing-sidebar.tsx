import BlogSidebarCategoriesCard from "@/features/blog/components/blog-sidebar-categories-card";
import BlogSidebarNewsletterCard from "@/features/blog/components/blog-sidebar-newsletter-card";
import BlogSidebarStatsCard from "@/features/blog/components/blog-sidebar-stats-card";
import BlogSidebarTagsCard from "@/features/blog/components/blog-sidebar-tags-card";
import type { BlogListingLabels } from "@/features/blog/types/blog-listing-labels";

type BlogListingSidebarProps = {
  labels: BlogListingLabels["sidebar"];
};

export default function BlogListingSidebar({
  labels,
}: BlogListingSidebarProps) {
  return (
    <aside className="space-y-5">
      <BlogSidebarStatsCard
        title={labels.stats.title}
        subtitle={labels.stats.subtitle}
        description={labels.stats.description}
        statsHeading={labels.stats.statsHeading}
        logoAlt={labels.stats.logoAlt}
        activeUsers={labels.stats.activeUsers}
        activeUsersLabel={labels.stats.activeUsersLabel}
        annualContracts={labels.stats.annualContracts}
        annualContractsLabel={labels.stats.annualContractsLabel}
        leasedUnits={labels.stats.leasedUnits}
        leasedUnitsLabel={labels.stats.leasedUnitsLabel}
      />

      <BlogSidebarCategoriesCard
        title={labels.categories.title}
        items={labels.categories.items}
      />

      <BlogSidebarTagsCard title={labels.tags.title} items={labels.tags.items} />

      <BlogSidebarNewsletterCard
        badge={labels.newsletter.badge}
        title={labels.newsletter.title}
        description={labels.newsletter.description}
        placeholder={labels.newsletter.placeholder}
        subscribeLabel={labels.newsletter.subscribe}
        submitEmailLabel={labels.newsletter.submitEmailLabel}
      />
    </aside>
  );
}
