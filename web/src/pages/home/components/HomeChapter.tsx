import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function HomeChapter({ id, index, children }: { id: string; index: number; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      data-home-chapter={index}
      className={`relative z-10 scroll-mt-24 [contain-intrinsic-size:auto_900px] [content-visibility:auto] ${index === 0 ? "min-h-[100svh]" : "flex min-h-[82svh] items-center py-[5svh]"}`}
      initial={index === 0 ? false : { opacity: 0, y: 72, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {index > 0 ? <div className="pointer-events-none absolute top-[8%] right-[7%] -z-10 text-[clamp(5rem,15vw,14rem)] leading-none font-black tracking-[-.09em] text-main/[.025] select-none">0{index + 1}</div> : null}
      <div className="w-full">{children}</div>
    </motion.section>
  )
}
