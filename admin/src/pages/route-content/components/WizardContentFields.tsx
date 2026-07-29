import { ListChecks } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { localizedInputDirection } from "@/lib/localized-direction";
import { SectionCard } from "@/pages/home/components/SectionCard";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RouteContentLocale } from "../types";
import { AddButton, FormField, Input, RepeatableCard, Textarea } from "./RepeatableControls";

const icons = ["blocks", "clock", "gauge", "layers", "monitor", "wrench"];

function WizardOptions({ locale, questionIndex, copy }: { locale: RouteContentLocale; questionIndex: number; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const name = `translations.${locale}.project-wizard.wizard.questions.${questionIndex}.options` as const;
  const options = useFieldArray({ control, name });
  return <div className="grid gap-3"><h4 className="font-black text-alt">{copy.options}</h4>{options.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.options} ${index + 1}`} removeLabel={copy.remove} onRemove={() => options.remove(index)}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.value}><Input dir="ltr" {...register(`${name}.${index}.value`)} /></FormField><FormField label={copy.title}><Input {...register(`${name}.${index}.title`)} /></FormField><FormField label={copy.description} className="md:col-span-2"><Textarea {...register(`${name}.${index}.description`)} /></FormField><FormField label={copy.budget}><Input type="number" {...register(`${name}.${index}.budget`, { valueAsNumber: true })} /></FormField><FormField label={copy.weeks}><Input type="number" {...register(`${name}.${index}.weeks`, { valueAsNumber: true })} /></FormField><FormField label={copy.multiplier}><Input type="number" step="0.01" {...register(`${name}.${index}.multiplier`, { valueAsNumber: true })} /></FormField><FormField label={copy.weekMultiplier}><Input type="number" step="0.01" {...register(`${name}.${index}.weekMultiplier`, { valueAsNumber: true })} /></FormField></div></RepeatableCard>)}<AddButton label={copy.addOption} onClick={() => options.append({ value: `option-${options.fields.length + 1}`, title: "", description: "", budget: 0, weeks: 0, multiplier: 1, weekMultiplier: 1 })} /></div>;
}

export function WizardContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const name = `translations.${locale}.project-wizard.wizard.questions` as const;
  const questions = useFieldArray({ control, name });
  return <div className={localizedInputDirection(locale)}><SectionCard title={copy.questions} icon={ListChecks}><div className="grid gap-5">{questions.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.questions} ${index + 1}`} removeLabel={copy.remove} onRemove={() => questions.remove(index)}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.id}><Input dir="ltr" {...register(`${name}.${index}.id`)} /></FormField><FormField label={copy.icon}><Controller control={control} name={`${name}.${index}.icon`} render={({ field: select }) => <Select value={select.value} onValueChange={select.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{icons.map((icon) => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}</SelectContent></Select>} /></FormField><FormField label={copy.title}><Input {...register(`${name}.${index}.title`)} /></FormField><FormField label={copy.description} className="md:col-span-2"><Textarea {...register(`${name}.${index}.description`)} /></FormField><div className="md:col-span-2"><WizardOptions locale={locale} questionIndex={index} copy={copy} /></div></div></RepeatableCard>)}</div><AddButton label={copy.addQuestion} onClick={() => questions.append({ id: `question-${questions.fields.length + 1}`, icon: "layers", title: "", description: "", options: [{ value: "option-1", title: "", description: "", budget: 0, weeks: 0, multiplier: 1, weekMultiplier: 1 }] })} /></SectionCard></div>;
}
