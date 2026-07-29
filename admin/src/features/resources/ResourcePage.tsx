import { myAxios } from "@/api/myAxios";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { lang } from "@/context/global";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { useSignals } from "@preact/signals-react/runtime";
import { FilePenLine, Plus, Search, Trash2 } from "lucide-react";
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

export default function ResourcePage({ resource }: { resource: ResourceName }) {
  useSignals();
  const config: ResourceConfig = RESOURCE_CONFIGS[resource];
  const copy = RESOURCE_COPY[lang.value];
  const resourceCopy = copy.resources[resource];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [deleting, setDeleting] = useState<ResourceRecord>();
  const listPath = config.protectedRead ? config.endpoint : `${config.endpoint}/admin`;
  const list = useCustomQuery<Collection<ResourceRecord>>({
    queryKey: ["resource", config.key, page, debouncedSearch],
    queryFn: async () => (await myAxios.get<ApiEnvelope<Collection<ResourceRecord>>>(listPath, { params: { page, limit: 10, search: debouncedSearch || undefined, withTranslationsKey: true } })).data.materials,
  });
  const remove = useCustomMutation<void, string>({
    mutationFn: (id) => myAxios.delete(`${config.endpoint}/${id}`), queryKey: ["resource", config.key], isSuccessLog: true,
    onSuccess: () => { setDeleting(undefined); if (list.data?.data.length === 1 && page > 1) setPage(page - 1); },
  });

  return <DashboardPageLayout title={resourceCopy.title} description={resourceCopy.description}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground rtl:right-3 rtl:left-auto" /><Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={`${copy.search} ${resourceCopy.title}`} className="ps-9" /></div>
      {resource !== "inquiries" ? <Button asChild><Link to={`${config.adminPath}/new`}><Plus className="size-4" />{copy.add}</Link></Button> : null}
    </div>
    {list.isLoading ? <Loader fullScreen={false} /> : <section className="overflow-hidden rounded-3xl border border-alt/10 bg-card shadow-[0_16px_50px_rgba(18,36,35,.06)] dark:border-white/10 dark:shadow-black/20">
      {list.data?.data.length ? <Table><TableHeader><TableRow>{config.columns.map((column) => <TableHead key={column.field}>{fieldLabel(lang.value, column.field, column.label)}</TableHead>)}<TableHead className="text-right rtl:text-left">{copy.actions}</TableHead></TableRow></TableHeader><TableBody>{list.data.data.map((record) => <TableRow key={record.id}>{config.columns.map((column) => <TableCell key={column.field}>{column.field === "status" ? <Badge>{display(record[column.field], copy)}</Badge> : display(record[column.field], copy)}</TableCell>)}<TableCell><div className="flex justify-end gap-1 rtl:justify-start"><Button asChild size="icon" variant="ghost"><Link aria-label={`${copy.edit} ${display(record[config.displayField], copy)}`} to={`${config.adminPath}/${record.id}/edit`}><FilePenLine className="size-4" /></Link></Button><Button size="icon" variant="ghost" className="text-destructive" aria-label={`${copy.remove} ${display(record[config.displayField], copy)}`} onClick={() => setDeleting(record)}><Trash2 className="size-4" /></Button></div></TableCell></TableRow>)}</TableBody></Table> : <div className="p-12 text-center text-sm text-muted-foreground">{copy.noRecords}</div>}
      <Pagination currentPage={page} pagesNumber={list.data?.pagesNumber ?? 0} onPageChange={setPage} />
    </section>}
    <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(undefined)}><DialogContent><h2 className="text-lg font-bold">{copy.deleteTitle}</h2><p className="text-sm text-muted-foreground">{copy.deleteHint}</p><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDeleting(undefined)}>{copy.cancel}</Button><Button variant="destructive" disabled={remove.isPending} onClick={() => deleting && remove.mutate(deleting.id)}>{remove.isPending ? copy.deleting : copy.remove}</Button></div></DialogContent></Dialog>
  </DashboardPageLayout>;
}
