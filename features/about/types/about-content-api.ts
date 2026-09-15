export type AboutContentStatCard = {
  id?: string | null;
  value?: string | null;
  label?: string | null;
};

export type AboutContentTextCard = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
};

export type AboutContentVisionMissionBlock = {
  badge_text?: string | null;
  title?: string | null;
  description?: string | null;
  image_url?: string | null;
};

export type AboutContentHeroSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
};

export type AboutContentStorySection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  cards?: AboutContentStatCard[] | null;
};

export type AboutContentVisionMissionSection = {
  section_title?: string | null;
  section_description?: string | null;
  mission?: AboutContentVisionMissionBlock | null;
  vision?: AboutContentVisionMissionBlock | null;
};

export type AboutContentBeneficiariesSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  cards?: AboutContentTextCard[] | null;
};

export type AboutContentValuesSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  cards?: AboutContentTextCard[] | null;
};

export type AboutContentSections = {
  hero?: AboutContentHeroSection | null;
  story?: AboutContentStorySection | null;
  vision_mission?: AboutContentVisionMissionSection | null;
  beneficiaries?: AboutContentBeneficiariesSection | null;
  values?: AboutContentValuesSection | null;
};

export type AboutContentApiData = {
  page?: string;
  sections?: AboutContentSections | null;
  updated_at?: string | null;
};

export type AboutContentApiResponse = {
  message?: string;
  code?: number;
  success?: boolean;
  data?: AboutContentApiData | null;
};
