import { myAxios } from "@/api/myAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { Check, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { ResourceCopyText } from "./resource-copy";
import type { ApiEnvelope, Collection, FieldConfig, ResourceRecord } from "./types";

export function RelationField({ field, value, onChange, copy }: { field: FieldConfig; value: string; onChange: (value: string) => void; copy: ResourceCopyText }) {
  const relation = field.relation!;
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(value);
  const debounced = useDebounce(search, 350);
  const query = useCustomQuery<Collection<ResourceRecord>>({
    queryKey: ["relation-options", relation.endpoint, page, debounced],
    enabled: open,
    isErrLog: false,
    queryFn: async () => (await myAxios.get<ApiEnvelope<Collection<ResourceRecord>>>(relation.endpoint, { params: { page, limit: 5, search: debounced || undefined } })).data.materials,
  });

  useEffect(() => { setPage(1); }, [debounced]);
  useEffect(() => {
    const selected = query.data?.data.find((item) => String(item[relation.valueField]) === value);
    if (selected) setSelectedLabel(String(selected[relation.labelField] ?? selected[relation.valueField]));
  }, [query.data, relation.labelField, relation.valueField, value]);

  return <div className="relative">
    <div className="relative"><Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={open ? search : selectedLabel} onFocus={() => { setOpen(true); setSearch(""); }} onBlur={() => window.setTimeout(() => setOpen(false), 160)} onChange={(event) => { setSearch(event.target.value); setOpen(true); }} className="ps-9" autoComplete="off" /></div>
    {open ? <div className="absolute inset-x-0 top-[calc(100%+.4rem)] z-50 overflow-hidden rounded-2xl border border-alt/10 bg-background shadow-2xl">
      <div className="max-h-64 overflow-y-auto p-1.5">{query.isLoading ? <div className="grid place-items-center p-6"><Loader2 className="size-5 animate-spin text-main" /></div> : query.data?.data.length ? query.data.data.map((option) => { const optionValue = String(option[relation.valueField] ?? ""); const label = String(option[relation.labelField] ?? optionValue); return <button key={option.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(optionValue); setSelectedLabel(label); setOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm hover:bg-main/7"><span className="min-w-0 flex-1 truncate font-semibold text-alt dark:text-white">{label}</span>{optionValue === value ? <Check className="size-4 text-main" /> : null}</button>; }) : <p className="p-5 text-center text-xs text-muted-foreground">{copy.noRecords}</p>}</div>
      {(query.data?.pagesNumber ?? 0) > 1 ? <div className="flex items-center justify-between border-t p-2"><Button type="button" size="icon" variant="ghost" disabled={page <= 1} onMouseDown={(event) => event.preventDefault()} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="size-4 rtl:rotate-180" /></Button><span className="text-xs text-muted-foreground">{page} / {query.data?.pagesNumber}</span><Button type="button" size="icon" variant="ghost" disabled={page >= (query.data?.pagesNumber ?? 1)} onMouseDown={(event) => event.preventDefault()} onClick={() => setPage((current) => current + 1)}><ChevronRight className="size-4 rtl:rotate-180" /></Button></div> : null}
    </div> : null}
  </div>;
}
