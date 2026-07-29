import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function SectionCard({ title, description, icon: Icon, children, className }: { title: string; description?: string; icon: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <section className={cn("overflow-hidden rounded-3xl border border-alt/10 bg-background shadow-[0_16px_50px_rgba(18,36,35,.07)] dark:border-white/10 dark:shadow-black/20", className)}>
      <header className="flex items-center gap-4 border-b border-alt/10 bg-linear-to-r from-main/[.075] to-transparent px-5 py-4 sm:px-7">
        <span className="grid size-11 place-items-center rounded-2xl bg-main text-white shadow-lg shadow-main/20"><Icon className="size-5" /></span>
        <div><h2 className="font-black text-alt dark:text-white">{title}</h2>{description ? <p className="mt-0.5 text-xs text-alt/45 dark:text-white/45">{description}</p> : null}</div>
      </header>
      <div className="grid gap-5 p-5 sm:p-7">{children}</div>
    </section>
  );
}
