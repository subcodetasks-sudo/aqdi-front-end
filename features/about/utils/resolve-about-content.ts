import type { NumberStatConfig } from "@/features/about/types/number-stat";
import type {
  AboutContentSections,
  AboutContentStatCard,
  AboutContentTextCard,
} from "@/features/about/types/about-content-api";
import type {
  AboutBeneficiariesResolved,
  AboutContentResolved,
  AboutCoreValuesResolved,
  AboutHeroResolved,
  AboutStoryResolved,
  AboutVisionMissionResolved,
} from "@/features/about/types/about-content";

export type AboutStaticContent = {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
  };
  story: {
    badge: string;
    title: string;
    description: string;
    cards: Array<{
      id: string;
      icon: string;
      value: string;
      label: string;
    }>;
    config: NumberStatConfig[];
  };
  visionMission: {
    title: string;
    description: string;
    vision: {
      eyebrow: string;
      title: string;
      description: string;
      imageSrc: string;
      imageAlt: string;
    };
    mission: {
      eyebrow: string;
      title: string;
      description: string;
      imageSrc: string;
      imageAlt: string;
    };
  };
  beneficiaries: {
    badge: string;
    title: string;
    description: string;
    cards: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
    }>;
  };
  coreValues: {
    badge: string;
    title: string;
    description: string;
    cards: Array<{
      id: string;
      icon: string;
      eyebrow: string;
      title: string;
      description: string;
    }>;
  };
};

function textOrFallback(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : fallback;
}

function splitTitleLines(
  mainTitle: string | null | undefined,
  fallbackLine1: string,
  fallbackLine2: string,
) {
  const title = typeof mainTitle === "string" ? mainTitle.trim() : "";
  if (!title) {
    return { titleLine1: fallbackLine1, titleLine2: fallbackLine2 };
  }

  const words = title.split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return { titleLine1: title, titleLine2: "" };
  }

  const mid = Math.ceil(words.length / 2);
  return {
    titleLine1: words.slice(0, mid).join(" "),
    titleLine2: words.slice(mid).join(" "),
  };
}

function resolveHero(
  api: AboutContentSections["hero"],
  staticContent: AboutStaticContent["hero"],
): AboutHeroResolved {
  const title = splitTitleLines(
    api?.main_title,
    staticContent.titleLine1,
    staticContent.titleLine2,
  );

  return {
    eyebrow: textOrFallback(api?.badge_text, staticContent.eyebrow),
    titleLine1: title.titleLine1,
    titleLine2: title.titleLine2,
    description: textOrFallback(api?.description, staticContent.description),
  };
}

function resolveStory(
  api: AboutContentSections["story"],
  staticContent: AboutStaticContent["story"],
): AboutStoryResolved {
  const apiCards = Array.isArray(api?.cards) ? api.cards : [];
  const cards =
    apiCards.length === 0
      ? staticContent.cards
      : apiCards.map((card: AboutContentStatCard, index) => {
          const fallback =
            staticContent.cards[index] ??
            staticContent.cards[staticContent.cards.length - 1];
          const config =
            staticContent.config[index] ??
            staticContent.config[staticContent.config.length - 1];

          return {
            id: textOrFallback(card.id, fallback?.id ?? `stat-${index}`),
            icon: fallback?.icon ?? config?.icon ?? "/icons/file-write.svg",
            value: textOrFallback(card.value, fallback?.value ?? ""),
            label: textOrFallback(card.label, fallback?.label ?? ""),
          };
        });

  return {
    badge: textOrFallback(api?.badge_text, staticContent.badge),
    title: textOrFallback(api?.main_title, staticContent.title),
    description: textOrFallback(api?.description, staticContent.description),
    cards,
  };
}

function resolveVisionMission(
  api: AboutContentSections["vision_mission"],
  staticContent: AboutStaticContent["visionMission"],
): AboutVisionMissionResolved {
  return {
    title: textOrFallback(api?.section_title, staticContent.title),
    description: textOrFallback(
      api?.section_description,
      staticContent.description,
    ),
    vision: {
      eyebrow: textOrFallback(
        api?.vision?.badge_text,
        staticContent.vision.eyebrow,
      ),
      title: textOrFallback(api?.vision?.title, staticContent.vision.title),
      description: textOrFallback(
        api?.vision?.description,
        staticContent.vision.description,
      ),
      imageSrc: textOrFallback(
        api?.vision?.image_url,
        staticContent.vision.imageSrc,
      ),
      imageAlt: staticContent.vision.imageAlt,
    },
    mission: {
      eyebrow: textOrFallback(
        api?.mission?.badge_text,
        staticContent.mission.eyebrow,
      ),
      title: textOrFallback(api?.mission?.title, staticContent.mission.title),
      description: textOrFallback(
        api?.mission?.description,
        staticContent.mission.description,
      ),
      imageSrc: textOrFallback(
        api?.mission?.image_url,
        staticContent.mission.imageSrc,
      ),
      imageAlt: staticContent.mission.imageAlt,
    },
  };
}

function resolveBeneficiaries(
  api: AboutContentSections["beneficiaries"],
  staticContent: AboutStaticContent["beneficiaries"],
): AboutBeneficiariesResolved {
  const apiCards = Array.isArray(api?.cards) ? api.cards : [];
  const cards =
    apiCards.length === 0
      ? staticContent.cards
      : apiCards.map((card: AboutContentTextCard, index) => {
          const fallback =
            staticContent.cards[index] ??
            staticContent.cards[staticContent.cards.length - 1];

          return {
            id: textOrFallback(card.id, fallback?.id ?? `beneficiary-${index}`),
            icon: fallback?.icon ?? "/icons/user.svg",
            title: textOrFallback(card.title, fallback?.title ?? ""),
            description: textOrFallback(
              card.description,
              fallback?.description ?? "",
            ),
          };
        });

  return {
    badge: textOrFallback(api?.badge_text, staticContent.badge),
    title: textOrFallback(api?.main_title, staticContent.title),
    description: textOrFallback(api?.description, staticContent.description),
    cards,
  };
}

function resolveCoreValues(
  api: AboutContentSections["values"],
  staticContent: AboutStaticContent["coreValues"],
): AboutCoreValuesResolved {
  const apiCards = Array.isArray(api?.cards) ? api.cards : [];
  const cards =
    apiCards.length === 0
      ? staticContent.cards
      : apiCards.map((card: AboutContentTextCard, index) => {
          const fallback =
            staticContent.cards[index] ??
            staticContent.cards[staticContent.cards.length - 1];

          return {
            id: textOrFallback(card.id, fallback?.id ?? `value-${index}`),
            icon: fallback?.icon ?? "/icons/badge.svg",
            eyebrow: fallback?.eyebrow ?? "",
            title: textOrFallback(card.title, fallback?.title ?? ""),
            description: textOrFallback(
              card.description,
              fallback?.description ?? "",
            ),
          };
        });

  return {
    badge: textOrFallback(api?.badge_text, staticContent.badge),
    title: textOrFallback(api?.main_title, staticContent.title),
    description: textOrFallback(api?.description, staticContent.description),
    cards,
  };
}

export function resolveAboutContent(
  api: AboutContentSections | null,
  staticContent: AboutStaticContent,
): AboutContentResolved {
  return {
    hero: resolveHero(api?.hero, staticContent.hero),
    story: resolveStory(api?.story, staticContent.story),
    visionMission: resolveVisionMission(
      api?.vision_mission,
      staticContent.visionMission,
    ),
    beneficiaries: resolveBeneficiaries(
      api?.beneficiaries,
      staticContent.beneficiaries,
    ),
    coreValues: resolveCoreValues(api?.values, staticContent.coreValues),
  };
}
