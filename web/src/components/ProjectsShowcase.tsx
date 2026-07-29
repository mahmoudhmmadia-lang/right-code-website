import { useProjects } from "@/hooks/usePublicContent"
import type { RouteSectionBody } from "@/pages/site/types"
import { motion } from "framer-motion"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import Loader from "./Loader"
import PageLayout from "./PageLayout"

export default function ProjectsShowcase({ content }: { content?: RouteSectionBody }) {
  const query = useProjects()
  const details = content?.projectsShowcase
  const statusLabels = Object.fromEntries(details?.statusLabels.map((item) => [item.value, item.label]) ?? [])

  return (
    <PageLayout
      cmsOnly
      badgeText={content?.badge}
      titleText={content?.heading}
      subtitleText={content?.subheading}
    >
      {query.isLoading ? <Loader fullScreen={false} /> : null}
      {query.isError ? (
        <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-center text-sm text-destructive">
          {content?.errorMessage}
        </p>
      ) : null}
      {!query.isLoading && !query.isError && !query.data?.data.length ? <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-main/15 bg-main/5 p-5 text-center text-sm text-alt/60">{details?.emptyMessage}</p> : null}
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {query.data?.data.map((project, index) => (
          <motion.article
            key={project.id}
            className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 p-7 shadow-[0_22px_64px_rgba(18,36,35,0.09)] backdrop-blur-xl sm:p-9"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ delay: index * 0.06 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-main/10 px-3 py-1 text-xs font-bold text-main">
                {project.projectNumber}
              </span>
              <span className="text-xs font-semibold text-alt/45">
                {statusLabels[project.status] ?? project.status}
              </span>
            </div>
            <h3 className="mt-6 text-2xl font-black tracking-tight text-alt">
              {project.title ?? project.name}
            </h3>
            {project.subtitle ? (
              <p className="mt-2 font-semibold text-main">{project.subtitle}</p>
            ) : null}
            <p className="mt-4 text-sm leading-7 text-alt/60">
              {project.summary ?? project.solution}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies?.map((technology) => (
                <span
                  key={technology}
                  className="rounded-lg border border-main/15 bg-main/5 px-2.5 py-1.5 text-xs font-semibold text-alt/70"
                >
                  {technology}
                </span>
              ))}
            </div>
            {project.results?.length ? (
              <ul className="mt-6 grid gap-2 border-t border-alt/10 pt-5">
                {project.results.slice(0, 3).map((result) => (
                  <li
                    key={result}
                    className="flex items-start gap-2 text-sm text-alt/65"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-main" />
                    {result}
                  </li>
                ))}
              </ul>
            ) : null}
            <ArrowUpRight className="absolute right-7 bottom-7 size-6 text-main/25" />
          </motion.article>
        ))}
      </div>
    </PageLayout>
  )
}
