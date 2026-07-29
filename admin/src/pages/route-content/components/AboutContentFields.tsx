import { Info, TerminalSquare } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { localizedInputDirection } from "@/lib/localized-direction";
import { SectionCard } from "@/pages/home/components/SectionCard";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RouteContentLocale } from "../types";
import { AddButton, FormField, Input, RepeatableCard, Textarea } from "./RepeatableControls";

const reasonIcons = ["link", "shield", "clock", "globe", "star"];
const tones = ["green", "blue", "yellow", "white"];

export function AboutWhyContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.about-why.aboutWhy` as const;
  const reasons = useFieldArray({ control, name: `${prefix}.reasons` });
  return <div className={localizedInputDirection(locale)}><SectionCard title={copy.reasons} icon={Info}>
    <div className="grid gap-4 md:grid-cols-2"><FormField label={copy.quoteTitle}><Input {...register(`${prefix}.quoteTitle`)} /></FormField><FormField label={copy.hoverHint}><Input {...register(`${prefix}.hoverHint`)} /></FormField><FormField label={copy.quoteText} className="md:col-span-2"><Textarea {...register(`${prefix}.quoteText`)} /></FormField></div>
    <div className="grid gap-4">{reasons.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.reasons} ${index + 1}`} removeLabel={copy.remove} onRemove={() => reasons.remove(index)}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.icon}><Controller control={control} name={`${prefix}.reasons.${index}.icon`} render={({ field: select }) => <Select value={select.value} onValueChange={select.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{reasonIcons.map((icon) => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}</SelectContent></Select>} /></FormField><FormField label={copy.title}><Input {...register(`${prefix}.reasons.${index}.title`)} /></FormField><FormField label={copy.description} className="md:col-span-2"><Textarea {...register(`${prefix}.reasons.${index}.description`)} /></FormField></div></RepeatableCard>)}</div>
    <AddButton label={copy.addReason} onClick={() => reasons.append({ icon: "link", title: "", description: "" })} />
  </SectionCard></div>;
}

export function AboutTerminalContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.about-terminal.aboutTerminal.lines` as const;
  const lines = useFieldArray({ control, name: prefix });
  return <div className={localizedInputDirection(locale)}><SectionCard title={copy.terminalLines} icon={TerminalSquare}><div className="grid gap-4">{lines.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.terminalLines} ${index + 1}`} removeLabel={copy.remove} onRemove={() => lines.remove(index)}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.command}><Input {...register(`${prefix}.${index}.command`)} /></FormField><FormField label={copy.tone}><Controller control={control} name={`${prefix}.${index}.tone`} render={({ field: select }) => <Select value={select.value} onValueChange={select.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{tones.map((tone) => <SelectItem key={tone} value={tone}>{tone}</SelectItem>)}</SelectContent></Select>} /></FormField><FormField label={copy.response} className="md:col-span-2"><Textarea {...register(`${prefix}.${index}.response`)} /></FormField></div></RepeatableCard>)}</div><AddButton label={copy.addLine} onClick={() => lines.append({ command: "", response: "", tone: "green" })} /></SectionCard></div>;
}
