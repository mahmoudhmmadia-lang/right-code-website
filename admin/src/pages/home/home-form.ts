import type { HomeExperienceRecord, HomeFormValues, HomeLocale, HomeTranslationFields } from "./types";
import { HOME_LOCALES } from "./types";

const emptyHeading = () => ({ badge: "", heading: "", subheading: "" });

function emptyTranslation(): HomeTranslationFields {
  return {
    hero: {
      ...emptyHeading(),
      tags: ["", "", ""],
      scenePrimaryLabel: "",
      sceneSecondaryLabel: "",
      capabilitiesLabel: "",
      primaryCta: { label: "", href: "" },
      secondaryCta: { label: "", href: "" },
      stats: Array.from({ length: 3 }, () => ({ value: "", label: "" })),
    },
    partners: { ...emptyHeading(), items: [{ name: "", category: "" }] },
    painPoints: {
      ...emptyHeading(),
      cta: "",
      items: Array.from({ length: 4 }, () => ({ title: "", description: "" })),
    },
    services: { ...emptyHeading(), emptyMessage: "", errorMessage: "" },
    testimonials: {
      ...emptyHeading(),
      items: [{ quote: "", name: "", title: "" }],
    },
  };
}

function mergeTranslation(value?: Partial<HomeTranslationFields>): HomeTranslationFields {
  const empty = emptyTranslation();
  return {
    hero: {
      ...empty.hero,
      ...value?.hero,
      tags: value?.hero?.tags?.length ? value.hero.tags : empty.hero.tags,
      stats: value?.hero?.stats?.length ? value.hero.stats.map((item) => ({ value: item.value ?? "", label: item.label ?? "" })) : empty.hero.stats,
      primaryCta: { ...empty.hero.primaryCta, ...value?.hero?.primaryCta },
      secondaryCta: { ...empty.hero.secondaryCta, ...value?.hero?.secondaryCta },
    },
    partners: {
      ...empty.partners,
      ...value?.partners,
      items: value?.partners?.items?.length ? value.partners.items : empty.partners.items,
    },
    painPoints: {
      ...empty.painPoints,
      ...value?.painPoints,
      items: value?.painPoints?.items?.length ? value.painPoints.items : empty.painPoints.items,
    },
    services: { ...empty.services, ...value?.services },
    testimonials: {
      ...empty.testimonials,
      ...value?.testimonials,
      items: value?.testimonials?.items?.length ? value.testimonials.items : empty.testimonials.items,
    },
  };
}

export function homeDefaults(record?: HomeExperienceRecord | null): HomeFormValues {
  const partnerCount = Math.max(
    1,
    record?.content?.partners?.length ?? 0,
    ...HOME_LOCALES.map((locale) => record?.translations?.[locale]?.partners?.items?.length ?? 0),
  );
  const translations = Object.fromEntries(
    HOME_LOCALES.map((locale) => {
      const translation = mergeTranslation(record?.translations?.[locale]);
      translation.partners.items = Array.from({ length: partnerCount }, (_, index) => translation.partners.items[index] ?? { name: "", category: "" });
      return [locale, translation];
    }),
  ) as Record<HomeLocale, HomeTranslationFields>;

  return {
    status: record?.status ?? "PUBLISHED",
    visibility: {
      hero: record?.content?.visibility?.hero ?? true,
      partners: record?.content?.visibility?.partners ?? true,
      painPoints: record?.content?.visibility?.painPoints ?? true,
      services: record?.content?.visibility?.services ?? true,
      testimonials: record?.content?.visibility?.testimonials ?? true,
    },
    hero: {
      imageUrl: record?.content?.hero?.imageUrl ?? "",
      backgroundImageUrl: record?.content?.hero?.backgroundImageUrl ?? "",
      visualLabels: record?.content?.hero?.visualLabels?.length ? record.content.hero.visualLabels : ["", "", ""],
    },
    partners: Array.from({ length: partnerCount }, (_, index) => ({
      imageUrl: record?.content?.partners?.[index]?.imageUrl ?? "",
    })),
    translations,
  };
}

function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !key.endsWith("File"))
        .map(([key, item]) => [key, clean(item)]),
    );
  }
  return typeof value === "string" ? value.trim() : value;
}

export function homeFormData(values: HomeFormValues) {
  const formData = new FormData();
  formData.append("status", values.status);
  formData.append("content", JSON.stringify(clean({
    hero: {
      imageUrl: values.hero.imageUrl,
      backgroundImageUrl: values.hero.backgroundImageUrl,
      visualLabels: values.hero.visualLabels,
    },
    partners: values.partners.map(({ imageUrl }) => ({ imageUrl })),
    visibility: values.visibility,
  })));
  formData.append("translations", JSON.stringify(clean(values.translations)));

  const heroImage = values.hero.imageFile?.[0];
  const backgroundImage = values.hero.backgroundImageFile?.[0];
  if (heroImage) formData.append("content.hero.imageUrl", heroImage);
  if (backgroundImage) formData.append("content.hero.backgroundImageUrl", backgroundImage);
  values.partners.forEach((partner, index) => {
    const file = partner.imageFile?.[0];
    if (file) formData.append(`content.partners.${index}.imageUrl`, file);
  });
  return formData;
}
