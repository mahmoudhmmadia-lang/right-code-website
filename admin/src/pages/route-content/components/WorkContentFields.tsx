import { BookOpenText, BriefcaseBusiness, CircleAlert, FolderKanban, Navigation, Tags } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { localizedInputDirection } from "@/lib/localized-direction";
import { SectionCard } from "@/pages/home/components/SectionCard";
import type { RouteContentCopyText } from "../route-content-copy";
import type { RouteContentFormValues, RouteContentLocale } from "../types";
import { AddButton, FormField, Input, RepeatableCard, Textarea } from "./RepeatableControls";

const caseIcons = ["public", "ngo", "private", "cross"];

function CaseResults({ locale, caseIndex, copy }: { locale: RouteContentLocale; caseIndex: number; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const name = `translations.${locale}.work-case-studies.caseStudies.cases.${caseIndex}.results` as const;
  const results = useFieldArray({ control, name });
  return <div className="grid gap-3 md:col-span-2"><h4 className="text-sm font-black text-alt">{copy.results}</h4>{results.fields.map((field, index) => <div key={field.id} className="flex gap-2"><Input {...register(`${name}.${index}.text`)} /><button type="button" className="text-sm font-bold text-destructive" onClick={() => results.remove(index)}>{copy.remove}</button></div>)}<AddButton label={copy.addResult} onClick={() => results.append({ text: "" })} /></div>;
}

export function ProjectsShowcaseContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.work-projects.projectsShowcase` as const;
  const statuses = useFieldArray({ control, name: `${prefix}.statusLabels` });
  return <div className={`grid gap-6 xl:grid-cols-2 ${localizedInputDirection(locale)}`}>
    <SectionCard title={copy.projectListingBlock} icon={FolderKanban}>
      <div className="grid gap-4 md:grid-cols-2">
      <FormField label={copy.projectDetails}><Input {...register(`${prefix}.detailsLabel`)} /></FormField>
      <FormField label={copy.featured}><Input {...register(`${prefix}.featuredLabel`)} /></FormField>
      </div>
    </SectionCard>
    <SectionCard title={copy.projectNavigationBlock} icon={Navigation}>
      <div className="grid gap-4 md:grid-cols-2">
      <FormField label={copy.visitProject}><Input {...register(`${prefix}.visitLabel`)} /></FormField>
      <FormField label={copy.backToWork}><Input {...register(`${prefix}.backLabel`)} /></FormField>
      <FormField label={copy.nextProject}><Input {...register(`${prefix}.nextProjectLabel`)} /></FormField>
      <FormField label={copy.allProjects}><Input {...register(`${prefix}.allProjectsLabel`)} /></FormField>
      </div>
    </SectionCard>
    <SectionCard title={copy.projectFactsBlock} icon={Tags}>
      <div className="grid gap-4 md:grid-cols-2">
      <FormField label={copy.client}><Input {...register(`${prefix}.clientLabel`)} /></FormField>
      <FormField label={copy.year}><Input {...register(`${prefix}.yearLabel`)} /></FormField>
      <FormField label={copy.servicesDelivered}><Input {...register(`${prefix}.servicesLabel`)} /></FormField>
      <FormField label={copy.technologies}><Input {...register(`${prefix}.technologiesLabel`)} /></FormField>
      </div>
    </SectionCard>
    <SectionCard title={copy.projectStoryBlock} icon={BookOpenText}>
      <div className="grid gap-4 md:grid-cols-2">
      <FormField label={copy.context}><Input {...register(`${prefix}.contextLabel`)} /></FormField>
      <FormField label={copy.challenges}><Input {...register(`${prefix}.challengeLabel`)} /></FormField>
      <FormField label={copy.solution}><Input {...register(`${prefix}.solutionLabel`)} /></FormField>
      <FormField label={copy.elements}><Input {...register(`${prefix}.capabilitiesLabel`)} /></FormField>
      <FormField label={copy.results}><Input {...register(`${prefix}.impactLabel`)} /></FormField>
      </div>
    </SectionCard>
    <SectionCard title={copy.projectStatesBlock} icon={CircleAlert}>
      <FormField label={copy.emptyMessage}><Textarea {...register(`${prefix}.emptyMessage`)} /></FormField>
      <div className="grid gap-4 md:grid-cols-2">
      <FormField label={copy.notFoundTitle}><Input {...register(`${prefix}.notFoundTitle`)} /></FormField>
      <FormField label={copy.notFoundMessage}><Input {...register(`${prefix}.notFoundMessage`)} /></FormField>
      </div>
    </SectionCard>
    <SectionCard title={copy.projectStatusBlock} icon={Tags}>
      <div className="grid gap-3">{statuses.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.statusLabels} ${index + 1}`} removeLabel={copy.remove} onRemove={() => statuses.remove(index)}><input type="hidden" {...register(`${prefix}.statusLabels.${index}.value`)} /><FormField label={copy.label}><Input {...register(`${prefix}.statusLabels.${index}.label`)} /></FormField></RepeatableCard>)}<AddButton label={copy.addStatus} onClick={() => statuses.append({ value: `STATUS_${statuses.fields.length + 1}`, label: "" })} /></div>
    </SectionCard>
  </div>;
}

export function CaseStudiesContentFields({ locale, copy }: { locale: RouteContentLocale; copy: RouteContentCopyText }) {
  const { control, register } = useFormContext<RouteContentFormValues>();
  const prefix = `translations.${locale}.work-case-studies.caseStudies` as const;
  const cases = useFieldArray({ control, name: `${prefix}.cases` });
  const common = useFieldArray({ control, name: `${prefix}.commonItems` });
  return <div className={`grid gap-6 ${localizedInputDirection(locale)}`}>
    <SectionCard title={copy.sectionContent} icon={BriefcaseBusiness}><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.status}><Input {...register(`${prefix}.activeLabel`)} /></FormField><FormField label={copy.context}><Input {...register(`${prefix}.contextLabel`)} /></FormField><FormField label={copy.challenges}><Input {...register(`${prefix}.challengesLabel`)} /></FormField><FormField label={copy.solution}><Input {...register(`${prefix}.solutionLabel`)} /></FormField><FormField label={copy.elements}><Input {...register(`${prefix}.elementsLabel`)} /></FormField><FormField label={copy.results}><Input {...register(`${prefix}.resultsLabel`)} /></FormField><FormField label={copy.sectionTitle}><Input {...register(`${prefix}.commonTitle`)} /></FormField><FormField label={copy.ctaText} className="md:col-span-2"><Textarea {...register(`${prefix}.ctaText`)} /></FormField><FormField label={copy.primaryButton}><Input {...register(`${prefix}.primaryButton`)} /></FormField><FormField label={copy.toastMessage}><Input {...register(`${prefix}.primaryToast`)} /></FormField><FormField label={copy.secondaryButton}><Input {...register(`${prefix}.secondaryButton`)} /></FormField><FormField label={copy.toastMessage}><Input {...register(`${prefix}.secondaryToast`)} /></FormField></div></SectionCard>
    <SectionCard title={copy.commonItems} icon={BriefcaseBusiness}><div className="grid gap-3">{common.fields.map((field, index) => <div key={field.id} className="flex gap-2"><Input {...register(`${prefix}.commonItems.${index}.text`)} /><button type="button" className="text-sm font-bold text-destructive" onClick={() => common.remove(index)}>{copy.remove}</button></div>)}<AddButton label={copy.addItem} onClick={() => common.append({ text: "" })} /></div></SectionCard>
    <SectionCard title={copy.caseStudies} icon={BriefcaseBusiness}><div className="grid gap-5">{cases.fields.map((field, index) => <RepeatableCard key={field.id} title={`${copy.caseStudies} ${index + 1}`} removeLabel={copy.remove} onRemove={() => cases.remove(index)}><input type="hidden" {...register(`${prefix}.cases.${index}.id`)} /><div className="grid gap-4 md:grid-cols-2"><FormField label={copy.icon}><Controller control={control} name={`${prefix}.cases.${index}.icon`} render={({ field: select }) => <Select value={select.value} onValueChange={select.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{caseIcons.map((icon) => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}</SelectContent></Select>} /></FormField><FormField label={copy.tabLabel}><Input {...register(`${prefix}.cases.${index}.tabLabel`)} /></FormField><FormField label={copy.title}><Input {...register(`${prefix}.cases.${index}.title`)} /></FormField><FormField label={copy.subheading} className="md:col-span-2"><Input {...register(`${prefix}.cases.${index}.subtitle`)} /></FormField><FormField label={copy.context} className="md:col-span-2"><Textarea {...register(`${prefix}.cases.${index}.context`)} /></FormField><FormField label={copy.challenges} className="md:col-span-2"><Textarea {...register(`${prefix}.cases.${index}.challenges`)} /></FormField><FormField label={copy.solution} className="md:col-span-2"><Textarea {...register(`${prefix}.cases.${index}.solution`)} /></FormField><FormField label={copy.elements} className="md:col-span-2"><Textarea {...register(`${prefix}.cases.${index}.elements`)} /></FormField><CaseResults locale={locale} caseIndex={index} copy={copy} /></div></RepeatableCard>)}</div><AddButton label={copy.addCaseStudy} onClick={() => cases.append({ id: `case-${cases.fields.length + 1}`, icon: "public", tabLabel: "", title: "", subtitle: "", context: "", challenges: "", solution: "", elements: "", results: [{ text: "" }] })} /></SectionCard>
  </div>;
}
