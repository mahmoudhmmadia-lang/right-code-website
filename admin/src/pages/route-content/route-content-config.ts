import type { RouteContentLocale, RoutePageConfig } from "./types";

const text = (en: string, ar: string, tr: string): Record<RouteContentLocale, string> => ({ en, ar, tr });

export const ROUTE_PAGE_CONFIGS = {
  about: {
    pageId: "about",
    title: text("About page", "صفحة من نحن", "Hakkımızda sayfası"),
    description: text("Manage every public About section.", "إدارة جميع أقسام صفحة من نحن العامة.", "Hakkımızda sayfasındaki tüm bölümleri yönetin."),
    sections: [
      { key: "about-why", label: text("Why choose us", "لماذا تختارنا", "Neden bizi seçmelisiniz"), component: "about-why", sortOrder: 10 },
      { key: "about-terminal", label: text("About terminal", "نافذة التعريف", "Hakkımızda terminali"), component: "about-terminal", sortOrder: 20 },
    ],
  },
  services: {
    pageId: "services",
    title: text("Services page", "صفحة الخدمات", "Hizmetler sayfası"),
    description: text("Manage every public Services section.", "إدارة جميع أقسام صفحة الخدمات العامة.", "Hizmetler sayfasındaki tüm bölümleri yönetin."),
    sections: [
      { key: "services-detail", label: text("Service details", "تفاصيل الخدمات", "Hizmet ayrıntıları"), component: "services-detail", sortOrder: 10 },
      { key: "services-lifecycle", label: text("Process lifecycle", "مراحل العمل", "Süreç yaşam döngüsü"), component: "services-lifecycle", sortOrder: 20 },
    ],
  },
  work: {
    pageId: "work",
    title: text("Work page", "صفحة الأعمال", "Çalışmalar sayfası"),
    description: text("Manage the public Work route sections.", "إدارة أقسام صفحة الأعمال العامة.", "Çalışmalar sayfası bölümlerini yönetin."),
    sections: [
      { key: "work-projects", label: text("Projects showcase", "عرض المشاريع", "Proje vitrini"), component: "work-projects", sortOrder: 10 },
      { key: "work-case-studies", label: text("Case studies", "دراسات الحالة", "Vaka çalışmaları"), component: "work-case-studies", sortOrder: 20 },
    ],
  },
  team: {
    pageId: "team",
    title: text("Team page", "صفحة الفريق", "Ekip sayfası"),
    description: text("Manage the public Team route sections.", "إدارة أقسام صفحة الفريق العامة.", "Ekip sayfası bölümlerini yönetin."),
    sections: [
      { key: "team-people", label: text("People", "أعضاء الفريق", "Ekip üyeleri"), component: "team-people", sortOrder: 10 },
      { key: "team-careers", label: text("Careers", "الوظائف", "Kariyer"), component: "team-careers", sortOrder: 20 },
    ],
  },
  contact: {
    pageId: "contact",
    title: text("Contact page", "صفحة التواصل", "İletişim sayfası"),
    description: text("Manage the public Contact route sections.", "إدارة أقسام صفحة التواصل العامة.", "İletişim sayfası bölümlerini yönetin."),
    sections: [{ key: "contact-overview", label: text("Contact overview", "محتوى التواصل", "İletişim içeriği"), component: "contact-overview", sortOrder: 10 }],
  },
  blog: {
    pageId: "blog",
    title: text("Blog page", "صفحة المدونة", "Blog sayfası"),
    description: text("Manage the public Blog route content.", "إدارة محتوى صفحة المدونة العامة.", "Blog sayfası içeriğini yönetin."),
    sections: [{ key: "blog-index", label: text("Blog index", "قائمة المقالات", "Blog dizini"), component: "blog-index", sortOrder: 10 }],
  },
  projectWizard: {
    pageId: "project-wizard",
    title: text("Project planner", "مخطط المشاريع", "Proje planlayıcı"),
    description: text("Manage estimator copy, questions, options, budget, and timeline rules.", "إدارة نصوص وأسئلة وخيارات وميزانية ومدة أداة التقدير.", "Tahmin metnini, soruları, seçenekleri, bütçeyi ve süre kurallarını yönetin."),
    sections: [{ key: "project-wizard", label: text("Project estimator", "أداة تقدير المشروع", "Proje tahmin aracı"), component: "project-wizard", sortOrder: 10 }],
  },
} satisfies Record<string, RoutePageConfig>;

export type RoutePageKey = keyof typeof ROUTE_PAGE_CONFIGS;
