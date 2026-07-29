import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/context/global";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BookOpenText, BriefcaseBusiness, Contact, Home, LayoutPanelTop, Sparkles, Users, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { PagesCopyText } from "../pages-copy";
import type { RoutePage } from "../types";

const icons: Record<string, LucideIcon> = { home: Home, services: LayoutPanelTop, work: BriefcaseBusiness, about: Sparkles, team: Users, blog: BookOpenText, "create-project": Contact, contact: Contact };

export function PageCard({ page, copy, locale }: { page: RoutePage; copy: PagesCopyText; locale: Lang }) {
  const Icon = icons[page.slug] ?? LayoutPanelTop;
  const translation = page.translations[locale] ?? page.translations.en;
  const status = page.status === "PUBLISHED" ? copy.published : page.status === "DRAFT" ? copy.draft : copy.archived;
  return <article className="group flex min-h-64 flex-col overflow-hidden rounded-3xl border border-alt/10 bg-white p-5 shadow-[0_16px_50px_rgba(18,36,35,.06)] transition hover:-translate-y-1 hover:border-main/25 hover:shadow-[0_22px_65px_rgba(18,36,35,.1)] dark:border-white/10 dark:bg-card dark:shadow-black/20 sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <span className="grid size-12 place-items-center rounded-2xl bg-main/8 text-main transition group-hover:bg-main group-hover:text-white"><Icon className="size-5" /></span>
      <Badge className={cn(page.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : page.status === "DRAFT" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-alt/8 text-alt/55")}>{status}</Badge>
    </div>
    <div className="mt-7 min-w-0 flex-1"><p className="text-[10px] font-black tracking-[.18em] text-main uppercase">/{page.slug === "home" ? "" : page.slug}</p><h2 className="mt-2 truncate text-xl font-black text-alt">{translation?.title || page.slug}</h2><p className="mt-2 line-clamp-2 text-xs leading-5 text-alt/45">{translation?.excerpt || copy.editorDescription}</p></div>
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-alt/8 pt-4 dark:border-white/8"><span className="text-[10px] text-muted-foreground">{copy.lastUpdated} · {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(page.updatedAt))}</span><Button asChild size="icon" variant="outline"><Link to={`/pages/${page.slug}`} aria-label={`${copy.openEditor}: ${translation?.title || page.slug}`}><ArrowUpRight className="size-4 rtl:-scale-x-100" /></Link></Button></div>
  </article>;
}
