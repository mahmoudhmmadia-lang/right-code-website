import CustomButton from "@/components/CustomButton";
import DashboardPageLayout from "@/components/DashboardPageLayout";
import Loader from "@/components/Loader";
import { lang } from "@/context/global";
import { useSignals } from "@preact/signals-react/runtime";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RouteEditorNavigation } from "./components/RouteEditorNavigation";
import { RouteGeneralFields } from "./components/RouteGeneralFields";
import { RouteLocaleTabs } from "./components/RouteLocaleTabs";
import { RouteSectionFields } from "./components/RouteSectionFields";
import { ContactContentFields } from "./components/ContactContentFields";
import { ROUTE_CONTENT_COPY } from "./route-content-copy";
import type { RoutePageKey } from "./route-content-config";
import { useRouteContent } from "./useRouteContent";
import {
  AboutTerminalContentFields,
  AboutWhyContentFields,
} from "./components/AboutContentFields";
import {
  LifecycleContentFields,
  ServicesDetailContentFields,
} from "./components/ServicesContentFields";
import { WizardContentFields } from "./components/WizardContentFields";
import {
  CaseStudiesContentFields,
  ProjectsShowcaseContentFields,
} from "./components/WorkContentFields";
import {
  TeamCareersContentFields,
  TeamPeopleContentFields,
} from "./components/TeamContentFields";

export default function RouteContentPage({
  pageKey,
}: {
  pageKey: RoutePageKey;
}) {
  useSignals();
  const copy = ROUTE_CONTENT_COPY[lang.value];
  const route = useRouteContent(pageKey);
  const activeConfig = route.config.sections.find(
    (section) => section.key === route.activeSection,
  );
  const [activePanel, setActivePanel] = useState("heading");

  useEffect(() => {
    setActivePanel("heading");
  }, [route.activeSection, route.activeLocale]);

  if (route.list.isLoading) return <Loader fullScreen={false} />;

  const sectionContent = activeConfig ? (
    <>
      {activeConfig.key === "about-why" ? (
        <AboutWhyContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "about-terminal" ? (
        <AboutTerminalContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "services-detail" ? (
        <ServicesDetailContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "services-lifecycle" ? (
        <LifecycleContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "work-projects" ? (
        <ProjectsShowcaseContentFields
          locale={route.activeLocale}
          copy={copy}
        />
      ) : null}
      {activeConfig.key === "work-case-studies" ? (
        <CaseStudiesContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "team-people" ? (
        <TeamPeopleContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "team-careers" ? (
        <TeamCareersContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "project-wizard" ? (
        <WizardContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
      {activeConfig.key === "contact-overview" ? (
        <ContactContentFields locale={route.activeLocale} copy={copy} />
      ) : null}
    </>
  ) : null;
  const hasSectionContent = Boolean(
    sectionContent?.props.children.some(Boolean),
  );

  return (
    <DashboardPageLayout
      title={route.config.title[lang.value]}
      description={route.config.description[lang.value]}
    >
      <FormProvider {...route.form}>
        <form
          onSubmit={route.form.handleSubmit((values) =>
            route.save.mutate(values),
          )}
        >
          <div className="grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]">
            <RouteEditorNavigation
              config={route.config}
              locale={lang.value}
              active={route.activeSection}
              onChange={route.setActiveSection}
              copy={copy}
            />
            <div className="min-w-0 space-y-5">
              <div className="sticky top-52 z-20 flex flex-col gap-4 rounded-2xl border border-white bg-white/90 p-3 shadow-[0_18px_55px_rgba(18,36,35,.1)] backdrop-blur-xl dark:border-white/10 dark:bg-card/90 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between md:top-36">
                {route.activeSection === "general" ? (
                  <div className="px-2">
                    <p className="text-xs font-black text-alt dark:text-white">
                      {copy.general}
                    </p>
                    <p className="mt-0.5 text-[11px] text-alt/40 dark:text-white/40">
                      {copy.visibility}
                    </p>
                  </div>
                ) : (
                  <RouteLocaleTabs
                    value={route.activeLocale}
                    onChange={route.setActiveLocale}
                    copy={copy}
                  />
                )}
                <CustomButton
                  type="submit"
                  isLoading={route.save.isPending}
                  className="h-11 shrink-0 rounded-xl px-5 shadow-lg shadow-main/20"
                >
                  <Save className="size-4" />
                  {route.save.isPending ? copy.saving : copy.save}
                </CustomButton>
              </div>

              {route.activeSection === "general" ? (
                <RouteGeneralFields config={route.config} copy={copy} />
              ) : null}
              {activeConfig ? (
                <Tabs
                  key={`${activeConfig.key}-${route.activeLocale}`}
                  value={activePanel}
                  onValueChange={setActivePanel}
                  className="space-y-5"
                >
                  <div className="sticky top-[15.5rem] z-10 overflow-x-auto rounded-2xl border border-alt/10 bg-background/95 p-2 shadow-sm backdrop-blur dark:border-white/10 md:top-56 flex justify-center">
                    <TabsList className="h-auto min-w-max bg-main/[.06] p-1">
                      <TabsTrigger value="heading" className="h-10 px-5">
                        {copy.sectionContent}
                      </TabsTrigger>
                      {hasSectionContent ? (
                        <TabsTrigger value="content" className="h-10 px-5">
                          {activeConfig.label[lang.value]}
                        </TabsTrigger>
                      ) : null}
                    </TabsList>
                  </div>
                  <TabsContent value="heading" className="mt-0">
                    <RouteSectionFields
                      locale={route.activeLocale}
                      section={activeConfig}
                      copy={copy}
                    />
                  </TabsContent>
                  {hasSectionContent ? (
                    <TabsContent value="content" className="mt-0">
                      {sectionContent}
                    </TabsContent>
                  ) : null}
                </Tabs>
              ) : null}
            </div>
          </div>
        </form>
      </FormProvider>
    </DashboardPageLayout>
  );
}
