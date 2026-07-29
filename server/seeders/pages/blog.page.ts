import type { RoutePageSeed } from "./page.types";
export const blogPage: RoutePageSeed = { slug: "blog", kind: "STANDARD", status: "PUBLISHED", sortOrder: 50, isHomePage: false, translations: {
  en: { title: "Insights", navigationLabel: "Blog", excerpt: "Practical perspectives on software, operations, and delivery.", metaTitle: "Software engineering insights", metaDescription: "Practical articles about software architecture, operations, security, and digital delivery." },
  ar: { title: "المقالات", navigationLabel: "المدونة", excerpt: "رؤى عملية حول البرمجيات والعمليات والتنفيذ.", metaTitle: "رؤى في هندسة البرمجيات", metaDescription: "مقالات عملية حول المعمارية والعمليات والأمان والتنفيذ الرقمي." },
  tr: { title: "İçgörüler", navigationLabel: "Blog", excerpt: "Yazılım, operasyon ve teslimat hakkında pratik bakış açıları.", metaTitle: "Yazılım mühendisliği içgörüleri", metaDescription: "Mimari, operasyon, güvenlik ve dijital teslimat hakkında pratik yazılar." },
} };
