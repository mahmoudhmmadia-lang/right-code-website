import type { RoutePageSeed } from "./page.types";
export const homePage: RoutePageSeed = { slug: "home", kind: "HOME", status: "PUBLISHED", sortOrder: 0, isHomePage: true, translations: {
  en: { title: "Home", navigationLabel: "Home", excerpt: "Dependable software engineering for ambitious organizations.", metaTitle: "Software engineering built for the long term", metaDescription: "Secure, scalable products, platforms, integrations, and infrastructure by Right Code." },
  ar: { title: "الرئيسية", navigationLabel: "الرئيسية", excerpt: "هندسة برمجيات موثوقة للمؤسسات الطموحة.", metaTitle: "هندسة برمجيات مصممة للمستقبل", metaDescription: "منتجات ومنصات وتكاملات وبنية تحتية آمنة وقابلة للتوسع من رايت كود." },
  tr: { title: "Ana Sayfa", navigationLabel: "Ana Sayfa", excerpt: "İddialı kuruluşlar için güvenilir yazılım mühendisliği.", metaTitle: "Uzun ömürlü yazılım mühendisliği", metaDescription: "Right Code tarafından güvenli ve ölçeklenebilir ürünler, platformlar ve entegrasyonlar." },
} };
