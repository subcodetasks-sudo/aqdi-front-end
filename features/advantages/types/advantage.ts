export type AdvantageIcon = "shield" | "clock" | "headphones";

export type AdvantageTheme = "teal" | "blue" | "purple";

export type AdvantageItemTranslations = {
  title: string;
  description: string;
};

export type AdvantageItemConfig = {
  id: string;
  icon: AdvantageIcon;
  theme: AdvantageTheme;
};
