import PageLayout from "@/components/PageLayout"
import { cn } from "@/lib/utils"
import type { RouteSectionBody } from "@/pages/site/types"
import { useSignals } from "@preact/signals-react/runtime"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { Code2, Compass, RefreshCw, Rocket, Waypoints } from "lucide-react"
import { useRef, useState } from "react"

const icons = { compass: Compass, waypoints: Waypoints, code: Code2, rocket: Rocket, refresh: RefreshCw }

function ProductLifecycle({ content }: { content?: RouteSectionBody }) {
  useSignals()
  const sectionRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const lifecycle = content?.lifecycle
  const lifecycleSteps = lifecycle?.steps ?? []
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 35%"],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.32,
  })
  const progressScale = useTransform(
    reduceMotion ? scrollYProgress : smoothProgress,
    [0, 1],
    [0, 1]
  )
  const safeIndex = Math.min(activeIndex, Math.max(0, lifecycleSteps.length - 1))
  const activeStep = lifecycleSteps[safeIndex]
  const ActiveIcon = icons[activeStep?.icon as keyof typeof icons] ?? Compass

  return (
    <PageLayout
      cmsOnly
      badgeText={content?.badge}
      titleText={content?.heading}
      subtitleText={content?.subheading}
    >
      <div
        ref={sectionRef}
        className="relative mt-14 overflow-hidden rounded-[2.5rem] border border-main/15 bg-[#071d1f] px-5 py-6 text-white shadow-[0_35px_120px_rgba(5,31,32,.2)] sm:px-7 sm:py-8 lg:px-10 lg:py-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(66,209,213,.16),transparent_28%),radial-gradient(circle_at_88%_90%,rgba(255,184,77,.1),transparent_25%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)] bg-[size:58px_58px] opacity-[.08]" />

        <div className="relative flex items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-[9px] font-black tracking-[.23em] text-main uppercase">
              {lifecycle?.workflowLabel}
            </p>
            <p className="mt-2 text-sm text-white/48">
              01 — {String(lifecycleSteps.length).padStart(2, "0")}
            </p>
          </div>
          <div className="relative h-px w-full max-w-sm overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-0 origin-left bg-linear-to-r from-main to-[#ffb84d]"
              style={{ scaleX: progressScale }}
            />
          </div>
        </div>

        <div className="relative mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {lifecycleSteps.map(({ number, title, icon }, index) => {
            const Icon = icons[icon as keyof typeof icons] ?? Compass
            const active = index === safeIndex
            return (
              <motion.button
                key={number}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group relative min-h-36 overflow-hidden rounded-2xl border p-5 text-start transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-main",
                  active
                    ? "border-main/35 bg-main/12"
                    : "border-white/[.08] bg-white/[.025] hover:border-white/15 hover:bg-white/[.05]"
                )}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 26, rotateX: 8 }
                }
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.48,
                  delay: reduceMotion ? 0 : index * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduceMotion ? undefined : { y: -5 }}
              >
                <motion.span
                  className="absolute inset-x-0 top-0 h-px origin-left bg-linear-to-r from-main to-[#ffb84d]"
                  animate={{ scaleX: active ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[.045] text-main transition-colors group-hover:bg-main group-hover:text-[#061718]">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-[10px] font-black tracking-[.17em] text-white/28">
                    {number}
                  </span>
                </span>
                <span className="mt-7 block text-sm leading-5 font-bold text-white/78">
                  {title}
                </span>
              </motion.button>
            )
          })}
        </div>

        {activeStep ? <div className="relative mt-3 min-h-72 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[.035] sm:min-h-64">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep.number}
              className="grid min-h-72 items-center gap-7 p-6 sm:min-h-64 sm:p-8 lg:grid-cols-[.42fr_1.58fr] lg:p-10"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 28, scale: 0.99 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -20, scale: 0.99 }
              }
              transition={{ duration: reduceMotion ? 0.12 : 0.38 }}
            >
              <div className="flex items-center gap-5 lg:block">
                <span className="grid size-16 place-items-center rounded-2xl bg-main text-[#061718] shadow-[0_18px_50px_rgba(66,209,213,.2)] lg:size-20">
                  <ActiveIcon className="size-7 lg:size-8" />
                </span>
                <span className="text-[clamp(3.6rem,8vw,7rem)] leading-none font-black tracking-[-.08em] text-white/[.08] lg:mt-5 lg:block">
                  {activeStep.number}
                </span>
              </div>
              <div>
                <p className="text-[9px] font-black tracking-[.2em] text-[#ffbd5a] uppercase">
                  {lifecycle?.activePhaseLabel}
                </p>
                <h3 className="mt-4 max-w-2xl text-[clamp(1.8rem,3vw,3.15rem)] leading-[1.02] font-black tracking-[-.045em]">
                  {activeStep.title}
                </h3>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                  {activeStep.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div> : null}
      </div>
    </PageLayout>
  )
}

export default ProductLifecycle
