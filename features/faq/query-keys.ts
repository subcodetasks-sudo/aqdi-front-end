export const faqKeys = {
  all: ["faq"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  list: () => [...faqKeys.lists()] as const,
};
