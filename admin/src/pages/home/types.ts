export const HOME_LOCALES = ["en", "ar", "tr"] as const;
export type HomeLocale = (typeof HOME_LOCALES)[number];
export type HomeEditorSection = "general" | "hero" | "partners" | "painPoints" | "services" | "testimonials";

export type HeadingFields = { badge: string; heading: string; subheading: string };
export type PartnerFields = { name: string; category: string };
export type PainPointFields = { title: string; description: string };
export type TestimonialFields = { quote: string; name: string; title: string };

export type HomeTranslationFields = {
  hero: HeadingFields & {
    tags: string[];
    scenePrimaryLabel: string;
    sceneSecondaryLabel: string;
    capabilitiesLabel: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: Array<{ value: string; label: string }>;
  };
  partners: HeadingFields & { items: PartnerFields[] };
  painPoints: HeadingFields & { cta: string; items: PainPointFields[] };
  services: HeadingFields & { emptyMessage: string; errorMessage: string };
  testimonials: HeadingFields & { items: TestimonialFields[] };
};

export type HomeFormValues = {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  visibility: Record<"hero" | "partners" | "painPoints" | "services" | "testimonials", boolean>;
  hero: {
    imageUrl: string;
    backgroundImageUrl: string;
    visualLabels: string[];
    imageFile?: FileList;
    backgroundImageFile?: FileList;
  };
  partners: Array<{ imageUrl: string; imageFile?: FileList }>;
  translations: Record<HomeLocale, HomeTranslationFields>;
};

export type HomeExperienceRecord = {
  id: string;
  status: HomeFormValues["status"];
  content?: {
    hero?: Omit<HomeFormValues["hero"], "imageFile" | "backgroundImageFile">;
    partners?: Array<{ imageUrl?: string }>;
    visibility?: Partial<HomeFormValues["visibility"]>;
  };
  translations: Partial<Record<HomeLocale, Partial<HomeTranslationFields>>>;
};

export type ApiEnvelope<T> = { materials: T; message: string };
