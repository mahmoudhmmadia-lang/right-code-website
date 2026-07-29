import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Settings2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { SectionCard } from "@/pages/home/components/SectionCard";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RoutePageConfig } from "../types";
import { lang } from "@/context/global";

export function RouteGeneralFields({ config, copy }: { config: RoutePageConfig; copy: RouteContentCopyText }) {
  const { control } = useFormContext<RouteContentFormValues>();
  return (
    <SectionCard title={copy.general} description={copy.visibility} icon={Settings2}>
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <Controller control={control} name="status" render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="PUBLISHED">{copy.publishing}</SelectItem><SelectItem value="DRAFT">{copy.draft}</SelectItem><SelectItem value="ARCHIVED">{copy.archived}</SelectItem></SelectContent>
          </Select>
        )} />
        <div className="grid gap-3 sm:grid-cols-2">
          {config.sections.map((section) => (
            <Controller key={section.key} control={control} name={`visibility.${section.key}`} render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-alt/10 px-3 py-2.5 text-sm font-bold text-alt/65 transition hover:border-main/25 hover:bg-main/[.03]">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} /><Eye className="size-4 text-main" />{section.label[lang.value]}
              </label>
            )} />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
