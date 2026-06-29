export type PropertyTypeId = "residential" | "commercial" ;

export const PROPERTY_TYPES = ["residential", "commercial"] as const;

export function parsePropertyType(value: string | undefined): PropertyTypeId {
  return value === "commercial" ? "commercial" : "residential";
}
