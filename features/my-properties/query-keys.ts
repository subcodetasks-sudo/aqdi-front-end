export const myPropertiesKeys = {
  all: ["my-properties"] as const,
  list: () => [...myPropertiesKeys.all, "list"] as const,
};
