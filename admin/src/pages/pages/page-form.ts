import type { PageForm, PageLocale, PageTranslation, RoutePage } from "./types";

const emptyTranslation = (): PageTranslation => ({ title: "", navigationLabel: "", excerpt: "", metaTitle: "", metaDescription: "" });

export function pageToForm(page: RoutePage): PageForm {
  const translation = (locale: PageLocale): PageTranslation => ({ ...emptyTranslation(), ...page.translations?.[locale] });
  return {
    status: page.status,
    template: page.template ?? "",
    sortOrder: page.sortOrder,
    isHomePage: page.isHomePage,
    translations: { en: translation("en"), ar: translation("ar"), tr: translation("tr") },
  };
}
