import { cn } from "@/lib/utils"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useRef, useState } from "react"
import { mediaUrl } from "@/lib/media"
import LazyImage from "./LazyImage"

export type HoverImageRevealItem = {
  title?: string
  image: string
  category?: string
}

export function HoverImageReveal({
  items,
  className,
}: {
  items: HoverImageRevealItem[]
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 280, damping: 30, mass: 0.35 })
  const y = useSpring(pointerY, { stiffness: 280, damping: 30, mass: 0.35 })

  const positionPreview = (clientX: number, clientY: number) => {
    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return

    const previewWidth = Math.min(400, bounds.width * 0.42)
    const previewHeight = Math.min(280, window.innerHeight * 0.34)
    const nextX = Math.max(
      12,
      Math.min(bounds.width - previewWidth - 12, clientX - bounds.left + 28)
    )
    const nextY = Math.max(
      12,
      Math.min(bounds.height - previewHeight - 12, clientY - bounds.top - 132)
    )
    pointerX.set(nextX)
    pointerY.set(nextY)
  }

  const activeItem = activeIndex === null ? null : items[activeIndex]

  return (
    <div
      ref={containerRef}
      className={cn("relative isolate", className)}
      onPointerMove={(event) => positionPreview(event.clientX, event.clientY)}
      onPointerLeave={() => setActiveIndex(null)}
    >
      <AnimatePresence>
        {activeItem ? (
          <motion.figure
            key={activeItem.image}
            className="pointer-events-none absolute top-0 left-0 z-50 hidden h-[min(280px,34vh)] w-[min(400px,42vw)] overflow-hidden rounded-[2rem] border border-main/25 bg-[#dcebea] shadow-[0_30px_90px_rgba(3,28,29,0.32)] lg:block"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.88, rotate: 3 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
            aria-hidden="true"
          >
            <div className="absolute inset-4 bottom-14 grid place-items-center overflow-hidden rounded-[1.3rem] bg-[radial-gradient(circle_at_top,#fff_0%,#eef7f5_68%,#d8e8e6_100%)] p-5 ring-1 ring-black/[0.04]">
              <LazyImage
                src={mediaUrl(activeItem.image)}
                alt=""
                className="block h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(5,32,33,.12)]"
              />
            </div>
            <figcaption className="absolute right-4 bottom-3 left-4 flex items-center justify-between rounded-full bg-[#071819]/90 px-3 py-2 text-[9px] font-black tracking-[0.14em] text-white uppercase backdrop-blur-md">
              <span className="min-w-0 leading-tight whitespace-normal">
                {activeItem.category}
              </span>
              <ArrowUpRight className="size-3.5 text-main" />
            </figcaption>
          </motion.figure>
        ) : null}
      </AnimatePresence>

      <div className="border-t border-alt/10 dark:border-foreground/10">
        {items.map((item, index) => {
          const active = activeIndex === index
          return (
            <div
              key={`${item.title}-${item.image}`}
              role="group"
              tabIndex={0}
              className="group grid min-h-20 cursor-default grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-alt/10 px-1 transition-colors duration-300 outline-none hover:bg-main/[0.035] focus-visible:bg-main/[0.05] sm:min-h-24 sm:gap-7 dark:border-foreground/10"
              onPointerEnter={(event) => {
                setActiveIndex(index)
                const row = event.currentTarget.getBoundingClientRect()
                positionPreview(
                  row.right - Math.min(360, row.width * 0.25),
                  row.top + row.height / 2
                )
              }}
              onFocus={(event) => {
                setActiveIndex(index)
                const bounds = event.currentTarget.getBoundingClientRect()
                positionPreview(
                  bounds.right - 260,
                  bounds.top + bounds.height / 2
                )
              }}
              onBlur={() => setActiveIndex(null)}
            >
              <span className="w-7 text-[9px] font-black tracking-[0.14em] text-alt/30 dark:text-foreground/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 items-center">
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[clamp(1rem,2.1vw,1.7rem)] leading-tight font-black tracking-[-0.035em] break-words text-alt transition-[transform,color,opacity] duration-300 dark:text-foreground",
                    active
                      ? "translate-x-2 text-main"
                      : "group-hover:translate-x-2 group-hover:text-main"
                  )}
                >
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-[9px] font-bold tracking-[0.16em] text-alt/35 uppercase sm:block dark:text-foreground/35">
                  {item.category}
                </span>
                <span className="grid size-8 place-items-center rounded-full border border-alt/10 text-alt/40 transition duration-300 group-hover:rotate-45 group-hover:border-main/30 group-hover:text-main dark:border-foreground/10 dark:text-foreground/40">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
