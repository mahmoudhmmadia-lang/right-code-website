import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareQuote, Plus, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { HomeCopy } from "../home-copy";
import { HOME_LOCALES, type HomeFormValues, type HomeLocale } from "../types";
import { FormField } from "./FormField";
import { HeadingFields } from "./HeadingFields";
import { SectionCard } from "./SectionCard";
import { localizedInputDirection } from "@/lib/localized-direction";

export function TestimonialsFields({ locale, copy }: { locale: HomeLocale; copy: HomeCopy }) {
  const { register, control, getValues, setValue } = useFormContext<HomeFormValues>();
  const items = useWatch({ control, name: `translations.${locale}.testimonials.items` });
  const add = () => HOME_LOCALES.forEach((itemLocale) => setValue(`translations.${itemLocale}.testimonials.items`, [...getValues(`translations.${itemLocale}.testimonials.items`), { quote: "", name: "", title: "" }], { shouldDirty: true }));
  const remove = (index: number) => {
    if (items.length === 1) return;
    HOME_LOCALES.forEach((itemLocale) => setValue(`translations.${itemLocale}.testimonials.items`, getValues(`translations.${itemLocale}.testimonials.items`).filter((_, itemIndex) => itemIndex !== index), { shouldDirty: true }));
  };
  return (
    <SectionCard title={copy.testimonials} icon={MessageSquareQuote}>
      <HeadingFields locale={locale} section="testimonials" copy={copy} />
      <div className={`grid gap-4 ${localizedInputDirection(locale)}`}>{items.map((_, index) => <div key={index} className="rounded-2xl border border-alt/10 p-4"><div className="mb-4 flex items-center justify-between"><h3 className="font-black text-alt">{copy.testimonial} {index + 1}</h3><Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}><Trash2 className="size-4" /></Button></div><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.quote} className="md:col-span-2"><Textarea {...register(`translations.${locale}.testimonials.items.${index}.quote`)} /></FormField><FormField label={copy.name}><Input {...register(`translations.${locale}.testimonials.items.${index}.name`)} /></FormField><FormField label={copy.personTitle}><Input {...register(`translations.${locale}.testimonials.items.${index}.title`)} /></FormField></div></div>)}</div>
      <Button type="button" variant="outline" className="w-fit" onClick={add}><Plus className="size-4" />{copy.addTestimonial}</Button>
    </SectionCard>
  );
}
