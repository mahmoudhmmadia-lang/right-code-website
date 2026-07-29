import type { RoutePageSeed } from "./page.types";
export const createProjectPage: RoutePageSeed = { slug: "create-project", kind: "STANDARD", status: "PUBLISHED", sortOrder: 60, isHomePage: false, translations: {
  en: { title: "Plan a project", navigationLabel: "Start a project", excerpt: "Turn an early idea into a practical delivery plan.", metaTitle: "Plan your software project", metaDescription: "Shape your requirements, timeline, and delivery approach with the Right Code project planner." },
  ar: { title: "خطط لمشروعك", navigationLabel: "ابدأ مشروعاً", excerpt: "حوّل فكرتك الأولية إلى خطة تنفيذ عملية.", metaTitle: "خطط لمشروعك البرمجي", metaDescription: "حدد المتطلبات والجدول ونهج التنفيذ باستخدام مخطط مشاريع رايت كود." },
  tr: { title: "Proje planla", navigationLabel: "Proje başlat", excerpt: "İlk fikrinizi uygulanabilir bir teslimat planına dönüştürün.", metaTitle: "Yazılım projenizi planlayın", metaDescription: "Right Code proje planlayıcısıyla gereksinimleri ve teslimat yaklaşımını şekillendirin." },
} };
