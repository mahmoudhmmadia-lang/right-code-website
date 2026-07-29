import { motion, useTransform, type MotionValue } from "framer-motion"

type Chapter = { id: string; label: string }

function TrackerDot({
  chapter,
  index,
  count,
  active,
  progress,
  onSelect,
}: {
  chapter: Chapter
  index: number
  count: number
  active: boolean
  progress: MotionValue<number>
  onSelect: () => void
}) {
  const start = Math.max(0, (index - 0.45) / Math.max(1, count - 1))
  const end = Math.min(1, (index + 0.55) / Math.max(1, count - 1))
  const ringProgress = useTransform(progress, [start, end], [0, 1])

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "step" : undefined}
      className="group relative z-10 grid size-8 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-main"
    >
      <span className={`absolute right-10 w-max rounded-full border bg-background/80 px-3 py-1.5 text-[9px] font-black tracking-[.16em] uppercase backdrop-blur transition ${active ? "border-main/25 text-main opacity-100" : "translate-x-2 border-alt/10 text-alt/45 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>
        {chapter.label}
      </span>
      <svg className="absolute inset-0 size-8 -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" className="text-alt/10" />
        <motion.circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" strokeWidth="1.5" pathLength="1" style={{ pathLength: ringProgress }} className="text-main" />
      </svg>
      <motion.span className="size-1.5 rounded-full" animate={{ scale: active ? 1.7 : 1, backgroundColor: active ? "var(--color-main)" : "rgba(90,115,114,.5)" }} />
    </button>
  )
}

export function ChapterTracker({
  chapters,
  progress,
  activeIndex,
  onSelect,
}: {
  chapters: readonly Chapter[]
  progress: MotionValue<number>
  activeIndex: number
  onSelect: (id: string) => void
}) {
  const lineScale = useTransform(progress, [0, 1], [0, 1])
  return (
    <motion.nav aria-label="Home page chapters" className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-center py-3 lg:flex" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
      <div className="absolute top-7 bottom-7 left-1/2 w-px -translate-x-1/2 bg-alt/10" />
      <motion.div className="absolute top-7 bottom-7 left-1/2 w-px origin-top -translate-x-1/2 bg-linear-to-b from-main to-[#ffb84d]" style={{ scaleY: lineScale }} />
      <div className="relative flex flex-col gap-5">
        {chapters.map((chapter, index) => (
          <TrackerDot key={chapter.id} chapter={chapter} index={index} count={chapters.length} active={activeIndex === index} progress={progress} onSelect={() => onSelect(chapter.id)} />
        ))}
      </div>
    </motion.nav>
  )
}
