"use client";

import { useMemo, useState } from "react";

import {
  BLOG_GRID_PAGE_SIZE,
} from "@/features/blog/data/blog-post-config";
import type { BlogTabId } from "@/features/blog/types/blog-category";
import type { BlogGridPost } from "@/features/blog/types/blog-post";

export function useBlogListing(posts: BlogGridPost[]) {
  const [activeTab, setActiveTab] = useState<BlogTabId>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    if (activeTab === "all") {
      return posts;
    }

    return posts.filter((post) => post.categoryId === activeTab);
  }, [activeTab, posts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / BLOG_GRID_PAGE_SIZE),
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOG_GRID_PAGE_SIZE;
    return filteredPosts.slice(startIndex, startIndex + BLOG_GRID_PAGE_SIZE);
  }, [currentPage, filteredPosts]);

  function selectTab(tabId: BlogTabId) {
    setActiveTab(tabId);
    setCurrentPage(1);
  }

  function selectPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  return {
    activeTab,
    currentPage,
    totalPages,
    paginatedPosts,
    selectTab,
    selectPage,
  };
}
