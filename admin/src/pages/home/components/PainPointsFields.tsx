import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TriangleAlert } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { HomeCopy } from "../home-copy";
import type { HomeFormValues, HomeLocale } from "../types";
import { FormField } from "./FormField";
import { HeadingFields } from "./HeadingFields";
import { SectionCard } from "./SectionCard";
import { localizedInputDirection } from "@/lib/localized-direction";

export function PainPointsFields({ locale, copy }: { locale: HomeLocale; copy: HomeCopy }) {
  const { register } = useFormContext<HomeFormValues>();
  return (
    <SectionCard title={copy.painPoints} icon={TriangleAlert}>
      <HeadingFields locale={locale} section="painPoints" copy={copy} />
      <div className={`grid gap-4 md:grid-cols-2 ${localizedInputDirection(locale)}`}>
        {[0, 1, 2, 3].map((index) => <div key={index} className="grid gap-3 rounded-2xl border border-alt/10 p-4"><h3 className="font-black text-alt">{copy.painPoint} {index + 1}</h3><FormField label={copy.heading}><Input {...register(`translations.${locale}.painPoints.items.${index}.title`)} /></FormField><FormField label={copy.descriptionLabel}><Textarea {...register(`translations.${locale}.painPoints.items.${index}.description`)} /></FormField></div>)}
      </div>
      <FormField label={copy.cta}><Textarea {...register(`translations.${locale}.painPoints.cta`)} dir={locale === "ar" ? "rtl" : "ltr"} /></FormField>
    </SectionCard>
  );
}
