import { motion, useTransform, type MotionValue } from "framer-motion"

export function ScrollAtmosphere({ progress }: { progress: MotionValue<number> }) {
  const tint = useTransform(
    progress,
    [0, 0.3, 0.6, 1],
    [
      "rgba(0,107,112,.015)",
      "rgba(66,209,213,.055)",
      "rgba(255,184,77,.035)",
      "rgba(0,107,112,.04)",
    ],
  )
  const y = useTransform(progress, [0, 1], ["8%", "72%"])
  const x = useTransform(progress, [0, 0.5, 1], ["70%", "15%", "65%"])
  const rotate = useTransform(progress, [0, 1], [0, 380])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ backgroundColor: tint }} />
      <motion.div
        className="absolute size-[clamp(220px,32vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[35%] border border-main/15 bg-main/[.025] shadow-[0_0_90px_rgba(66,209,213,.08)]"
        style={{ top: y, left: x, rotate }}
      >
        <div className="absolute inset-[18%] rotate-45 rounded-full border border-[#ffb84d]/20" />
        <div className="absolute inset-[32%] rounded-[30%] border border-main/25" />
      </motion.div>
      <div className="absolute inset-0 opacity-[.1] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_50%,black,transparent)] bg-[linear-gradient(rgba(0,107,112,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(0,107,112,.16)_1px,transparent_1px)] bg-[size:72px_72px]" />
    </div>
  )
}
