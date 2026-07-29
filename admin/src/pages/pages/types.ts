export const PAGE_LOCALES = ["en", "ar", "tr"] as const;
export type PageLocale = (typeof PAGE_LOCALES)[number];
export type PageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PageTranslation = {
  title: string;
  navigationLabel: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
};

export type RoutePage = {
  id: string;
  slug: string;
  kind: string;
  status: PageStatus;
  template?: string | null;
  sortOrder: number;
  isHomePage: boolean;
  translations: Record<PageLocale, Partial<PageTranslation>>;
  updatedAt: string;
};

export type PageForm = {
  status: PageStatus;
  template: string;
  sortOrder: number;
  isHomePage: boolean;
  translations: Record<PageLocale, PageTranslation>;
};

export type PageCollection = { data: RoutePage[]; pagesNumber: number; totalCount: number };
export type PageSection = "general" | "content" | "seo";
