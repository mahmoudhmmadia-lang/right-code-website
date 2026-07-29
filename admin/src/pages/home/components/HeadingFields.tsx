import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import type { HomeCopy } from "../home-copy";
import type { HomeFormValues, HomeLocale, HomeTranslationFields } from "../types";
import { FormField } from "./FormField";
import { localizedInputDirection } from "@/lib/localized-direction";

type SectionName = keyof Pick<HomeTranslationFields, "hero" | "partners" | "painPoints" | "services" | "testimonials">;

export function HeadingFields({ locale, section, copy }: { locale: HomeLocale; section: SectionName; copy: HomeCopy }) {
  const { register } = useFormContext<HomeFormValues>();
  const prefix = `translations.${locale}.${section}` as const;
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${localizedInputDirection(locale)}`}>
      <FormField label={copy.badge}><Input {...register(`${prefix}.badge`)} /></FormField>
      <FormField label={copy.heading}><Input {...register(`${prefix}.heading`)} /></FormField>
      <FormField label={copy.subheading} className="md:col-span-2"><Textarea {...register(`${prefix}.subheading`)} className="min-h-24" /></FormField>
    </div>
  );
}
