import AppSection from "@/features/app/components/app-section";
import BlogLatestSection from "@/features/blog/components/blog-latest-section";
import BlogListingSection from "@/features/blog/components/blog-listing-section";
import FaqSection from "@/features/faq/components/faq-section";
import SupportSection from "@/features/support/components/support-section";
import React from "react";

export default function BlogPage() {
  return (
    <main className="overflow-x-hidden">
      <BlogLatestSection />
      <BlogListingSection />
      <SupportSection />
      <AppSection />
      <FaqSection />
    </main>
  );
}
