import type { ReactNode } from "react";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { lang } from "@/context/global";
import { ADMIN_TRANSLATOR } from "@/lang/admin";
import { cn } from "@/lib/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { Grid2X2, List, Table2 } from "lucide-react";

export type CollectionViewMode = "grid" | "list" | "table";

function ViewModeToggle({
  value,
  onChange,
  modes = ["grid", "table"],
}: {
  value: CollectionViewMode;
  onChange: (value: CollectionViewMode) => void;
  modes?: CollectionViewMode[];
}) {
  useSignals();
  const copy = ADMIN_TRANSLATOR[lang.value];
  const optionsByMode: Record<CollectionViewMode, { label: string; icon: typeof Grid2X2 }> = {
    grid: { label: copy.grid, icon: Grid2X2 },
    list: { label: copy.list, icon: List },
    table: { label: copy.table, icon: Table2 },
  };
  const options = modes.map((mode) => [
    mode,
    optionsByMode[mode],
  ] as const);

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-alt/10 bg-white p-1 dark:border-white/10 dark:bg-white/[.045]" aria-label={copy.displayAs}>
      {options.map(([mode, option]) => {
        const Icon = option.icon;
        const active = mode === value;
        return (
          <Button
            key={mode}
            type="button"
            variant={active ? "default" : "ghost"}
            size="sm"
            className={cn("h-9 px-3", !active && "text-alt/55 dark:text-white/55")}
            aria-pressed={active}
            onClick={() => onChange(mode)}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

function PaginationLayout({
  title,
  count,
  actions,
  isLoading,
  hasRows,
  empty,
  viewMode,
  onViewModeChange,
  grid,
  list,
  table,
  children,
  currentPage,
  pagesNumber,
  onPageChange,
  className,
  headerClassName,
  contentClassName,
}: {
  title?: string;
  count?: number;
  actions?: ReactNode;
  isLoading?: boolean;
  hasRows: boolean;
  empty: ReactNode;
  viewMode?: CollectionViewMode;
  onViewModeChange?: (value: CollectionViewMode) => void;
  grid?: ReactNode;
  list?: ReactNode;
  table?: ReactNode;
  children?: ReactNode;
  currentPage: number;
  pagesNumber: number;
  onPageChange: (page: number) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}) {
  const viewContent: Partial<Record<CollectionViewMode, ReactNode>> = { grid, list, table };
  const viewModes = (["grid", "list", "table"] as CollectionViewMode[]).filter((mode) => viewContent[mode]);
  const canToggleView = Boolean(viewMode && onViewModeChange && viewModes.length > 1);
  const content = canToggleView ? viewContent[viewMode as CollectionViewMode] : children ?? grid ?? list ?? table;

  return (
    <section className={cn("overflow-hidden rounded-3xl border border-alt/10 bg-white/75 shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card/80 dark:shadow-black/20", className)}>
      {(title || typeof count === "number" || actions || canToggleView) ? (
        <header className={cn("flex flex-col gap-3 border-b border-alt/10 px-5 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between", headerClassName)}>
          <div className="flex items-center gap-3">
            {title ? <h2 className="font-black text-alt dark:text-white">{title}</h2> : null}
            {typeof count === "number" ? <span className="grid min-w-7 place-items-center rounded-full bg-main px-2 py-1 text-[10px] font-black text-white">{count}</span> : null}
          </div>
          {(actions || canToggleView) ? (
            <div className="flex flex-wrap items-center gap-2">
              {actions}
              {canToggleView ? <ViewModeToggle value={viewMode as CollectionViewMode} onChange={onViewModeChange as (value: CollectionViewMode) => void} modes={viewModes} /> : null}
            </div>
          ) : null}
        </header>
      ) : null}
      {isLoading ? <Loader fullScreen={false} /> : hasRows ? <div className={contentClassName}>{content}</div> : empty}
      <Pagination currentPage={currentPage} pagesNumber={pagesNumber} onPageChange={onPageChange} />
    </section>
  );
}

export { PaginationLayout, ViewModeToggle };
