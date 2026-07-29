import { cn } from "@/lib/utils"
import type { translator } from "@/translator"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import LangHandler from "./LangHandler"
import PageTransition from "./PageTransition"

type TranslationKey = keyof typeof translator.en

export type RouteChapterConfig = {
  id: string
  label?: TranslationKey
  labelText?: string
}

type RouteVisualVariant =
  | "services"
  | "work"
  | "about"
  | "team"
  | "contact"
  | "blog"
  | "wizard"

type ScenePreset = {
  primary: string
  secondary: string
  tint: string
  x: string[]
  y: string[]
  scale: number[]
  rotate: number[]
  rotateX: number[]
  rotateY: number[]
}

const scenePresets: Record<RouteVisualVariant, ScenePreset> = {
  services: {
    primary: "rgba(66,209,213,.22)",
    secondary: "rgba(255,184,77,.2)",
    tint: "rgba(0,107,112,.055)",
    x: ["68%", "22%", "74%", "32%"],
    y: ["24%", "68%", "38%", "72%"],
    scale: [0.8, 1.05, 0.72, 0.94],
    rotate: [0, 26, -18, 46],
    rotateX: [18, 104, 212, 318],
    rotateY: [-24, 132, 268, 410],
  },
  work: {
    primary: "rgba(255,184,77,.22)",
    secondary: "rgba(66,209,213,.18)",
    tint: "rgba(255,184,77,.04)",
    x: ["70%", "26%", "74%", "34%"],
    y: ["30%", "22%", "68%", "46%"],
    scale: [0.9, 1.12, 0.82, 1],
    rotate: [-7, 7, -6, 4],
    rotateX: [8, -16, 20, 3],
    rotateY: [-16, 26, -31, 18],
  },
  about: {
    primary: "rgba(101,229,226,.2)",
    secondary: "rgba(255,184,77,.17)",
    tint: "rgba(66,209,213,.045)",
    x: ["68%", "48%", "24%", "70%"],
    y: ["22%", "68%", "34%", "72%"],
    scale: [0.75, 1.2, 0.86, 1],
    rotate: [0, 84, 196, 326],
    rotateX: [54, 132, 212, 302],
    rotateY: [0, -76, 68, 168],
  },
  team: {
    primary: "rgba(66,209,213,.2)",
    secondary: "rgba(255,184,77,.18)",
    tint: "rgba(0,107,112,.045)",
    x: ["70%", "28%", "72%", "24%"],
    y: ["36%", "68%", "22%", "70%"],
    scale: [0.86, 1.06, 0.8, 1.1],
    rotate: [0, -38, 34, -24],
    rotateX: [30, 86, 154, 232],
    rotateY: [-16, 66, 136, 218],
  },
  contact: {
    primary: "rgba(255,184,77,.2)",
    secondary: "rgba(66,209,213,.2)",
    tint: "rgba(255,184,77,.035)",
    x: ["68%", "74%", "24%", "66%"],
    y: ["28%", "70%", "34%", "72%"],
    scale: [0.9, 1.08, 0.8, 1],
    rotate: [-4, 6, -7, 4],
    rotateX: [4, -7, 10, 0],
    rotateY: [-10, 22, -24, 12],
  },
  blog: {
    primary: "rgba(255,184,77,.2)",
    secondary: "rgba(66,209,213,.18)",
    tint: "rgba(0,107,112,.045)",
    x: ["70%", "58%", "24%", "74%"],
    y: ["24%", "68%", "26%", "66%"],
    scale: [0.84, 1.1, 0.76, 1],
    rotate: [-5, 8, -6, 4],
    rotateX: [10, -8, 16, 3],
    rotateY: [-20, 28, -34, 16],
  },
  wizard: {
    primary: "rgba(66,209,213,.2)",
    secondary: "rgba(255,184,77,.2)",
    tint: "rgba(66,209,213,.04)",
    x: ["70%", "26%", "74%", "28%"],
    y: ["22%", "68%", "30%", "72%"],
    scale: [0.8, 1.14, 0.76, 1.05],
    rotate: [0, 78, 174, 276],
    rotateX: [42, 122, 210, 304],
    rotateY: [-22, 84, 194, 318],
  },
}

function ScenePattern({ variant }: { variant: RouteVisualVariant }) {
  const patterns: Record<RouteVisualVariant, string> = {
    services:
      "bg-[linear-gradient(var(--route-primary)_1px,transparent_1px),linear-gradient(90deg,var(--route-primary)_1px,transparent_1px)] bg-[size:68px_68px]",
    work: "bg-[repeating-linear-gradient(90deg,transparent_0_112px,var(--route-primary)_112px_113px)]",
    about:
      "bg-[radial-gradient(circle_at_center,transparent_0_20%,var(--route-primary)_20.2%_20.5%,transparent_20.8%_36%,var(--route-primary)_36.2%_36.5%,transparent_36.8%)]",
    team: "bg-[radial-gradient(circle,var(--route-primary)_1px,transparent_1.5px)] bg-[size:48px_48px]",
    contact:
      "bg-[radial-gradient(ellipse_at_center,var(--route-primary)_0_1px,transparent_1.5px)] bg-[size:34px_34px]",
    blog: "bg-[repeating-linear-gradient(0deg,transparent_0_76px,var(--route-primary)_76px_77px)]",
    wizard:
      "bg-[repeating-linear-gradient(135deg,transparent_0_54px,var(--route-primary)_54px_55px,transparent_55px_108px)]",
  }

  return (
    <div
      className={cn(
        "absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_50%,black,transparent)] opacity-[0.09]",
        patterns[variant]
      )}
    />
  )
}

function RouteGeometry({ variant }: { variant: RouteVisualVariant }) {
  if (variant === "work") {
    return (
      <div className="absolute inset-[12%] [transform-style:preserve-3d]">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="absolute inset-x-[9%] h-[27%] rounded-2xl border border-main/25 bg-main/[0.025]"
            style={{
              top: `${17 + index * 24}%`,
              transform: `translateZ(${index * 30}px) rotateY(${index % 2 ? -14 : 10}deg)`,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "about") {
    return (
      <div className="absolute inset-[9%] [transform-style:preserve-3d]">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className="absolute inset-0 rounded-full border border-main/25"
            style={{
              transform: `rotateX(${56 + index * 15}deg) rotateZ(${index * 38}deg) translateZ(${index * 10}px)`,
            }}
          />
        ))}
        <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffb84d] shadow-[0_0_22px_rgba(255,184,77,.65)]" />
      </div>
    )
  }

  if (variant === "team") {
    const nodes = [
      "top-[8%] left-1/2",
      "top-[34%] right-[7%]",
      "bottom-[12%] right-[24%]",
      "bottom-[18%] left-[15%]",
      "top-[28%] left-[8%]",
    ]
    return (
      <div className="absolute inset-[8%] [transform-style:preserve-3d]">
        <span className="absolute inset-[18%] [transform:rotateX(64deg)_rotateZ(18deg)] rounded-[32%] border border-main/25" />
        <span className="absolute inset-[7%] [transform:rotateY(68deg)_rotateZ(-24deg)] rounded-full border border-[#ffb84d]/25" />
        {nodes.map((position, index) => (
          <span
            key={position}
            className={cn(
              "absolute size-2 rounded-full shadow-[0_0_16px_currentColor]",
              position,
              index % 2 ? "bg-[#ffb84d]" : "bg-main"
            )}
          />
        ))}
      </div>
    )
  }

  if (variant === "contact") {
    return (
      <div className="absolute inset-[10%] [transform-style:preserve-3d]">
        <span className="absolute top-[16%] left-[7%] h-[29%] w-[64%] [transform:translateZ(32px)_rotateY(-16deg)] rounded-3xl rounded-bl-md border border-main/25 bg-main/[0.025]" />
        <span className="absolute right-[4%] bottom-[17%] h-[31%] w-[59%] [transform:translateZ(56px)_rotateY(15deg)] rounded-3xl rounded-br-md border border-[#ffb84d]/25 bg-[#ffb84d]/[0.025]" />
        <span className="absolute top-[48%] left-[44%] size-2.5 rounded-full bg-main shadow-[0_0_20px_rgba(66,209,213,.75)]" />
      </div>
    )
  }

  if (variant === "blog") {
    return (
      <div className="absolute inset-[8%] [transform-style:preserve-3d]">
        <span className="absolute top-[18%] bottom-[14%] left-[7%] w-[43%] origin-right [transform:rotateY(28deg)_translateZ(24px)] rounded-l-[2rem] border border-[#ffb84d]/25 bg-[#ffb84d]/[0.025]" />
        <span className="absolute top-[18%] right-[7%] bottom-[14%] w-[43%] origin-left [transform:rotateY(-28deg)_translateZ(24px)] rounded-r-[2rem] border border-main/25 bg-main/[0.025]" />
        <span className="absolute top-[13%] left-1/2 h-[74%] w-px -translate-x-1/2 [transform:translateZ(48px)] bg-linear-to-b from-transparent via-main/45 to-transparent" />
      </div>
    )
  }

  if (variant === "wizard") {
    return (
      <div className="absolute inset-[12%] [transform-style:preserve-3d]">
        <span className="absolute inset-[8%] [transform:translateZ(42px)_rotateX(58deg)_rotateZ(45deg)] rounded-[28%] border border-main/25 bg-main/[0.025]" />
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className="absolute left-1/2 h-px w-[62%] origin-left bg-linear-to-r from-main/45 to-transparent"
            style={{
              top: `${28 + index * 13}%`,
              transform: `translateZ(${index * 18}px) rotateZ(${24 + index * 17}deg)`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="absolute inset-[10%] [transform-style:preserve-3d]">
      <span className="absolute inset-0 [transform:rotateX(58deg)_rotateZ(24deg)] rounded-[30%] border border-main/25" />
      <span className="absolute inset-[18%] [transform:translateZ(42px)_rotateY(58deg)] rounded-[26%] border border-[#ffb84d]/25" />
      <span className="absolute inset-[32%] [transform:translateZ(70px)] rounded-full bg-main/[0.04]" />
    </div>
  )
}

function RouteAtmosphere({
  progress,
  variant,
}: {
  progress: MotionValue<number>
  variant: RouteVisualVariant
}) {
  const preset = scenePresets[variant]
  const stops = [0, 0.34, 0.68, 1]
  const x = useTransform(progress, stops, preset.x)
  const y = useTransform(progress, stops, preset.y)
  const scale = useTransform(progress, stops, preset.scale)
  const rotate = useTransform(progress, stops, preset.rotate)
  const rotateX = useTransform(progress, stops, preset.rotateX)
  const rotateY = useTransform(progress, stops, preset.rotateY)
  const tintOpacity = useTransform(progress, [0, 0.5, 1], [0.35, 0.9, 0.45])
  const patternY = useTransform(progress, [0, 1], [0, -110])
  const variables = {
    "--route-primary": preset.primary,
    "--route-secondary": preset.secondary,
  } as CSSProperties

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden [contain:strict]"
      style={variables}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: preset.tint, opacity: tintOpacity }}
      />
      <div className="absolute top-[14%] -right-[14vw] size-[min(46vw,620px)] rounded-full bg-[radial-gradient(circle,var(--route-secondary),transparent_68%)] opacity-35" />
      <motion.div
        className="absolute inset-x-0 -top-20 h-[118%]"
        style={{ y: patternY }}
      >
        <ScenePattern variant={variant} />
      </motion.div>
      <motion.div
        className="absolute size-[clamp(170px,23vw,350px)] -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform [perspective:1050px]"
        style={{ left: x, top: y, scale, rotate }}
      >
        <motion.div
          className="absolute inset-0 transform-gpu will-change-transform [transform-style:preserve-3d]"
          style={{ rotateX, rotateY }}
        >
          <RouteGeometry variant={variant} />
        </motion.div>
      </motion.div>
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-background/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background/35 to-transparent" />
    </div>
  )
}

function TrackerDot({
  chapter,
  progress,
  index,
  count,
  active,
  onSelect,
}: {
  chapter: RouteChapterConfig
  progress: MotionValue<number>
  index: number
  count: number
  active: boolean
  onSelect: () => void
}) {
  const denominator = Math.max(1, count - 1)
  const start = Math.max(0, (index - 0.42) / denominator)
  const end = Math.min(1, (index + 0.55) / denominator)
  const ringProgress = useTransform(progress, [start, end], [0, 1])

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "step" : undefined}
      className="group relative z-10 grid size-8 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-main"
    >
      <span
        className={cn(
          "absolute right-10 w-max max-w-56 rounded-full border bg-background/85 px-3 py-1.5 text-[9px] font-black tracking-[.15em] uppercase transition-all duration-200",
          active
            ? "translate-x-0 border-main/25 text-main opacity-100"
            : "translate-x-2 border-alt/10 text-alt/45 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 dark:border-foreground/10 dark:text-foreground/45"
        )}
      >
        {chapter.labelText ?? (chapter.label ? <LangHandler content={chapter.label} /> : "")}
      </span>
      <svg className="absolute inset-0 size-8 -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="13.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-alt/10 dark:text-foreground/10"
        />
        <motion.circle
          cx="16"
          cy="16"
          r="13.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          pathLength="1"
          style={{ pathLength: ringProgress }}
          className="text-main"
        />
      </svg>
      <span
        className={cn(
          "relative size-1.5 rounded-full transition-[transform,background-color,box-shadow] duration-200",
          active
            ? "scale-150 bg-main shadow-[0_0_14px_rgba(66,209,213,.75)]"
            : "bg-alt/35 dark:bg-foreground/35"
        )}
      />
    </button>
  )
}

function ChapterTracker({
  chapters,
  progress,
  activeIndex,
  onSelect,
}: {
  chapters: RouteChapterConfig[]
  progress: MotionValue<number>
  activeIndex: number
  onSelect: (id: string) => void
}) {
  const lineScale = useTransform(progress, [0, 1], [0, 1])

  if (chapters.length < 2) return null

  return (
    <nav
      aria-label="Page sections"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-center py-3 lg:flex xl:right-8"
    >
      <span className="absolute top-7 bottom-7 left-1/2 w-px -translate-x-1/2 bg-alt/10 dark:bg-foreground/10" />
      <motion.span
        className="absolute top-7 bottom-7 left-1/2 w-px origin-top -translate-x-1/2 bg-linear-to-b from-main to-[#ffb84d]"
        style={{ scaleY: lineScale }}
      />
      <div className="relative flex flex-col gap-5">
        {chapters.map((chapter, index) => (
          <TrackerDot
            key={chapter.id}
            chapter={chapter}
            progress={progress}
            index={index}
            count={chapters.length}
            active={activeIndex === index}
            onSelect={() => onSelect(chapter.id)}
          />
        ))}
      </div>
      <span className="mt-3 text-[8px] font-black tracking-[.16em] text-alt/35 dark:text-foreground/30">
        {String(activeIndex + 1).padStart(2, "0")}/
        {String(chapters.length).padStart(2, "0")}
      </span>
    </nav>
  )
}

export function RouteChapter({
  id,
  index,
  children,
  className,
}: {
  id: string
  index: number
  children: ReactNode
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      data-route-chapter={index}
      className={cn(
        "relative z-10 scroll-mt-24",
        index === 0 ? "min-h-[calc(100svh-4rem)]" : "min-h-[82svh]",
        className
      )}
      initial={reduceMotion ? false : { opacity: 0, y: 42, scale: 0.992 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      {index > 0 ? (
        <span className="pointer-events-none absolute top-[7%] right-[7%] -z-10 text-[clamp(4rem,13vw,11rem)] leading-none font-black tracking-[-.08em] text-main/[.025] select-none dark:text-main/[.035]">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
      {children}
    </motion.section>
  )
}

export function AnimatedRoutePage({
  children,
  chapters,
  variant,
  className,
}: {
  children: ReactNode
  chapters: RouteChapterConfig[]
  variant: RouteVisualVariant
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll()
  const visualProgress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 26,
    mass: 0.42,
    restDelta: 0.0005,
  })
  const routeProgress = reduceMotion ? scrollYProgress : visualProgress

  useEffect(() => {
    const elements = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const nextIndex = elements.indexOf(visible.target as HTMLElement)
        if (nextIndex >= 0) setActiveIndex(nextIndex)
      },
      { rootMargin: "-24% 0px -42% 0px", threshold: [0.04, 0.2, 0.5] }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [chapters])

  const selectChapter = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      })
    },
    [reduceMotion]
  )

  return (
    <PageTransition className={cn("overflow-clip", className)}>
      <div className="relative isolate">
        <RouteAtmosphere progress={routeProgress} variant={variant} />
        <ChapterTracker
          chapters={chapters}
          progress={scrollYProgress}
          activeIndex={activeIndex}
          onSelect={selectChapter}
        />
        {children}
      </div>
    </PageTransition>
  )
}
