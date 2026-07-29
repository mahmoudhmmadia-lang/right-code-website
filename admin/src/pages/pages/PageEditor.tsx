import { Button } from "@/components/ui/button";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import { lang } from "@/context/global";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { PageEditorNavigation } from "./components/PageEditorNavigation";
import { PageGeneralFields } from "./components/PageGeneralFields";
import { PageLocaleTabs } from "./components/PageLocaleTabs";
import { PageLocalizedFields } from "./components/PageLocalizedFields";
import { pageToForm } from "./page-form";
import { PAGES_COPY } from "./pages-copy";
import type { PageForm, PageLocale, PageSection } from "./types";
import { usePages } from "./usePages";

export default function PageEditor() {
  useSignals();
  const { slug = "" } = useParams();
  const copy = PAGES_COPY[lang.value];
  const [section, setSection] = useState<PageSection>("general");
  const [locale, setLocale] = useState<PageLocale>(lang.value);
  const { list, update } = usePages();
  const page = list.data?.data.find((item) => item.slug === slug);
  const form = useForm<PageForm>();

  useEffect(() => { if (page) form.reset(pageToForm(page)); }, [page, form]);
  const title = page?.translations[lang.value]?.title ?? page?.translations.en?.title ?? slug;

  if (list.isLoading) return <DashboardPageLayout title={copy.title}><Loader fullScreen={false} /></DashboardPageLayout>;
  if (!page) return <DashboardPageLayout title={copy.title} description={copy.missing}><Button asChild variant="outline" className="self-start"><Link to="/pages"><ArrowLeft className="size-4 rtl:rotate-180" />{copy.back}</Link></Button></DashboardPageLayout>;

  return <DashboardPageLayout title={title} description={copy.editorDescription}>
    <Button asChild variant="ghost" className="w-fit text-main"><Link to="/pages"><ArrowLeft className="size-4 rtl:rotate-180" />{copy.back}</Link></Button>
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => update.mutate({ page, values }))}>
        <div className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
          <PageEditorNavigation active={section} copy={copy} onChange={setSection} />
          <div className="min-w-0 space-y-5">
            <div className="sticky top-32 z-20 flex flex-col gap-4 rounded-2xl border border-white bg-white/90 p-3 shadow-[0_18px_55px_rgba(18,36,35,.1)] backdrop-blur-xl dark:border-white/10 dark:bg-card/90 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between md:top-20">
              {section === "general" ? <div className="px-2"><p className="text-xs font-black text-alt">/{page.slug === "home" ? "" : page.slug}</p><p className="mt-0.5 text-[11px] text-alt/40">{page.kind}</p></div> : <PageLocaleTabs value={locale} copy={copy} onChange={setLocale} />}
              <Button type="submit" disabled={update.isPending} className="shrink-0 shadow-lg shadow-main/20"><Save className="size-4" />{update.isPending ? copy.saving : copy.save}</Button>
            </div>
            {section === "general" ? <PageGeneralFields copy={copy} /> : <PageLocalizedFields key={`${section}-${locale}`} locale={locale} section={section} copy={copy} />}
          </div>
        </div>
      </form>
    </FormProvider>
  </DashboardPageLayout>;
}
