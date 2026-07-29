import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import { lang } from "@/context/global";
import { useSignals } from "@preact/signals-react/runtime";
import { CheckCircle2, Files } from "lucide-react";
import { PAGES_COPY } from "./pages-copy";
import { PageCard } from "./components/PageCard";
import { usePages } from "./usePages";

export default function Pages() {
  useSignals();
  const copy = PAGES_COPY[lang.value];
  const { list } = usePages();
  const rows = [...(list.data?.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const published = rows.filter((page) => page.status === "PUBLISHED").length;

  return <DashboardPageLayout title={copy.title} description={copy.description}>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-center gap-4 rounded-2xl border border-alt/10 bg-white p-4 dark:border-white/10 dark:bg-card"><span className="grid size-11 place-items-center rounded-xl bg-main/8 text-main"><Files className="size-5" /></span><span><strong className="block text-xl font-black text-alt">{rows.length}</strong><small className="text-muted-foreground">{copy.pages}</small></span></div>
      <div className="flex items-center gap-4 rounded-2xl border border-alt/10 bg-white p-4 dark:border-white/10 dark:bg-card"><span className="grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"><CheckCircle2 className="size-5" /></span><span><strong className="block text-xl font-black text-alt">{published}</strong><small className="text-muted-foreground">{copy.published}</small></span></div>
    </div>
    {list.isLoading ? <Loader fullScreen={false} /> : rows.length ? <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">{rows.map((page) => <PageCard key={page.id} page={page} copy={copy} locale={lang.value} />)}</div> : <div className="rounded-3xl border border-dashed border-alt/15 p-14 text-center text-muted-foreground dark:border-white/15">{copy.noPages}</div>}
  </DashboardPageLayout>;
}
