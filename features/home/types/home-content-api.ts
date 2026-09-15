export type HomeContentTextCard = {
  title?: string | null;
  description?: string | null;
};

export type HomeContentAuthorityCard = {
  image_url?: string | null;
  license_file_url?: string | null;
  license_file_type?: string | null;
};

export type HomeContentPricingFeature = {
  text?: string | null;
};

export type HomeContentPricingCard = {
  title?: string | null;
  subtitle?: string | null;
  price?: string | null;
  duration_label?: string | null;
  features?: HomeContentPricingFeature[] | null;
};

export type HomeContentHeroSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  image_url?: string | null;
};

export type HomeContentOfficialAuthoritiesSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  cards?: HomeContentAuthorityCard[] | null;
};

export type HomeContentFeaturesSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  cards?: HomeContentTextCard[] | null;
};

export type HomeContentPricingSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  cards?: HomeContentPricingCard[] | null;
};

export type HomeContentContactSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  contact_number?: string | null;
  image_url?: string | null;
};

export type HomeContentAppSection = {
  badge_text?: string | null;
  main_title?: string | null;
  description?: string | null;
  image_url?: string | null;
};

export type HomeContentSections = {
  hero?: HomeContentHeroSection | null;
  official_authorities?: HomeContentOfficialAuthoritiesSection | null;
  features?: HomeContentFeaturesSection | null;
  pricing?: HomeContentPricingSection | null;
  contact?: HomeContentContactSection | null;
  app?: HomeContentAppSection | null;
};

export type HomeContentApiData = {
  page?: string;
  sections?: HomeContentSections | null;
  updated_at?: string | null;
};

export type HomeContentApiResponse = {
  message?: string;
  code?: number;
  success?: boolean;
  data?: HomeContentApiData | null;
};
