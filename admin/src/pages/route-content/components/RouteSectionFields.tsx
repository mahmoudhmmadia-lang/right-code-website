import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/pages/home/components/FormField";
import { SectionCard } from "@/pages/home/components/SectionCard";
import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RouteContentLocale, RouteSectionConfig } from "../types";
import { lang } from "@/context/global";

export function RouteSectionFields({ locale, section, copy }: { locale: RouteContentLocale; section: RouteSectionConfig; copy: RouteContentCopyText }) {
  const { register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.${section.key}` as const;

  return (
    <SectionCard title={section.label[lang.value]} description={copy.sectionHint} icon={FileText}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={copy.badge}><Input dir={locale === "ar" ? "rtl" : "ltr"} {...register(`${prefix}.badge`)} /></FormField>
        <FormField label={copy.eyebrow}><Input dir={locale === "ar" ? "rtl" : "ltr"} {...register(`${prefix}.eyebrow`)} /></FormField>
        <FormField label={copy.heading}><Input dir={locale === "ar" ? "rtl" : "ltr"} {...register(`${prefix}.heading`)} /></FormField>
        <FormField label={copy.chapterLabel}><Input dir={locale === "ar" ? "rtl" : "ltr"} {...register(`${prefix}.chapterLabel`)} /></FormField>
        <FormField label={copy.subheading} className="md:col-span-2"><Textarea dir={locale === "ar" ? "rtl" : "ltr"} {...register(`${prefix}.subheading`)} className="min-h-28" /></FormField>
        <FormField label={copy.errorMessage} className="md:col-span-2"><Textarea dir={locale === "ar" ? "rtl" : "ltr"} {...register(`${prefix}.errorMessage`)} className="min-h-20" /></FormField>
      </div>
    </SectionCard>
  );
}
