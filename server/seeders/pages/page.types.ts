export type PageLocaleSeed = { title: string; navigationLabel: string; excerpt: string; metaTitle: string; metaDescription: string };
export type RoutePageSeed = {
  slug: string;
  kind: "HOME" | "STANDARD";
  status: "PUBLISHED";
  sortOrder: number;
  isHomePage: boolean;
  translations: Record<"en" | "ar" | "tr", PageLocaleSeed>;
};
