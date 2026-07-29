import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext, useWatch } from "react-hook-form";
import type { PagesCopyText } from "../pages-copy";
import type { PageForm, PageLocale, PageSection } from "../types";
import { localizedInputDirection } from "@/lib/localized-direction";

function Counter({ value, copy, limit }: { value?: string; copy: PagesCopyText; limit: number }) {
  return <span className="text-[10px] font-semibold text-muted-foreground">{value?.length ?? 0}/{limit} {copy.characters}</span>;
}

export function PageLocalizedFields({ locale, section, copy }: { locale: PageLocale; section: Exclude<PageSection, "general">; copy: PagesCopyText }) {
  const { register, control } = useFormContext<PageForm>();
  const values = useWatch({ control, name: `translations.${locale}` });
  const content = section === "content";
  return <section className={`overflow-hidden rounded-3xl border border-alt/10 bg-background shadow-[0_16px_50px_rgba(18,36,35,.07)] dark:border-white/10 dark:shadow-black/20 ${localizedInputDirection(locale)}`}>
    <header className="border-b border-alt/10 bg-linear-to-r from-main/[.075] to-transparent px-5 py-5 dark:border-white/10 sm:px-7"><h2 className="font-black text-alt">{copy[section]}</h2><p className="mt-1 text-xs text-alt/45">{copy[content ? "contentHint" : "seoHint"]}</p></header>
    {content ? <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
      <div className="grid gap-2"><Label htmlFor={`${locale}-title`}>{copy.titleLabel}</Label><Input id={`${locale}-title`} {...register(`translations.${locale}.title`, { required: true })} /></div>
      <div className="grid gap-2"><Label htmlFor={`${locale}-nav`}>{copy.navigationLabel}</Label><Input id={`${locale}-nav`} {...register(`translations.${locale}.navigationLabel`)} /></div>
      <div className="grid gap-2 sm:col-span-2"><Label htmlFor={`${locale}-excerpt`}>{copy.excerpt}</Label><Textarea id={`${locale}-excerpt`} className="min-h-36" {...register(`translations.${locale}.excerpt`)} /></div>
    </div> : <div className="grid gap-5 p-5 sm:p-7">
      <div className="grid gap-2"><div className="flex items-center justify-between gap-3"><Label htmlFor={`${locale}-meta-title`}>{copy.metaTitle}</Label><Counter value={values?.metaTitle} copy={copy} limit={60} /></div><Input id={`${locale}-meta-title`} maxLength={60} {...register(`translations.${locale}.metaTitle`)} /></div>
      <div className="grid gap-2"><div className="flex items-center justify-between gap-3"><Label htmlFor={`${locale}-meta-description`}>{copy.metaDescription}</Label><Counter value={values?.metaDescription} copy={copy} limit={160} /></div><Textarea id={`${locale}-meta-description`} maxLength={160} {...register(`translations.${locale}.metaDescription`)} /></div>
    </div>}
  </section>;
}
