import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { lang } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { Funnel, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

export type FilterSelectConfig = {
  name: string;
  value: string;
  allLabel: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
};

function FilterBar({
  search,
  searchPlaceholder,
  selects = [],
  totalLabel,
  onApply,
  className,
}: {
  search: string;
  searchPlaceholder: string;
  selects?: FilterSelectConfig[];
  totalLabel?: string;
  onApply: (values: { search: string; filters: Record<string, string> }) => void;
  className?: string;
}) {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const selectValuesKey = selects.map((select) => `${select.name}:${select.value}`).join("|");
  const [draftSearch, setDraftSearch] = useState(search);
  const [draftFilters, setDraftFilters] = useState<Record<string, string>>(() => Object.fromEntries(selects.map((select) => [select.name, select.value])));
  const appliedFilterCount = (search.trim() ? 1 : 0) + selects.filter((select) => Boolean(select.value)).length;
  const draftFilterCount = (draftSearch.trim() ? 1 : 0) + selects.filter((select) => Boolean(draftFilters[select.name])).length;
  const hasDraftChanges = draftSearch.trim() !== search.trim() || selects.some((select) => (draftFilters[select.name] ?? "") !== select.value);

  useEffect(() => setDraftSearch(search), [search]);
  useEffect(() => setDraftFilters(Object.fromEntries(selects.map((select) => [select.name, select.value]))), [selectValuesKey]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    onApply({ search: draftSearch.trim(), filters: draftFilters });
  }

  function reset() {
    const cleared = Object.fromEntries(selects.map((select) => [select.name, ""]));
    setDraftSearch("");
    setDraftFilters(cleared);
    onApply({ search: "", filters: cleared });
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "relative min-w-0 flex-1 overflow-hidden rounded-3xl border border-white/80 bg-white/82 p-3 shadow-[0_18px_55px_rgba(18,36,35,.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-card/82 dark:shadow-black/20",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full border-[24px] border-main/[.045] dark:border-main/[.075]" />
      <div className="relative flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground rtl:right-3.5 rtl:left-auto" />
            <Input value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} placeholder={searchPlaceholder} className="h-12 rounded-2xl border-alt/10 bg-white/90 ps-10 shadow-sm dark:border-white/10 dark:bg-white/[.045]" />
          </div>
          {selects.map((select) => (
            <Select key={select.name} value={draftFilters[select.name] || "ALL"} onValueChange={(value) => setDraftFilters((current) => ({ ...current, [select.name]: value === "ALL" ? "" : value }))}>
              <SelectTrigger className={cn("h-12 w-full rounded-2xl border-alt/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-white/[.045] lg:w-52", select.className)}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{select.allLabel}</SelectItem>
                {select.options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {totalLabel ? <span className="me-1 whitespace-nowrap rounded-full bg-alt/[.045] px-3 py-2 text-xs font-black text-alt/45 dark:bg-white/[.045] dark:text-white/45">{totalLabel}</span> : null}
          <Badge className={cn("gap-1.5 bg-main/8 text-main", appliedFilterCount === 0 && "bg-alt/6 text-alt/45 dark:bg-white/6 dark:text-white/45")}>
            <Funnel className="size-3.5" />
            {appliedFilterCount} {copy.applied}
          </Badge>
          {hasDraftChanges ? <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300">{draftFilterCount} {copy.pending}</Badge> : null}
          <Button type="submit" disabled={!hasDraftChanges}><SlidersHorizontal className="size-4" />{copy.apply}</Button>
          <Button type="button" variant="outline" onClick={reset} disabled={appliedFilterCount === 0 && draftFilterCount === 0}><RotateCcw className="size-4" />{copy.reset}</Button>
        </div>
      </div>
    </form>
  );
}

export default FilterBar;
