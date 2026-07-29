import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import type { PagesCopyText } from "../pages-copy";
import type { PageForm } from "../types";

export function PageGeneralFields({ copy }: { copy: PagesCopyText }) {
  const { control, register } = useFormContext<PageForm>();
  return <section className="overflow-hidden rounded-3xl border border-alt/10 bg-background shadow-[0_16px_50px_rgba(18,36,35,.07)] dark:border-white/10 dark:shadow-black/20">
    <header className="border-b border-alt/10 bg-linear-to-r from-main/[.075] to-transparent px-5 py-5 dark:border-white/10 sm:px-7"><h2 className="font-black text-alt">{copy.general}</h2><p className="mt-1 text-xs text-alt/45">{copy.generalHint}</p></header>
    <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
      <div className="grid gap-2"><Label>{copy.status}</Label><Controller name="status" control={control} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PUBLISHED">{copy.published}</SelectItem><SelectItem value="DRAFT">{copy.draft}</SelectItem><SelectItem value="ARCHIVED">{copy.archived}</SelectItem></SelectContent></Select>} /></div>
      <div className="grid gap-2"><Label htmlFor="template">{copy.template}</Label><Input id="template" {...register("template")} /></div>
      <div className="grid gap-2"><Label htmlFor="sortOrder">{copy.sortOrder}</Label><Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} /></div>
      <Controller name="isHomePage" control={control} render={({ field }) => <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-alt/10 bg-alt/[.025] px-4 py-3 dark:border-white/10 dark:bg-white/[.035]"><Checkbox checked={field.value} onCheckedChange={(value) => field.onChange(value === true)} /><span><strong className="block text-sm text-alt">{copy.homePage}</strong><small className="text-xs text-muted-foreground">{copy.homePageHint}</small></span></label>} />
    </div>
  </section>;
}
