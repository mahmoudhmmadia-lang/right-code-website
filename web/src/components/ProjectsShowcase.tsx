import { lang } from "@/context/global"
import { useProjects } from "@/hooks/usePublicContent"
import type { RouteSectionBody } from "@/pages/site/types"
import { MagneticProjectCarousel } from "@/pages/projects/components/MagneticProjectCarousel"
import { projectCopy } from "@/pages/projects/project-copy"
import { useSignals } from "@preact/signals-react/runtime"
import Loader from "./Loader"
import PageLayout from "./PageLayout"

export default function ProjectsShowcase({ content }: { content?: RouteSectionBody }) {
  useSignals()
  const query = useProjects()
  const copy = projectCopy(lang.value, content?.projectsShowcase)
  const statusLabels = Object.fromEntries(copy.statusLabels.map((item) => [item.value, item.label]))
  const projects = query.data?.data ?? []
  const featured = projects.find((project) => project.isFeatured)
  const orderedProjects = featured ? [featured, ...projects.filter((project) => project.id !== featured.id)] : projects

  return (
    <PageLayout cmsOnly badgeText={content?.badge} titleText={content?.heading} subtitleText={content?.subheading}>
      {query.isLoading ? <Loader fullScreen={false} /> : null}
      {query.isError ? <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-center text-sm text-destructive">{content?.errorMessage}</p> : null}
      {!query.isLoading && !query.isError && !query.data?.data.length ? <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-main/15 bg-main/5 p-5 text-center text-sm text-alt/60 dark:text-white/55">{copy.emptyMessage}</p> : null}
      {orderedProjects.length ? <MagneticProjectCarousel projects={orderedProjects} copy={copy} statusLabels={statusLabels} /> : null}
    </PageLayout>
  )
}
