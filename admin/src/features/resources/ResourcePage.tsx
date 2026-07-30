import { myAxios } from "@/api/myAxios";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import FilterBar from "@/components/FilterBar";
import { PaginationLayout, type CollectionViewMode } from "@/components/PaginationLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { lang } from "@/context/global";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { mediaUrl } from "@/lib/media";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowUpRight, FilePenLine, ImageIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RESOURCE_CONFIGS, type ResourceName } from "./config";
import { fieldLabel, optionLabel, RESOURCE_COPY, type ResourceCopyText } from "./resource-copy";
import type { ApiEnvelope, Collection, ResourceConfig, ResourceRecord } from "./types";

function display(value: unknown, copy: ResourceCopyText) {
  if (typeof value === "boolean") return value ? copy.yes : copy.no;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return new Intl.DateTimeFormat(lang.value, { dateStyle: "medium" }).format(new Date(value));
  return value == null || value === "" ? "—" : optionLabel(lang.value, String(value));
}

const cardResources = new Set<ResourceName>(["projects", "services", "teamMembers", "jobTitles", "blog"]);

function localized(record: ResourceRecord, fields: string[]) {
  const translations = record.translations;
  const local = translations?.[lang.value] ?? translations?.en;
  for (const field of fields) {
    const value = local?.[field];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function recordTitle(record: ResourceRecord, config: ResourceConfig, copy: ResourceCopyText) {
  return localized(record, ["title", "fullName"]) || String(display(record[config.displayField], copy));
}

function recordSummary(record: ResourceRecord) {
  return localized(record, ["subtitle", "excerpt", "summary", "description", "bio"]);
}

function ResourceTable({ rows, config, copy, onDelete }: { rows: ResourceRecord[]; config: ResourceConfig; copy: ResourceCopyText; onDelete: (record: ResourceRecord) => void }) {
  return <Table><TableHeader><TableRow>{config.columns.map((column) => <TableHead key={column.field}>{fieldLabel(lang.value, column.field, column.label)}</TableHead>)}<TableHead className="text-right rtl:text-left">{copy.actions}</TableHead></TableRow></TableHeader><TableBody>{rows.map((record) => <TableRow key={record.id}>{config.columns.map((column) => <TableCell key={column.field}>{column.field === "status" ? <Badge>{display(record[column.field], copy)}</Badge> : display(record[column.field], copy)}</TableCell>)}<TableCell><div className="flex justify-end gap-1 rtl:justify-start"><Button asChild size="icon" variant="ghost"><Link aria-label={`${copy.edit} ${recordTitle(record, config, copy)}`} to={`${config.adminPath}/${record.id}/edit`}><FilePenLine className="size-4" /></Link></Button><Button size="icon" variant="ghost" className="text-destructive" aria-label={`${copy.remove} ${recordTitle(record, config, copy)}`} onClick={() => onDelete(record)}><Trash2 className="size-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table>;
}

function ResourceCard({ record, config, copy, onDelete }: { record: ResourceRecord; config: ResourceConfig; copy: ResourceCopyText; onDelete: (record: ResourceRecord) => void }) {
  const title = recordTitle(record, config, copy);
  const summary = recordSummary(record);
  const image = typeof record.coverImageUrl === "string" ? record.coverImageUrl : typeof record.imageUrl === "string" ? record.imageUrl : "";
  const progress = typeof record.progressPercent === "number" ? Math.min(Math.max(record.progressPercent, 0), 100) : null;

  return <article className="group flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-alt/10 bg-white shadow-[0_16px_50px_rgba(18,36,35,.06)] transition hover:-translate-y-1 hover:border-main/25 hover:shadow-[0_22px_65px_rgba(18,36,35,.1)] dark:border-white/10 dark:bg-card dark:shadow-black/20">
    {image ? <img src={mediaUrl(image)} alt="" className="h-40 w-full object-cover" /> : <div className="grid h-28 place-items-center bg-main/[.045] text-main"><ImageIcon className="size-8" /></div>}
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black tracking-[.18em] text-main uppercase">{config.key}</p>
          <h2 className="mt-2 truncate text-xl font-black text-alt dark:text-white">{title}</h2>
        </div>
        {typeof record.status === "string" ? <Badge className="bg-main/8 text-main">{display(record.status, copy)}</Badge> : typeof record.isActive === "boolean" ? <Badge className={record.isActive ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-alt/8 text-alt/55"}>{display(record.isActive, copy)}</Badge> : null}
      </div>
      {summary ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-alt/50 dark:text-white/50">{summary}</p> : null}
      <dl className="mt-5 grid gap-3 text-xs text-alt/55 dark:text-white/55">
        {config.columns.filter((column) => !["status", "isActive"].includes(column.field)).slice(0, 3).map((column) => <div key={column.field} className="flex items-center justify-between gap-3 rounded-2xl bg-main/[.04] px-3 py-2"><dt className="font-black text-alt/40 dark:text-white/40">{fieldLabel(lang.value, column.field, column.label)}</dt><dd className="truncate font-semibold">{display(record[column.field], copy)}</dd></div>)}
      </dl>
      {progress !== null ? <div className="mt-5"><div className="mb-2 flex items-center justify-between text-[10px] font-black text-alt/45 dark:text-white/45"><span>{fieldLabel(lang.value, "progressPercent", "Progress")}</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-main/10"><span className="block h-full rounded-full bg-main" style={{ width: `${progress}%` }} /></div></div> : null}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-alt/8 pt-4 dark:border-white/8">
        <Button asChild variant="outline"><Link to={`${config.adminPath}/${record.id}/edit`}><ArrowUpRight className="size-4 rtl:-scale-x-100" />{copy.edit}</Link></Button>
        <Button size="icon" variant="ghost" className="text-destructive" aria-label={`${copy.remove} ${title}`} onClick={() => onDelete(record)}><Trash2 className="size-4" /></Button>
      </div>
    </div>
  </article>;
}

export default function ResourcePage({ resource }: { resource: ResourceName }) {
  useSignals();
  const config: ResourceConfig = RESOURCE_CONFIGS[resource];
  const copy = RESOURCE_COPY[lang.value];
  const resourceCopy = copy.resources[resource];
  const supportsCards = cardResources.has(resource);
  const statusField = config.fields.find((field) => field.name === "status" && field.kind === "select");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState<CollectionViewMode>(supportsCards ? "grid" : "table");
  const [deleting, setDeleting] = useState<ResourceRecord>();
  const listPath = config.protectedRead ? config.endpoint : `${config.endpoint}/admin`;
  const list = useCustomQuery<Collection<ResourceRecord>>({
    queryKey: ["resource", config.key, page, search, status],
    queryFn: async () => (await myAxios.get<ApiEnvelope<Collection<ResourceRecord>>>(listPath, { params: { page, limit: 10, search: search || undefined, status: status || undefined, withTranslationsKey: true } })).data.materials,
  });
  const rows = list.data?.data ?? [];
  const remove = useCustomMutation<void, string>({
    mutationFn: (id) => myAxios.delete(`${config.endpoint}/${id}`), queryKey: ["resource", config.key], isSuccessLog: true,
    onSuccess: () => { setDeleting(undefined); if (list.data?.data.length === 1 && page > 1) setPage(page - 1); },
  });

  return <DashboardPageLayout title={resourceCopy.title} description={resourceCopy.description}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <FilterBar
        search={search}
        searchPlaceholder={`${copy.search} ${resourceCopy.title}`}
        selects={statusField?.options ? [{ name: "status", value: status, allLabel: copy.allStatuses, options: statusField.options.map((option) => ({ value: option, label: optionLabel(lang.value, option) })) }] : undefined}
        onApply={({ search, filters }) => { setSearch(search); setStatus(filters.status ?? ""); setPage(1); }}
      />
      {resource !== "inquiries" ? <Button asChild><Link to={`${config.adminPath}/new`}><Plus className="size-4" />{copy.add}</Link></Button> : null}
    </div>
    <PaginationLayout
      isLoading={list.isLoading}
      hasRows={Boolean(list.data?.data.length)}
      empty={<div className="p-12 text-center text-sm text-muted-foreground">{copy.noRecords}</div>}
      viewMode={supportsCards ? viewMode : undefined}
      onViewModeChange={supportsCards ? setViewMode : undefined}
      grid={supportsCards ? <div className="grid gap-5 p-5 sm:grid-cols-2 2xl:grid-cols-3">{rows.map((record) => <ResourceCard key={record.id} record={record} config={config} copy={copy} onDelete={setDeleting} />)}</div> : undefined}
      table={<ResourceTable rows={rows} config={config} copy={copy} onDelete={setDeleting} />}
      currentPage={page}
      pagesNumber={list.data?.pagesNumber ?? 0}
      onPageChange={setPage}
      className="bg-card"
    />
    <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(undefined)}><DialogContent><h2 className="text-lg font-bold">{copy.deleteTitle}</h2><p className="text-sm text-muted-foreground">{copy.deleteHint}</p><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDeleting(undefined)}>{copy.cancel}</Button><Button variant="destructive" disabled={remove.isPending} onClick={() => deleting && remove.mutate(deleting.id)}>{remove.isPending ? copy.deleting : copy.remove}</Button></div></DialogContent></Dialog>
  </DashboardPageLayout>;
}
