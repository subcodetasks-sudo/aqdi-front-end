export type BlogDetailSection = {
  type: "heading" | "paragraph" | "quote";
  content: string;
};

export type BlogDetailPost = {
  slug: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  views: string;
  imageSrc: string;
  imageAlt: string;
  sections: BlogDetailSection[];
};

export type BlogDetailLabels = {
  shareArticle: string;
  shareOnX: string;
  shareOnLinkedin: string;
  shareGeneric: string;
};
