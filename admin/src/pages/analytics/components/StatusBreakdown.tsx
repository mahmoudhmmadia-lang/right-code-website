import type { StatusCount } from "../types";

export function StatusBreakdown({ title, rows, empty, getLabel }: { title: string; rows: StatusCount[]; empty: string; getLabel: (status: string) => string }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return (
    <section className="rounded-3xl border border-alt/10 bg-white p-5 shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card dark:shadow-black/20 sm:p-7">
      <h2 className="mb-6 font-black text-alt dark:text-white">{title}</h2>
      {rows.length ? <div className="space-y-5">
        {rows.map((row) => {
          const percentage = total ? Math.round((row.count / total) * 100) : 0;
          return <div key={row.status}>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-alt/65 dark:text-white/65">{getLabel(row.status)}</span>
              <span className="font-black text-alt dark:text-white">{row.count} <span className="text-alt/30 dark:text-white/30">· {percentage}%</span></span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-main/8"><div className="h-full rounded-full bg-main" style={{ width: `${percentage}%` }} /></div>
          </div>;
        })}
      </div> : <p className="py-10 text-center text-sm text-muted-foreground">{empty}</p>}
    </section>
  );
}
