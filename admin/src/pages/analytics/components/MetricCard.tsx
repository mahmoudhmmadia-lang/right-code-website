import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, icon: Icon, accent = false }: { label: string; value: string | number; icon: LucideIcon; accent?: boolean }) {
  return (
    <article className={accent ? "relative overflow-hidden rounded-3xl bg-main p-5 text-white shadow-xl shadow-main/20" : "rounded-3xl border border-alt/10 bg-white p-5 shadow-[0_14px_45px_rgba(18,36,35,.06)] dark:border-white/10 dark:bg-card dark:shadow-black/20"}>
      <div className={accent ? "mb-6 grid size-11 place-items-center rounded-2xl bg-white/12" : "mb-6 grid size-11 place-items-center rounded-2xl bg-main/8 text-main"}>
        <Icon className="size-5" />
      </div>
      <p className={accent ? "text-3xl font-black tracking-tight" : "text-3xl font-black tracking-tight text-alt dark:text-white"}>{value}</p>
      <p className={accent ? "mt-1 text-xs font-semibold text-white/65" : "mt-1 text-xs font-semibold text-alt/45 dark:text-white/45"}>{label}</p>
    </article>
  );
}
