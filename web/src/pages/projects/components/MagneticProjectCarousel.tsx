import type { PublicProject } from "@/hooks/usePublicContent"
import type { RouteSectionBody } from "@/pages/site/types"
import { cn } from "@/lib/utils"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react"
import { Link } from "react-router-dom"
import { ProjectArtwork } from "./ProjectArtwork"

type Copy = NonNullable<RouteSectionBody["projectsShowcase"]>

export function MagneticProjectCarousel({
  projects,
  copy,
  statusLabels,
}: {
  projects: PublicProject[]
  copy: Copy
  statusLabels: Record<string, string>
}) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 190, damping: 24 })
  const smoothY = useSpring(pointerY, { stiffness: 190, damping: 24 })
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [2.5, -2.5])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3.5, 3.5])
  const activeProject = projects[activeIndex]

  if (!activeProject) return null

  const select = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  const move = (nextDirection: 1 | -1) => {
    setDirection(nextDirection)
    setActiveIndex(
      (current) =>
        (current + nextDirection + projects.length) % projects.length
    )
  }

  const updatePointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    pointerX.set(x - 0.5)
    pointerY.set(y - 0.5)
    event.currentTarget.style.setProperty("--project-x", `${x * 100}%`)
    event.currentTarget.style.setProperty("--project-y", `${y * 100}%`)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  const finishDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 72) return
    move(info.offset.x < 0 ? 1 : -1)
  }

  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      move(1)
    } else if (event.key === "Home") {
      event.preventDefault()
      select(0)
    } else if (event.key === "End") {
      event.preventDefault()
      select(projects.length - 1)
    }
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={copy.featuredLabel}
      tabIndex={0}
      onKeyDown={handleKeys}
      className="relative mx-auto mt-14 max-w-7xl outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <motion.article
        onPointerMove={updatePointer}
        onPointerLeave={resetPointer}
        data-magnetic
        className="group relative isolate min-h-[560px] overflow-hidden rounded-[2.4rem] border border-white/16 bg-[#061718] shadow-[0_40px_130px_rgba(4,29,30,.3)] [perspective:1400px] sm:min-h-[650px]"
        style={reduceMotion ? undefined : { rotateX, rotateY }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeProject.id}
            custom={direction}
            drag={projects.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={finishDrag}
            className="absolute inset-0 touch-pan-y"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 70, scale: 1.025 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -70, scale: 0.985 }
            }
            transition={{ duration: reduceMotion ? 0.12 : 0.52, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProjectArtwork
              project={activeProject}
              cover
              priority={activeIndex === 0}
              className="absolute inset-0 size-full"
              imageClassName="transition-transform duration-[1400ms] group-hover:scale-[1.045]"
            />
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(2,17,18,.96)_0%,rgba(2,17,18,.72)_42%,rgba(2,17,18,.1)_74%),linear-gradient(0deg,rgba(2,17,18,.88),transparent_52%)] max-lg:bg-[linear-gradient(0deg,rgba(2,17,18,.97)_0%,rgba(2,17,18,.55)_54%,rgba(2,17,18,.12)_100%)]" />
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_330px_at_var(--project-x,70%)_var(--project-y,35%),rgba(66,209,213,.2),transparent_70%)] opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 lg:max-w-[64%] lg:justify-center lg:p-14 xl:p-16">
              <div className="flex flex-wrap items-center gap-3 text-[9px] font-black tracking-[.18em] uppercase">
                <span className="rounded-full border border-main/28 bg-main/14 px-3 py-1.5 text-main backdrop-blur-xl">
                  {activeProject.projectNumber}
                </span>
                <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-white/70 backdrop-blur-xl">
                  {statusLabels[activeProject.status] ?? activeProject.status}
                </span>
                {activeProject.isFeatured ? (
                  <span className="text-[#ffbd5a]">{copy.featuredLabel}</span>
                ) : null}
              </div>

              <motion.h3
                key={`${activeProject.id}-title`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.45 }}
                className="mt-6 max-w-4xl text-[clamp(3rem,7.4vw,7.4rem)] leading-[.83] font-black tracking-[-.085em] text-white"
              >
                {activeProject.title ?? activeProject.name}
              </motion.h3>
              {activeProject.subtitle ? (
                <p className="mt-6 text-xs font-black tracking-[.1em] text-[#ffbd5a] uppercase sm:text-sm">
                  {activeProject.subtitle}
                </p>
              ) : null}
              <p className="mt-5 line-clamp-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                {activeProject.summary ?? activeProject.solution}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={`/work/${activeProject.slug}`}
                  data-magnetic
                  className="inline-flex items-center gap-3 rounded-full bg-main px-6 py-3.5 text-xs font-black text-white shadow-[0_16px_45px_rgba(0,107,112,.32)] transition hover:-translate-y-1 hover:bg-[#07868b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
                >
                  {copy.detailsLabel}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </Link>
                <span className="text-[9px] font-black tracking-[.18em] text-white/38 uppercase">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {projects.length > 1 ? (
          <div className="absolute right-5 bottom-5 z-40 flex items-center gap-2 sm:right-8 sm:bottom-8">
            <button
              type="button"
              data-magnetic
              onClick={() => move(-1)}
              aria-label={copy.backLabel}
              className="grid size-12 place-items-center rounded-full border border-white/18 bg-black/28 text-white backdrop-blur-xl transition hover:border-main/50 hover:bg-main hover:text-white"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              data-magnetic
              onClick={() => move(1)}
              aria-label={copy.nextProjectLabel}
              className="grid size-12 place-items-center rounded-full border border-white/18 bg-black/28 text-white backdrop-blur-xl transition hover:border-main/50 hover:bg-main hover:text-white"
            >
              <ArrowRight className="size-4 rtl:rotate-180" />
            </button>
          </div>
        ) : null}
      </motion.article>

      {projects.length > 1 ? (
        <div className="mt-4 flex snap-x gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              data-magnetic
              onClick={() => select(index)}
              aria-current={index === activeIndex ? "true" : undefined}
              aria-label={project.title ?? project.name}
              className={cn(
                "group/thumb relative h-24 min-w-[190px] snap-start overflow-hidden rounded-[1.2rem] border text-start transition sm:h-28 sm:min-w-[230px]",
                index === activeIndex
                  ? "border-main shadow-[0_14px_40px_rgba(0,107,112,.2)]"
                  : "border-alt/10 opacity-64 hover:border-main/40 hover:opacity-100 dark:border-white/10"
              )}
            >
              <ProjectArtwork
                project={project}
                cover
                className="absolute inset-0 size-full"
                imageClassName="transition-transform duration-500 group-hover/thumb:scale-105"
              />
              <span className="absolute inset-0 z-20 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 z-30 line-clamp-1 p-3 text-xs font-black text-white">
                {project.title ?? project.name}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
