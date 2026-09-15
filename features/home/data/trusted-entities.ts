export type TrustedEntityConfig = {
  id: string;
  theme: "purple" | "blue" | "teal";
  logoSrc: string;
  licenseUrl: string;
};

export const trustedEntitiesConfig: TrustedEntityConfig[] = [
  {
    id: "ejar",
    theme: "teal",
    logoSrc: "/images/ejar.png",
    licenseUrl: "#",
  },
  {
    id: "rega",
    theme: "blue",
    logoSrc: "/images/general-authority.png",
    licenseUrl: "#",
  },
  {
    id: "business",
    theme: "purple",
    logoSrc: "/images/saudi-center.png",
    licenseUrl: "#",
  },
];
