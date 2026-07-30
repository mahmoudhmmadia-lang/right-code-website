import Container from "@/components/Container"
import Loader from "@/components/Loader"
import LazyImage from "@/components/LazyImage"
import { lang } from "@/context/global"
import { useProject, useProjects } from "@/hooks/usePublicContent"
import { mediaUrl } from "@/lib/media"
import { useRoutePage } from "@/pages/site/useRoutePage"
import { useSignals } from "@preact/signals-react/runtime"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { ProjectArtwork } from "./components/ProjectArtwork"
import { projectCopy } from "./project-copy"

export default function ProjectDetailPage() {
  useSignals()
  const { slug } = useParams()
  const projectQuery = useProject(slug)
  const projectsQuery = useProjects()
  const route = useRoutePage("work")
  const section = route.sections.find((item) => item.key === "work-projects")
  const copy = projectCopy(lang.value, section?.body?.projectsShowcase)
  const project = projectQuery.data
  const statusLabels = Object.fromEntries(copy.statusLabels.map((item) => [item.value, item.label]))
  const projects = projectsQuery.data?.data ?? []
  const currentIndex = projects.findIndex((item) => item.slug === slug)
  const nextProject = projects.length > 1 ? projects[(currentIndex + 1 + projects.length) % projects.length] : undefined

  if (projectQuery.isLoading || route.query.isLoading) return <main className="min-h-screen pt-24"><Loader /></main>

  if (projectQuery.isError || !project) {
    return (
      <main className="min-h-[75vh] pt-28">
        <Container className="flex min-h-[55vh] items-center justify-center">
          <div className="max-w-xl text-center">
            <p className="text-[10px] font-black tracking-[.2em] text-main uppercase">404</p>
            <h1 className="mt-5 text-4xl font-black tracking-[-.05em] text-alt sm:text-6xl dark:text-white">{copy.notFoundTitle}</h1>
            <p className="mt-5 text-sm leading-7 text-alt/55 dark:text-white/50">{copy.notFoundMessage}</p>
            <Link to="/work" className="mt-8 inline-flex items-center gap-2 rounded-full bg-alt px-6 py-3 text-xs font-black text-white dark:bg-white dark:text-[#071918]"><ArrowLeft className="size-4 rtl:rotate-180" />{copy.backLabel}</Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden pt-24 pb-24">
      <Container>
        <Link to="/work" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[.16em] text-alt/42 uppercase transition hover:text-main dark:text-white/42"><ArrowLeft className="size-4 rtl:rotate-180" />{copy.backLabel}</Link>

        <header className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[9px] font-black tracking-[.18em] uppercase">
              <span className="text-main">{project.projectNumber}</span>
              <span className="text-alt/20 dark:text-white/20">/</span>
              <span className="text-alt/38 dark:text-white/38">{statusLabels[project.status] ?? project.status}</span>
            </div>
            <h1 className="mt-7 max-w-5xl text-[clamp(3.2rem,8vw,8.5rem)] leading-[.86] font-black tracking-[-.085em] text-alt dark:text-white">{project.title ?? project.name}</h1>
          </div>
          <div className="lg:pb-2">
            {project.subtitle ? <p className="text-sm font-black text-main">{project.subtitle}</p> : null}
            <p className="mt-5 text-base leading-8 text-alt/60 dark:text-white/55">{project.summary ?? project.solution}</p>
            {project.projectUrl ? <a href={project.projectUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-3 rounded-full bg-main px-6 py-3 text-xs font-black text-white transition hover:-translate-y-0.5 hover:brightness-110">{copy.visitLabel}<ExternalLink className="size-4" /></a> : null}
          </div>
        </header>

        <motion.div className="mt-14 overflow-hidden rounded-[2.25rem] border border-alt/8 dark:border-white/10" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <ProjectArtwork project={project} cover priority className="flex aspect-[16/8] min-h-80 items-center justify-center" imageClassName="transition-transform duration-[1400ms] hover:scale-[1.035]" />
        </motion.div>

        <section className="grid border-b border-alt/8 py-8 sm:grid-cols-3 dark:border-white/10">
          <Fact label={copy.clientLabel} value={project.clientName || project.name} />
          <Fact label={copy.yearLabel} value={project.completionYear ? String(project.completionYear) : "—"} />
          <Fact label={copy.technologiesLabel} value={project.technologies?.slice(0, 2).join(" · ") || "—"} />
        </section>

        <div className="mx-auto mt-24 grid max-w-6xl gap-16">
          <section className="grid gap-12 lg:grid-cols-2">
            <StoryBlock number="01" label={copy.contextLabel} text={project.context} />
            <StoryBlock number="02" label={copy.challengeLabel} text={project.challenges} />
          </section>

          {project.solution ? (
            <section className="grid gap-8 rounded-[2rem] border border-main/15 bg-main/[.045] p-7 sm:p-10 lg:grid-cols-[.34fr_.66fr] lg:p-14">
              <div><span className="text-[10px] font-black tracking-[.18em] text-main uppercase">03 / {copy.solutionLabel}</span></div>
              <p className="text-xl leading-9 font-semibold tracking-[-.025em] text-alt sm:text-2xl sm:leading-10 dark:text-white">{project.solution}</p>
            </section>
          ) : null}

          <section className="grid gap-12 lg:grid-cols-3">
            {project.services?.length ? <ListBlock label={copy.servicesLabel} items={project.services} /> : null}
            {project.keyElements?.length ? <ListBlock label={copy.capabilitiesLabel} items={project.keyElements} /> : null}
            {project.technologies?.length ? <ListBlock label={copy.technologiesLabel} items={project.technologies} /> : null}
          </section>

          {project.galleryImages?.length ? (
            <section className="grid gap-5 md:grid-cols-2">
              {project.galleryImages.map((image, index) => <div key={`${image}-${index}`} className={index === 0 ? "overflow-hidden rounded-[2rem] border border-alt/8 md:col-span-2 dark:border-white/10" : "overflow-hidden rounded-[2rem] border border-alt/8 dark:border-white/10"}><LazyImage src={mediaUrl(image)} alt="" width={1600} height={900} className="aspect-[16/9] size-full object-cover" /></div>)}
            </section>
          ) : null}

          {project.results?.length || project.impactSummary ? (
            <section className="overflow-hidden rounded-[2.25rem] bg-[#081b1a] p-7 text-white sm:p-10 lg:p-14">
              <p className="text-[10px] font-black tracking-[.2em] text-main uppercase">04 / {copy.impactLabel}</p>
              {project.impactSummary ? <p className="mt-7 max-w-4xl text-2xl leading-10 font-semibold tracking-[-.035em] sm:text-3xl sm:leading-[1.35]">{project.impactSummary}</p> : null}
              {project.results?.length ? <div className="mt-10 grid gap-3 md:grid-cols-2">{project.results.map((result) => <div key={result} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[.035] p-4 text-sm leading-6 text-white/65"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-main/15 text-main"><Check className="size-3" /></span>{result}</div>)}</div> : null}
            </section>
          ) : null}

          {project.testimonialQuote ? (
            <blockquote className="mx-auto max-w-4xl py-8 text-center">
              <p className="text-2xl leading-10 font-semibold tracking-[-.04em] text-alt sm:text-4xl sm:leading-[1.3] dark:text-white">“{project.testimonialQuote}”</p>
              {project.testimonialAuthor ? <footer className="mt-6 text-[10px] font-black tracking-[.18em] text-main uppercase">{project.testimonialAuthor}</footer> : null}
            </blockquote>
          ) : null}
        </div>

        <section className="mt-24 border-t border-alt/8 pt-12 dark:border-white/10">
          {nextProject && nextProject.slug !== project.slug ? (
            <Link to={`/work/${nextProject.slug}`} className="group grid gap-8 lg:grid-cols-[.65fr_.35fr] lg:items-center">
              <div>
                <p className="text-[10px] font-black tracking-[.18em] text-main uppercase">{copy.nextProjectLabel}</p>
                <h2 className="mt-5 text-4xl font-black tracking-[-.06em] text-alt transition group-hover:text-main sm:text-6xl dark:text-white">{nextProject.title ?? nextProject.name}</h2>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black">{copy.detailsLabel}<ArrowUpRight className="size-4" /></span>
              </div>
              <ProjectArtwork project={nextProject} cover className="flex aspect-[4/3] items-center justify-center rounded-[1.75rem]" />
            </Link>
          ) : (
            <Link to="/work" className="inline-flex items-center gap-2 text-sm font-black text-main">{copy.allProjectsLabel}<ArrowUpRight className="size-4" /></Link>
          )}
        </section>
      </Container>
    </main>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="border-alt/8 px-4 py-3 first:px-0 sm:border-e sm:px-8 sm:last:border-e-0 dark:border-white/10"><p className="text-[9px] font-black tracking-[.17em] text-alt/30 uppercase dark:text-white/30">{label}</p><p className="mt-2 text-sm font-bold text-alt dark:text-white">{value}</p></div>
}

function StoryBlock({ number, label, text }: { number: string; label: string; text?: string }) {
  if (!text) return null
  return <div><p className="text-[10px] font-black tracking-[.18em] text-main uppercase">{number} / {label}</p><p className="mt-6 text-base leading-8 text-alt/65 dark:text-white/60">{text}</p></div>
}

function ListBlock({ label, items }: { label: string; items: string[] }) {
  return <div><p className="text-[10px] font-black tracking-[.18em] text-main uppercase">{label}</p><div className="mt-5 divide-y divide-alt/8 border-y border-alt/8 dark:divide-white/10 dark:border-white/10">{items.map((item, index) => <div key={item} className="flex items-center gap-4 py-4 text-sm font-semibold text-alt/70 dark:text-white/65"><span className="text-[9px] font-black text-main">{String(index + 1).padStart(2, "0")}</span>{item}</div>)}</div></div>
}
