import CustomButton from "@/components/CustomButton";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import { lang } from "@/context/global";
import { useSignals } from "@preact/signals-react/runtime";
import { Save } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { GeneralFields } from "./components/GeneralFields";
import { EditorNavigation } from "./components/EditorNavigation";
import { HeroFields } from "./components/HeroFields";
import { LocaleTabs } from "./components/LocaleTabs";
import { PainPointsFields } from "./components/PainPointsFields";
import { PartnersFields } from "./components/PartnersFields";
import { ServicesFields } from "./components/ServicesFields";
import { TestimonialsFields } from "./components/TestimonialsFields";
import { HOME_COPY } from "./home-copy";
import { useHome } from "./useHome";

export default function Home() {
  useSignals();
  const copy = HOME_COPY[lang.value];
  const { experience, form, save, activeLocale, setActiveLocale, activeSection, setActiveSection } = useHome();

  if (experience.isLoading) return <Loader fullScreen={false} />;

  return (
    <DashboardPageLayout title={copy.title} description={copy.description}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <div className="grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]">
            <EditorNavigation active={activeSection} onChange={setActiveSection} copy={copy} />
            <div className="min-w-0 space-y-5">
              <div className="sticky top-52 z-20 flex flex-col gap-4 rounded-2xl border border-white bg-white/90 p-3 shadow-[0_18px_55px_rgba(18,36,35,.1)] backdrop-blur-xl dark:border-white/10 dark:bg-card/90 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between md:top-36">
                {activeSection === "general" ? (
                  <div className="px-2">
                    <p className="text-xs font-black text-alt dark:text-white">{copy.general}</p>
                    <p className="mt-0.5 text-[11px] text-alt/40 dark:text-white/40">{copy.visibility}</p>
                  </div>
                ) : <LocaleTabs value={activeLocale} onChange={setActiveLocale} copy={copy} />}
                <CustomButton type="submit" isLoading={save.isPending} className="h-11 shrink-0 rounded-xl px-5 shadow-lg shadow-main/20">
                  <Save className="size-4" />{save.isPending ? copy.saving : copy.save}
                </CustomButton>
              </div>

              {activeSection === "general" ? <GeneralFields copy={copy} /> : null}
              {activeSection === "hero" ? <HeroFields key={activeLocale} locale={activeLocale} copy={copy} /> : null}
              {activeSection === "partners" ? <PartnersFields key={activeLocale} locale={activeLocale} copy={copy} /> : null}
              {activeSection === "painPoints" ? <PainPointsFields key={activeLocale} locale={activeLocale} copy={copy} /> : null}
              {activeSection === "services" ? <ServicesFields key={activeLocale} locale={activeLocale} copy={copy} /> : null}
              {activeSection === "testimonials" ? <TestimonialsFields key={activeLocale} locale={activeLocale} copy={copy} /> : null}
            </div>
          </div>
        </form>
      </FormProvider>
    </DashboardPageLayout>
  );
}
