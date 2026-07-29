import PageLayout from "@/components/PageLayout"
import type { RouteSectionBody } from "@/pages/site/types"
import { motion } from "framer-motion"
import { Clock3, Globe2, Link2, ShieldCheck, Star, type LucideIcon } from "lucide-react"
import { useState } from "react"

const icons: Record<string, LucideIcon> = { link: Link2, shield: ShieldCheck, clock: Clock3, globe: Globe2, star: Star }

export default function WhyChooseUs({ content }: { content?: RouteSectionBody }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const details = content?.aboutWhy
  const reasons = details?.reasons ?? []

  return <PageLayout cmsOnly badgeText={content?.badge} titleText={content?.heading} subtitleText={content?.subheading}>
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"><div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,transparent_45%,rgba(0,107,112,0.02)_45%,rgba(0,107,112,0.02)_55%,transparent_55%,transparent_100%)]" /><div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-main/3 blur-3xl" /><div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-alt/3 blur-3xl" /></div>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative hidden md:block"><div className="sticky top-32"><motion.div className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white/70 to-main/8 p-8 shadow-[0_24px_70px_rgba(18,36,35,0.09)] backdrop-blur-md" initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><div className="text-8xl font-black text-alt/10">{String(reasons.length).padStart(2, "0")}</div><div className="-mt-12"><div className="text-3xl font-bold text-alt">{details?.quoteTitle}</div><div className="mt-6 h-px w-12 bg-main" /><p className="mt-6 text-alt/60">{details?.quoteText}</p></div></motion.div><div className="mt-8 flex justify-between">{reasons.map((_, index) => <span key={index} className="text-2xl font-black text-alt/10">{String(index + 1).padStart(2, "0")}</span>)}</div></div></div>
      <div className="space-y-4">{reasons.map((reason, index) => {
        const Icon = icons[reason.icon] ?? Star
        const active = activeIndex === index
        return <motion.article key={`${reason.title}-${index}`} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} initial={{ opacity: 0, x: 34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .07 }} className="group cursor-pointer"><div className={`relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all ${active ? "border-main/35 bg-white/85 shadow-[0_24px_64px_rgba(0,107,112,.14)]" : "border-white/70 bg-white/50"}`}><div className="flex items-start gap-5 p-6"><span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${active ? "bg-main text-white" : "bg-main/10 text-main"}`}><Icon className="size-6" /></span><div className="flex-1"><h3 className={`text-lg font-bold ${active ? "text-main" : "text-alt"}`}>{reason.title}</h3><div className={`overflow-hidden transition-all ${active ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0"}`}><p className="text-sm leading-relaxed text-alt/60">{reason.description}</p></div><div className={`mt-1 text-xs text-alt/30 ${active ? "opacity-0" : "opacity-100"}`}>{details?.hoverHint}</div></div></div></div></motion.article>
      })}</div>
    </div>
  </PageLayout>
}
