import PageLayout from "@/components/PageLayout"
import {
  AnimatedRoutePage,
  RouteChapter,
  type RouteChapterConfig,
} from "@/components/RouteScrollExperience"
import LangHandler from "@/components/LangHandler"
import { EstimateResult } from "./components/EstimateResult"
import { WizardStep } from "./components/WizardStep"
import { useProjectWizard } from "./useProjectWizard"

export default function ProjectWizardPage() {
  const wizard = useProjectWizard()
  const body = wizard.section?.body
  const chapters = [
    { id: wizard.section?.anchor ?? "project-estimator", labelText: body?.chapterLabel ?? body?.badge },
    { id: "project-estimator-workspace", labelText: body?.heading },
  ] satisfies RouteChapterConfig[]
  return (
    <AnimatedRoutePage className="pt-16" chapters={chapters} variant="wizard">
      <RouteChapter
        id={chapters[0].id}
        index={0}
        className="min-h-[calc(100vh-4rem)]"
      >
        <PageLayout
          badge="wizardBadge"
          title="wizardTitle"
          subtitle="wizardSubtitle"
          badgeText={body?.badge}
          titleText={body?.heading}
          subtitleText={body?.subheading}
          className="min-h-[calc(100vh-4rem)]"
        >
          <div id={chapters[1].id} className="mt-14 scroll-mt-28">
            {wizard.isLoading ? (
              <div className="mx-auto max-w-5xl rounded-2xl border border-alt/10 bg-card/45 p-8 text-center text-sm font-bold text-alt/55 dark:text-foreground/55">
                <LangHandler content="languageLoading" />
              </div>
            ) : !wizard.question ? (
              <div className="mx-auto max-w-5xl rounded-2xl border border-alt/10 bg-card/45 p-8 text-center text-sm font-bold text-alt/55 dark:text-foreground/55">
                <LangHandler content="blogEmpty" />
              </div>
            ) : wizard.complete ? (
              <EstimateResult wizard={wizard} />
            ) : (
              <WizardStep wizard={wizard} />
            )}
          </div>
        </PageLayout>
      </RouteChapter>
    </AnimatedRoutePage>
  )
}
