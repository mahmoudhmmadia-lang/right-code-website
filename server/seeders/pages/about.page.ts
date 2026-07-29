import type { RoutePageSeed } from "./page.types";
export const aboutPage: RoutePageSeed = { slug: "about", kind: "STANDARD", status: "PUBLISHED", sortOrder: 30, isHomePage: false, translations: {
  en: { title: "About", navigationLabel: "About", excerpt: "A software partner focused on clarity and durable delivery.", metaTitle: "About Right Code", metaDescription: "Learn how Right Code approaches software strategy, delivery, security, and long-term partnership." },
  ar: { title: "من نحن", navigationLabel: "من نحن", excerpt: "شريك برمجي يركز على الوضوح والتنفيذ المستدام.", metaTitle: "عن رايت كود", metaDescription: "تعرف إلى نهج رايت كود في الاستراتيجية والتنفيذ والأمان والشراكة طويلة الأمد." },
  tr: { title: "Hakkımızda", navigationLabel: "Hakkımızda", excerpt: "Netlik ve kalıcı teslimata odaklanan yazılım ortağı.", metaTitle: "Right Code hakkında", metaDescription: "Right Code'un strateji, teslimat, güvenlik ve uzun vadeli ortaklık yaklaşımını keşfedin." },
} };
