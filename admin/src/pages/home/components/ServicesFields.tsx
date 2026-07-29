import { Textarea } from "@/components/ui/textarea";
import { Blocks } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { HomeCopy } from "../home-copy";
import type { HomeFormValues, HomeLocale } from "../types";
import { FormField } from "./FormField";
import { HeadingFields } from "./HeadingFields";
import { SectionCard } from "./SectionCard";
import { localizedInputDirection } from "@/lib/localized-direction";

export function ServicesFields({ locale, copy }: { locale: HomeLocale; copy: HomeCopy }) {
  const { register } = useFormContext<HomeFormValues>();
  return (
    <SectionCard title={copy.services} icon={Blocks}>
      <HeadingFields locale={locale} section="services" copy={copy} />
      <div className={`grid gap-4 md:grid-cols-2 ${localizedInputDirection(locale)}`}><FormField label={copy.emptyMessage}><Textarea {...register(`translations.${locale}.services.emptyMessage`)} /></FormField><FormField label={copy.errorMessage}><Textarea {...register(`translations.${locale}.services.errorMessage`)} /></FormField></div>
    </SectionCard>
  );
}
