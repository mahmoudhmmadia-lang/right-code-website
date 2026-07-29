import type { Lang } from "@/context/global";
import type { AnalyticsCopyText } from "../analytics-copy";
import type { ActivityPoint } from "../types";

export function ActivityChart({ data, copy, locale }: { data: ActivityPoint[]; copy: AnalyticsCopyText; locale: Lang }) {
  const ceiling = Math.max(...data.map((item) => item.count), 1);
  return (
    <section className="rounded-3xl border border-alt/10 bg-white p-5 shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card dark:shadow-black/20 sm:p-7">
      <div className="mb-8">
        <h2 className="font-black text-alt dark:text-white">{copy.activity}</h2>
        <p className="mt-1 text-xs text-alt/45 dark:text-white/45">{copy.activityHint}</p>
      </div>
      {data.length ? (
        <div className="flex h-56 items-end gap-2 sm:gap-3" aria-label={copy.activity}>
          {data.map((item) => (
            <div key={item.date} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
              <span className="text-center text-[10px] font-black text-alt/35 opacity-0 transition group-hover:opacity-100 dark:text-white/40">{item.count}</span>
              <div className="relative min-h-1 w-full overflow-hidden rounded-t-xl bg-main/8" style={{ height: `${Math.max((item.count / ceiling) * 82, 4)}%` }}>
                <div className="absolute inset-0 bg-linear-to-t from-main to-[#35aeb1]" />
              </div>
              <span className="truncate text-center text-[9px] font-semibold text-alt/40 dark:text-white/40 sm:text-[10px]">{new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(item.date))}</span>
            </div>
          ))}
        </div>
      ) : <p className="grid h-56 place-items-center text-sm text-muted-foreground">{copy.noData}</p>}
    </section>
  );
}
