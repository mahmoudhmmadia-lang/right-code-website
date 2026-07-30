import { translator } from "./cms-translator.data";

const partnerKeys = [
  ["partnerGrandPowerGroup", "partnerCategoryPrivate"], ["partnerYouthSportsDirectorate", "partnerCategoryPublic"],
  ["partnerYouthSportsMinistry", "partnerCategoryPublic"], ["partnerMigrationManagement", "partnerCategoryPublic"],
  ["partnerOmanGovernment", "partnerCategoryPublic"], ["partnerGaziantepUniversity", "partnerCategoryEducation"],
  ["partnerMinistryOfJustice", "partnerCategoryPublic"], ["partnerAleppoGovernorate", "partnerCategoryPublic"],
  ["partnerSyrianDevelopmentFund", "partnerCategoryDevelopment"], ["partnerSyrianDevelopmentOrganization", "partnerCategoryNgo"],
  ["partnerCommunityDevelopment", "partnerCategoryDevelopment"], ["partnerShafak", "partnerCategoryNgo"],
  ["partnerIndependentDoctorsAssociation", "partnerCategoryHealthcare"], ["partnerGarantiBbvaInternational", "partnerCategoryFinancial"],
  ["partnerSenlik", "partnerCategoryCommunity"], ["partnerItuCekirdek", "partnerCategoryTechnology"],
  ["partnerSawa", "partnerCategorySocial"],
] as const;

function homeTranslation(
  copy: Record<keyof typeof translator.en, string>,
  servicesEmpty: string,
  servicesError: string,
  scenePrimaryLabel: string,
  sceneSecondaryLabel: string,
  capabilitiesLabel: string,
) {
  return {
    hero: {
      badge: copy.landingBadge, heading: copy.heroTitle, subheading: copy.heroDescription,
      tags: [copy.tag1, copy.tag2, copy.tag3],
      scenePrimaryLabel,
      sceneSecondaryLabel,
      capabilitiesLabel,
      primaryCta: { label: copy.ctaPrimary, href: "/create-project" },
      secondaryCta: { label: copy.ctaSecondary, href: "/work" },
      stats: [
        { value: copy.stat2Number, label: copy.stat2Label },
        { value: copy.stat3Number, label: copy.stat3Label },
        { value: copy.stat4Number, label: copy.stat4Label },
      ],
    },
    partners: {
      badge: copy.customersBadge, heading: copy.customersTitle, subheading: copy.customersSubtitle,
      items: partnerKeys.map(([name, category]) => ({ name: copy[name], category: copy[category] })),
    },
    painPoints: {
      badge: copy.painPointsBadge, heading: copy.painPointsTitle, subheading: copy.painPointsSubtitle,
      cta: copy.painPointsCTA,
      items: [1, 2].map((index) => ({
        title: copy[`painPoint${index}Title` as keyof typeof copy],
        description: copy[`painPoint${index}Desc` as keyof typeof copy],
      })),
    },
    services: { badge: copy.servicesBadge, heading: copy.servicesTitle, subheading: copy.servicesSubtitle, emptyMessage: servicesEmpty, errorMessage: servicesError },
    testimonials: {
      badge: copy.testimonialsBadge, heading: copy.testimonialsTitle, subheading: copy.testimonialsSubtitle,
      items: [1, 2, 3, 4].map((index) => ({
        quote: copy[`testimonial${index}Quote` as keyof typeof copy],
        name: copy[`testimonial${index}Name` as keyof typeof copy],
        title: copy[`testimonial${index}Title` as keyof typeof copy],
      })),
    },
  };
}

export const homeExperienceData = {
  pageId: "home", key: "home-experience", type: "CUSTOM", status: "PUBLISHED", sortOrder: 0, anchor: "home",
  content: {
    hero: { imageUrl: "/assets/home/logo.png", backgroundImageUrl: "", visualLabels: ["Product", "Systems", "Scale"] },
    partners: partnerKeys.map((_, index) => ({ imageUrl: `/assets/home/customers/${index + 1}.png` })),
    visibility: { hero: true, partners: true, painPoints: true, services: true, testimonials: true },
  },
  translations: {
    en: homeTranslation(translator.en, "New services are being prepared.", "Services are temporarily unavailable. Please try again shortly.", "Cursor reactive", "Scroll powered", "Our capabilities"),
    ar: homeTranslation(translator.ar, "يجري تجهيز خدمات جديدة.", "الخدمات غير متاحة مؤقتاً. يرجى المحاولة بعد قليل.", "تفاعل مع المؤشر", "مدعوم بالتمرير", "قدراتنا"),
    tr: homeTranslation(translator.tr, "Yeni hizmetler hazırlanıyor.", "Hizmetler geçici olarak kullanılamıyor. Lütfen kısa süre sonra tekrar deneyin.", "İmlece duyarlı", "Kaydırma destekli", "Yeteneklerimiz"),
  },
};
