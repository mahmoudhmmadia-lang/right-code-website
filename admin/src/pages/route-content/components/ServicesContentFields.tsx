import { Layers3, Workflow } from "lucide-react";
import { Controller, useFieldArray, useFormContext, type FieldPath } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { localizedInputDirection } from "@/lib/localized-direction";
import { SectionCard } from "@/pages/home/components/SectionCard";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RouteContentLocale } from "../types";
import { AddButton, FormField, Input, RepeatableCard, Textarea } from "./RepeatableControls";

const serviceIcons = ["search", "monitor", "chart", "blocks", "shield", "training", "wrench"];
const workIcons = ["compass", "delivery", "ongoing"];
const lifecycleIcons = ["compass", "waypoints", "code", "rocket", "refresh"];

function IconSelect({ name, options }: { name: FieldPath<RouteContentFormValues>; options: string[] }) {
  const { control } = useFormContext<RouteContentFormValues>();
  return <Controller control={control} name={name} render={({ field }) => <Select value={String(field.value ?? options[0])} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>} />;
}

function ServiceListItems({ locale, serviceIndex, copy }: { locale: RouteContentLocale; serviceIndex: number; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const name = `translations.${locale}.services-detail.servicesDetail.services.${serviceIndex}.listItems` as const;
  const items = useFieldArray({ control, name });
  return <div className="grid gap-3 md:col-span-2"><h4 className="text-sm font-black text-alt">{copy.listItems}</h4>{items.fields.map((field, index) => <div key={field.id} className="flex items-center gap-2"><Input {...register(`${name}.${index}.text`)} /><button type="button" className="text-sm font-bold text-destructive" onClick={() => items.remove(index)}>{copy.remove}</button></div>)}<AddButton label={copy.addItem} onClick={() => items.append({ text: "" })} /></div>;
}

export function ServicesDetailContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.services-detail.servicesDetail` as const;
  const services = useFieldArray({ control, name: `${prefix}.services` });
  const models = useFieldArray({ control, name: `${prefix}.workModels` });
  return <div className={`grid gap-6 ${localizedInputDirection(locale)}`}>
    <SectionCard title={copy.sectionContent} icon={Layers3}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={copy.intro} className="md:col-span-2"><Textarea {...register(`${prefix}.intro`)} /></FormField>
        <FormField label={copy.status}><Input {...register(`${prefix}.activeLabel`)} /></FormField><FormField label={copy.audience}><Input {...register(`${prefix}.audienceLabel`)} /></FormField><FormField label={copy.approach}><Input {...register(`${prefix}.approachLabel`)} /></FormField><FormField label={copy.outcome}><Input {...register(`${prefix}.outcomeLabel`)} /></FormField>
        <FormField label={copy.ctaText}><Input {...register(`${prefix}.ctaText`)} /></FormField><FormField label={copy.ctaButton}><Input {...register(`${prefix}.ctaButton`)} /></FormField><FormField label={copy.toastMessage} className="md:col-span-2"><Input {...register(`${prefix}.ctaToast`)} /></FormField>
      </div>
    </SectionCard>
    <SectionCard title={copy.servicesList} icon={Layers3}><div className="grid gap-5">{services.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.servicesList} ${index + 1}`} removeLabel={copy.remove} onRemove={() => services.remove(index)}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.serviceId}><Input dir="ltr" {...register(`${prefix}.services.${index}.id`)} /></FormField><FormField label={copy.icon}><IconSelect name={`${prefix}.services.${index}.icon`} options={serviceIcons} /></FormField><FormField label={copy.tabLabel}><Input {...register(`${prefix}.services.${index}.tabLabel`)} /></FormField><FormField label={copy.title}><Input {...register(`${prefix}.services.${index}.title`)} /></FormField><FormField label={copy.subheading} className="md:col-span-2"><Input {...register(`${prefix}.services.${index}.subtitle`)} /></FormField><FormField label={copy.audience} className="md:col-span-2"><Textarea {...register(`${prefix}.services.${index}.audience`)} /></FormField><FormField label={copy.approach} className="md:col-span-2"><Textarea {...register(`${prefix}.services.${index}.approach`)} /></FormField><FormField label={copy.listTitle}><Input {...register(`${prefix}.services.${index}.listTitle`)} /></FormField><FormField label={copy.outcome} className="md:col-span-2"><Textarea {...register(`${prefix}.services.${index}.outcome`)} /></FormField><ServiceListItems locale={locale} serviceIndex={index} copy={copy} /></div></RepeatableCard>)}</div><AddButton label={copy.addService} onClick={() => services.append({ id: `service-${services.fields.length + 1}`, icon: "search", tabLabel: "", title: "", subtitle: "", audience: "", approach: "", listTitle: "", listItems: [{ text: "" }], outcome: "" })} /></SectionCard>
    <SectionCard title={copy.workModels} icon={Layers3}><FormField label={copy.title}><Input {...register(`${prefix}.workWaysTitle`)} /></FormField><div className="grid gap-4 md:grid-cols-2">{models.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.workModels} ${index + 1}`} removeLabel={copy.remove} onRemove={() => models.remove(index)}><div className="grid gap-4"><FormField label={copy.icon}><IconSelect name={`${prefix}.workModels.${index}.icon`} options={workIcons} /></FormField><FormField label={copy.title}><Input {...register(`${prefix}.workModels.${index}.title`)} /></FormField><FormField label={copy.description}><Textarea {...register(`${prefix}.workModels.${index}.description`)} /></FormField></div></RepeatableCard>)}</div><AddButton label={copy.addWorkModel} onClick={() => models.append({ icon: "compass", title: "", description: "" })} /></SectionCard>
    <SectionCard title={copy.bottomCta} icon={Layers3}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.title}><Input {...register(`${prefix}.bottomTitle`)} /></FormField><FormField label={copy.ctaButton}><Input {...register(`${prefix}.bottomButton`)} /></FormField><FormField label={copy.description} className="md:col-span-2"><Textarea {...register(`${prefix}.bottomDescription`)} /></FormField><FormField label={copy.toastMessage} className="md:col-span-2"><Input {...register(`${prefix}.bottomToast`)} /></FormField></div></SectionCard>
  </div>;
}

export function LifecycleContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.services-lifecycle.lifecycle` as const;
  const steps = useFieldArray({ control, name: `${prefix}.steps` });
  return <div className={localizedInputDirection(locale)}><SectionCard title={copy.lifecycleSteps} icon={Workflow}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.label}><Input {...register(`${prefix}.workflowLabel`)} /></FormField><FormField label={copy.status}><Input {...register(`${prefix}.activePhaseLabel`)} /></FormField></div><div className="grid gap-4">{steps.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.lifecycleSteps} ${index + 1}`} removeLabel={copy.remove} onRemove={() => steps.remove(index)}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.number}><Input dir="ltr" {...register(`${prefix}.steps.${index}.number`)} /></FormField><FormField label={copy.icon}><IconSelect name={`${prefix}.steps.${index}.icon`} options={lifecycleIcons} /></FormField><FormField label={copy.title}><Input {...register(`${prefix}.steps.${index}.title`)} /></FormField><FormField label={copy.description} className="md:col-span-2"><Textarea {...register(`${prefix}.steps.${index}.description`)} /></FormField></div></RepeatableCard>)}</div><AddButton label={copy.addLifecycleStep} onClick={() => steps.append({ number: String(steps.fields.length + 1).padStart(2, "0"), icon: "compass", title: "", description: "" })} /></SectionCard></div>;
}
