export type AboutHeroResolved = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
};

export type AboutStatCardResolved = {
  id: string;
  icon: string;
  value: string;
  label: string;
};

export type AboutStoryResolved = {
  badge: string;
  title: string;
  description: string;
  cards: AboutStatCardResolved[];
};

export type AboutVisionMissionBlockResolved = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type AboutVisionMissionResolved = {
  title: string;
  description: string;
  vision: AboutVisionMissionBlockResolved;
  mission: AboutVisionMissionBlockResolved;
};

export type AboutBeneficiaryCardResolved = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type AboutBeneficiariesResolved = {
  badge: string;
  title: string;
  description: string;
  cards: AboutBeneficiaryCardResolved[];
};

export type AboutCoreValueCardResolved = {
  id: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type AboutCoreValuesResolved = {
  badge: string;
  title: string;
  description: string;
  cards: AboutCoreValueCardResolved[];
};

export type AboutContentResolved = {
  hero: AboutHeroResolved;
  story: AboutStoryResolved;
  visionMission: AboutVisionMissionResolved;
  beneficiaries: AboutBeneficiariesResolved;
  coreValues: AboutCoreValuesResolved;
};
