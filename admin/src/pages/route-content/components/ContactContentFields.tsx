import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/pages/home/components/FormField";
import { SectionCard } from "@/pages/home/components/SectionCard";
import { Link, Mail, MapPin, MessageCircle, Plus, Trash2, Workflow } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RouteContentLocale } from "../types";
import { localizedInputDirection } from "@/lib/localized-direction";

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={onClick}><Trash2 className="size-4" />{label}</Button>;
}

export function ContactContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { register, control } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.contact-overview.contact` as const;
  const scenarios = useFieldArray({ control, name: `${prefix}.chatScenarios` });
  const steps = useFieldArray({ control, name: `${prefix}.processSteps` });
  const methods = useFieldArray({ control, name: `${prefix}.methods` });
  const links = useFieldArray({ control, name: `${prefix}.companyLinks` });

  return (
    <div className={`grid gap-5 ${localizedInputDirection(locale)}`}>
      <SectionCard title={copy.formContent} icon={Mail}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={copy.formTitle}><Input {...register(`${prefix}.formTitle`)} /></FormField>
          <FormField label={copy.successTitle}><Input {...register(`${prefix}.successTitle`)} /></FormField>
          <FormField label={copy.formSubtitle} className="md:col-span-2"><Textarea {...register(`${prefix}.formSubtitle`)} className="min-h-20" /></FormField>
          <FormField label={copy.privacyNote} className="md:col-span-2"><Textarea {...register(`${prefix}.privacy`)} className="min-h-20" /></FormField>
          <FormField label={copy.successMessage} className="md:col-span-2"><Textarea {...register(`${prefix}.successMessage`)} className="min-h-20" /></FormField>
          <FormField label={copy.errorMessage} className="md:col-span-2"><Textarea {...register(`${prefix}.errorMessage`)} className="min-h-20" /></FormField>
        </div>
        <div className="grid gap-4 border-t border-alt/10 pt-5 md:grid-cols-2">
          <FormField label={`${copy.fieldPlaceholders} · ${copy.formTitle}`}><Input {...register(`${prefix}.namePlaceholder`)} /></FormField>
          <FormField label={`${copy.fieldPlaceholders} · ${copy.officeInfo}`}><Input {...register(`${prefix}.organizationPlaceholder`)} /></FormField>
          <FormField label={`${copy.fieldPlaceholders} · Email`}><Input {...register(`${prefix}.emailPlaceholder`)} /></FormField>
          <FormField label={`${copy.fieldPlaceholders} · ${copy.value}`}><Input {...register(`${prefix}.phonePlaceholder`)} /></FormField>
          <FormField label={`${copy.fieldPlaceholders} · ${copy.userMessage}`} className="md:col-span-2"><Textarea {...register(`${prefix}.messagePlaceholder`)} /></FormField>
        </div>
      </SectionCard>

      <SectionCard title={copy.liveChat} icon={MessageCircle}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={copy.label}><Input {...register(`${prefix}.chatLabel`)} /></FormField>
          <FormField label={copy.status}><Input {...register(`${prefix}.chatStatus`)} /></FormField>
          <FormField label={copy.title}><Input {...register(`${prefix}.chatTitle`)} /></FormField>
          <FormField label={copy.action}><Input {...register(`${prefix}.chatAction`)} /></FormField>
          <FormField label={copy.intro} className="md:col-span-2"><Textarea {...register(`${prefix}.chatIntro`)} className="min-h-20" /></FormField>
          <FormField label={copy.botIntro} className="md:col-span-2"><Textarea {...register(`${prefix}.botIntro`)} className="min-h-20" /></FormField>
        </div>
        <div className="grid gap-4">
          {scenarios.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-2xl border border-alt/10 p-4 md:grid-cols-2">
              <input type="hidden" {...register(`${prefix}.chatScenarios.${index}.id`)} />
              <FormField label={copy.prompt}><Input {...register(`${prefix}.chatScenarios.${index}.prompt`)} /></FormField>
              <FormField label={copy.userMessage} className="md:col-span-2"><Textarea {...register(`${prefix}.chatScenarios.${index}.user`)} /></FormField>
              <FormField label={copy.reply} className="md:col-span-2"><Textarea {...register(`${prefix}.chatScenarios.${index}.reply`)} /></FormField>
              <FormField label={copy.impact} className="md:col-span-2"><Textarea {...register(`${prefix}.chatScenarios.${index}.impact`)} /></FormField>
              <FormField label={copy.metric}><Input {...register(`${prefix}.chatScenarios.${index}.metric`)} /></FormField>
              <FormField label={copy.metricLabel}><Input {...register(`${prefix}.chatScenarios.${index}.metricLabel`)} /></FormField>
              <div className="md:col-span-2"><RemoveButton label={copy.remove} onClick={() => scenarios.remove(index)} /></div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => scenarios.append({ id: `scenario-${scenarios.fields.length + 1}`, prompt: "", user: "", reply: "", impact: "", metric: "", metricLabel: "" })}><Plus className="size-4" />{copy.addScenario}</Button>
        </div>
      </SectionCard>

      <SectionCard title={copy.processSteps} icon={Workflow}>
        <FormField label={copy.sectionTitle}><Input {...register(`${prefix}.processTitle`)} /></FormField>
        <div className="grid gap-4">
          {steps.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-2xl border border-alt/10 p-4 md:grid-cols-[120px_1fr]">
              <FormField label={copy.number}><Input {...register(`${prefix}.processSteps.${index}.number`)} /></FormField>
              <FormField label={copy.title}><Input {...register(`${prefix}.processSteps.${index}.title`)} /></FormField>
              <FormField label={copy.description} className="md:col-span-2"><Textarea {...register(`${prefix}.processSteps.${index}.description`)} /></FormField>
              <div className="md:col-span-2"><RemoveButton label={copy.remove} onClick={() => steps.remove(index)} /></div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => steps.append({ number: "", title: "", description: "" })}><Plus className="size-4" />{copy.addStep}</Button>
        </div>
      </SectionCard>

      <SectionCard title={copy.contactMethods} icon={Mail}>
        <FormField label={copy.sectionTitle}><Input {...register(`${prefix}.methodsTitle`)} /></FormField>
        <div className="grid gap-4">
          {methods.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-2xl border border-alt/10 p-4 md:grid-cols-2">
              <FormField label={copy.type}><Input {...register(`${prefix}.methods.${index}.type`)} placeholder="email | phone" /></FormField>
              <FormField label={copy.label}><Input {...register(`${prefix}.methods.${index}.label`)} /></FormField>
              <FormField label={copy.value}><Input {...register(`${prefix}.methods.${index}.value`)} /></FormField>
              <FormField label={copy.href}><Input {...register(`${prefix}.methods.${index}.href`)} placeholder="mailto:..." /></FormField>
              <FormField label={copy.note} className="md:col-span-2"><Textarea {...register(`${prefix}.methods.${index}.note`)} /></FormField>
              <div className="md:col-span-2"><RemoveButton label={copy.remove} onClick={() => methods.remove(index)} /></div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => methods.append({ type: "", label: "", value: "", href: "", note: "" })}><Plus className="size-4" />{copy.addMethod}</Button>
        </div>
      </SectionCard>

      <SectionCard title={copy.officeInfo} icon={MapPin}>
        <div className="grid gap-4">
          <FormField label={copy.officeTitle}><Input {...register(`${prefix}.officeTitle`)} /></FormField>
          <FormField label={copy.officeAddress}><Textarea {...register(`${prefix}.officeAddress`)} className="min-h-20" /></FormField>
          <FormField label={copy.officeNote}><Textarea {...register(`${prefix}.officeNote`)} className="min-h-20" /></FormField>
          <FormField label={copy.bottomNotice}><Textarea {...register(`${prefix}.notice`)} className="min-h-20" /></FormField>
        </div>
      </SectionCard>

      <SectionCard title={copy.companyLinks} icon={Link}>
        <div className="grid gap-4">
          {links.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-2xl border border-alt/10 p-4 md:grid-cols-2">
              <FormField label={copy.label}><Input {...register(`${prefix}.companyLinks.${index}.label`)} /></FormField>
              <FormField label={copy.url}><Input {...register(`${prefix}.companyLinks.${index}.url`)} /></FormField>
              <div className="md:col-span-2"><RemoveButton label={copy.remove} onClick={() => links.remove(index)} /></div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => links.append({ label: "", url: "" })}><Plus className="size-4" />{copy.addLink}</Button>
        </div>
      </SectionCard>
    </div>
  );
}
