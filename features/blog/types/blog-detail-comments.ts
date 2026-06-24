export type BlogDetailComment = {
  id: string;
  role: string;
  timeAgo: string;
  rating: number;
  content: string;
  authorName: string;
  likes: string;
  shares: string;
  isLiked?: boolean;
};

export type BlogDetailCommentsLabels = {
  tags: string[];
  title: string;
  comments: BlogDetailComment[];
  authorImageAlt: string;
  formTitle: string;
  formPlaceholder: string;
  submitLabel: string;
  submitAriaLabel: string;
  likeAriaLabel: string;
  shareAriaLabel: string;
};
