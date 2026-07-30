import { myAxios } from "@/api/myAxios";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { lang } from "@/context/global";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowLeft, FilePenLine, Plus, Save } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FieldControl, type DraftValue } from "./FieldControl";
import { MultilingualFields, type TranslationDrafts } from "./MultilingualFields";
import { RESOURCE_CONFIGS, type ResourceName } from "./config";
import { fieldGroupLabel, fieldLabel, RESOURCE_COPY } from "./resource-copy";
import { fieldGroups } from "./field-groups";
import { CONTENT_LOCALES, type ApiEnvelope, type FieldConfig, type ResourceConfig, type ResourceRecord } from "./types";

type Draft = Record<string, DraftValue>;

function initialValue(field: FieldConfig, value?: unknown): DraftValue {
  if (field.kind === "boolean") return Boolean(value);
  if (field.kind === "list") return Array.isArray(value) ? value.map(String) : [];
  if (field.kind === "date" && value) return String(value).slice(0, 10);
  if (value != null) return String(value);
  if (field.kind === "select") return field.options?.[0] ?? "";
  if (field.kind === "number") return "0";
  return "";
}

function createDraft(config: ResourceConfig, record?: ResourceRecord) {
  const base = Object.fromEntries(config.fields.map((field) => [field.name, initialValue(field, record?.[field.name])])) as Draft;
  const translations = Object.fromEntries(CONTENT_LOCALES.map((locale) => {
    const source = record?.translations?.[locale];
    return [locale, Object.fromEntries((config.translationFields ?? []).map((field) => [field.name, initialValue(field, source?.[field.name])]))];
  })) as TranslationDrafts;
  return { base, translations };
}

function parseField(field: FieldConfig, value: DraftValue) {
  if (value instanceof File || field.kind === "boolean") return value;
  if (field.kind === "list") return Array.isArray(value) ? value.map((item) => item.trim()).filter(Boolean) : [];
  const text = String(value).trim();
  if (!text) return undefined;
  if (field.kind === "number") return Number(text);
  if (field.kind === "date") return new Date(`${text}T00:00:00.000Z`).toISOString();
  return text;
}

function payloadFrom(config: ResourceConfig, base: Draft, translations: TranslationDrafts) {
  const payload = Object.fromEntries(config.fields.flatMap((field) => {
    const value = parseField(field, base[field.name]);
    return value === undefined ? [] : [[field.name, value]];
  })) as Record<string, unknown>;
  if (config.translationFields?.length) {
    payload.translations = Object.fromEntries(CONTENT_LOCALES.map((locale) => [locale, Object.fromEntries(config.translationFields!.flatMap((field) => {
      const value = parseField(field, translations[locale][field.name]);
      return value === undefined ? [] : [[field.name, value]];
    }))]));
  }
  if (!Object.values(payload).some((value) => value instanceof File)) return payload;
  const formData = new FormData();
  const serialized: Record<string, unknown> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) formData.append(key, value);
    else serialized[key] = value;
  });
  formData.append("__payload", JSON.stringify(serialized));
  return formData;
}

export default function ResourceEditorPage({ resource }: { resource: ResourceName }) {
  useSignals();
  const config = RESOURCE_CONFIGS[resource] as ResourceConfig;
  const copy = RESOURCE_COPY[lang.value];
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const record = useCustomQuery<ResourceRecord>({
    queryKey: ["resource-record", config.key, id], enabled: editing,
    queryFn: async () => (await myAxios.get<ApiEnvelope<ResourceRecord>>(`${config.endpoint}/${id}`, { params: { withTranslationsKey: true } })).data.materials,
  });
  const seed = useMemo(() => createDraft(config, record.data), [config, record.data]);
  if (editing && record.isLoading) return <DashboardPageLayout title={copy.edit}><Loader fullScreen={false} /></DashboardPageLayout>;
  return <ResourceEditorForm key={record.data?.id ?? "new"} resource={resource} config={config} seed={seed} record={record.data} onDone={() => navigate(config.adminPath)} />;
}

function ResourceEditorForm({ resource, config, seed, record, onDone }: { resource: ResourceName; config: ResourceConfig; seed: ReturnType<typeof createDraft>; record?: ResourceRecord; onDone: () => void }) {
  const copy = RESOURCE_COPY[lang.value];
  const [base, setBase] = useState(seed.base);
  const [translations, setTranslations] = useState(seed.translations);
  const [error, setError] = useState("");
  const save = useCustomMutation<ResourceRecord, Record<string, unknown> | FormData>({
    mutationFn: (payload) => record ? myAxios.patch(`${config.endpoint}/${record.id}`, payload) : myAxios.post(config.endpoint, payload),
    queryKey: ["resource", config.key], isSuccessLog: true, onSuccess: onDone,
  });
  function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    try {
      for (const field of config.fields.filter((item) => item.required)) if (!String(base[field.name] ?? "").trim()) throw new Error(`${fieldLabel(lang.value, field.name, field.label)} ${copy.required}.`);
      for (const locale of CONTENT_LOCALES) for (const field of (config.translationFields ?? []).filter((item) => item.required)) if (!String(translations[locale][field.name] ?? "").trim()) throw new Error(`${fieldLabel(lang.value, field.name, field.label)} ${copy.requiredFor} ${copy[locale]}.`);
      save.mutate(payloadFrom(config, base, translations));
    } catch (reason) { setError(reason instanceof Error ? reason.message : copy.invalid); }
  }
  const Icon = record ? FilePenLine : Plus;
  return <DashboardPageLayout title={`${record ? copy.edit : copy.add} · ${copy.resources[resource].title}`} description={copy.formHint}>
    <Button asChild variant="ghost" className="w-fit text-main"><Link to={config.adminPath}><ArrowLeft className="size-4 rtl:rotate-180" />{copy.cancel}</Link></Button>
    <form onSubmit={submit} className="mx-auto grid w-full max-w-6xl gap-6">
      <header className="flex items-center gap-4 rounded-3xl border bg-gradient-to-r from-main/[.08] to-background p-6"><span className="grid size-12 place-items-center rounded-2xl bg-main text-white"><Icon className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[.18em] text-main">{record ? copy.updateRecord : copy.newRecord}</p><h2 className="text-2xl font-black text-alt">{copy.resources[resource].title}</h2></div></header>
      <section className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6"><div className="mb-5 border-b pb-4"><h3 className="font-bold text-alt">{copy.general}</h3><p className="mt-1 text-xs text-muted-foreground">{copy.generalHint}</p></div><div className="grid gap-7">{fieldGroups(config.fields).map((group) => <div key={group.key}>{group.key !== "default" ? <h4 className="mb-4 text-xs font-black tracking-[.12em] text-main uppercase">{fieldGroupLabel(lang.value, group.key)}</h4> : null}<div className="grid gap-5 md:grid-cols-2">{group.items.map((field) => <FieldControl key={field.name} field={field} value={base[field.name]} adminLocale={lang.value} copy={copy} onChange={(value) => setBase((current) => ({ ...current, [field.name]: value }))} />)}</div></div>)}</div></section>
      {config.translationFields?.length ? <MultilingualFields fields={config.translationFields} value={translations} copy={copy} adminLocale={lang.value} onChange={(locale, field, value) => setTranslations((current) => ({ ...current, [locale]: { ...current[locale], [field]: value } }))} /> : null}
      {error ? <p className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</p> : null}
      <footer className="sticky bottom-3 flex justify-end gap-3 rounded-2xl border bg-background/90 p-4 shadow-xl backdrop-blur"><Button asChild type="button" variant="outline"><Link to={config.adminPath}>{copy.cancel}</Link></Button><Button type="submit" disabled={save.isPending} className="bg-main text-white"><Save className="size-4" />{save.isPending ? copy.saving : record ? copy.saveChanges : copy.createRecord}</Button></footer>
    </form>
  </DashboardPageLayout>;
}
