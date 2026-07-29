import { Tags } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SectionCard } from "@/pages/home/components/SectionCard";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RouteContentLocale, RouteSectionConfig } from "../types";
import { AddButton, FormField, Input, RepeatableCard, Textarea } from "./RepeatableControls";

export function CopyEntriesFields({ locale, section, copy }: { locale: RouteContentLocale; section: RouteSectionConfig; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.${section.key}.copyEntries` as const;
  const entries = useFieldArray({ control, name: prefix });
  return <SectionCard title={copy.detailedLabels} description={copy.sectionHint} icon={Tags}>
    <div className="grid gap-4">
      {entries.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.label} ${index + 1}`} removeLabel={copy.remove} onRemove={() => entries.remove(index)}><div className="grid gap-4 md:grid-cols-[.7fr_1.3fr]"><FormField label={copy.id}><Input dir="ltr" {...register(`${prefix}.${index}.key`)} /></FormField><FormField label={copy.value}><Textarea dir={locale === "ar" ? "rtl" : "ltr"} {...register(`${prefix}.${index}.value`)} /></FormField></div></RepeatableCard>)}
      <AddButton label={copy.addLabel} onClick={() => entries.append({ key: "", value: "" })} />
    </div>
  </SectionCard>;
}
