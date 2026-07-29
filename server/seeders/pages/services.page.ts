import type { RoutePageSeed } from "./page.types";
export const servicesPage: RoutePageSeed = { slug: "services", kind: "STANDARD", status: "PUBLISHED", sortOrder: 10, isHomePage: false, translations: {
  en: { title: "Services", navigationLabel: "Services", excerpt: "Engineering services shaped around your operation.", metaTitle: "Software engineering services", metaDescription: "Custom platforms, reporting, integrations, infrastructure, and long-term support." },
  ar: { title: "الخدمات", navigationLabel: "الخدمات", excerpt: "خدمات هندسية مصممة حول عمليات مؤسستك.", metaTitle: "خدمات هندسة البرمجيات", metaDescription: "منصات مخصصة وتقارير وتكاملات وبنية تحتية ودعم طويل الأمد." },
  tr: { title: "Hizmetler", navigationLabel: "Hizmetler", excerpt: "Operasyonunuza göre şekillenen mühendislik hizmetleri.", metaTitle: "Yazılım mühendisliği hizmetleri", metaDescription: "Özel platformlar, raporlama, entegrasyonlar, altyapı ve uzun vadeli destek." },
} };
