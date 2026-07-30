import type { PublicProject } from "@/hooks/usePublicContent"
import type { RouteSectionBody } from "@/pages/site/types"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { ProjectArtwork } from "./ProjectArtwork"

type Copy = NonNullable<RouteSectionBody["projectsShowcase"]>

export function ProjectCard({ project, index, featured, copy, status }: { project: PublicProject; index: number; featured?: boolean; copy: Copy; status: string }) {
  if (featured) {
    return (
      <motion.article className="group overflow-hidden rounded-[2rem] border border-alt/8 bg-card/75 shadow-[0_24px_80px_rgba(18,36,35,.09)] backdrop-blur-md dark:border-white/10 lg:col-span-2 lg:grid lg:grid-cols-[1.18fr_.82fr]" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}>
        <Link to={`/work/${project.slug}`} className="block min-h-80 overflow-hidden lg:min-h-[480px]">
          <ProjectArtwork project={project} cover className="flex size-full min-h-80 items-center justify-center transition duration-700 group-hover:scale-[1.025] lg:min-h-[480px]" />
        </Link>
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] font-black tracking-[.2em] text-main uppercase">{copy.featuredLabel}</span>
            <span className="flex items-center gap-2 text-[10px] font-bold text-alt/35 dark:text-white/35"><span className="size-1.5 rounded-full bg-main" />{status}</span>
          </div>
          <h3 className="mt-7 text-[clamp(2.3rem,4vw,4.5rem)] leading-[.95] font-black tracking-[-.065em] text-alt dark:text-white">{project.title ?? project.name}</h3>
          {project.subtitle ? <p className="mt-4 text-sm font-bold text-main">{project.subtitle}</p> : null}
          <p className="mt-6 line-clamp-4 text-sm leading-7 text-alt/58 dark:text-white/55">{project.summary ?? project.solution}</p>
          <Link to={`/work/${project.slug}`} className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-alt px-5 py-3 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-main dark:bg-white dark:text-[#071918] dark:hover:bg-main dark:hover:text-white">{copy.detailsLabel}<ArrowUpRight className="size-4" /></Link>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article className="group overflow-hidden rounded-[1.75rem] border border-alt/8 bg-card/65 transition hover:-translate-y-1 hover:border-main/20 hover:shadow-[0_24px_70px_rgba(18,36,35,.1)] dark:border-white/10" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.04 }}>
      <Link to={`/work/${project.slug}`} className="block h-64 overflow-hidden">
        <ProjectArtwork project={project} cover className="flex size-full items-center justify-center transition duration-700 group-hover:scale-[1.035]" />
      </Link>
      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4 text-[9px] font-black tracking-[.16em] uppercase">
          <span className="text-main">{project.projectNumber}</span>
          <span className="text-alt/30 dark:text-white/30">{status}</span>
        </div>
        <h3 className="mt-5 text-2xl leading-tight font-black tracking-[-.04em] text-alt dark:text-white">{project.title ?? project.name}</h3>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-alt/55 dark:text-white/50">{project.summary ?? project.solution}</p>
        <Link to={`/work/${project.slug}`} className="mt-6 inline-flex items-center gap-2 text-xs font-black text-alt transition group-hover:text-main dark:text-white">{copy.detailsLabel}<ArrowUpRight className="size-3.5" /></Link>
      </div>
    </motion.article>
  )
}
