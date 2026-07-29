import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import type { RouteSectionBody } from "@/pages/site/types"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3, Blocks, Check, Compass, GraduationCap, Info, Monitor, Search, ShieldCheck, Wrench, type LucideIcon } from "lucide-react"
import { useState } from "react"

const icons: Record<string, LucideIcon> = {
  search: Search, monitor: Monitor, chart: BarChart3, blocks: Blocks, shield: ShieldCheck, training: GraduationCap, wrench: Wrench,
  compass: Compass, delivery: ArrowRight, ongoing: Wrench,
}

function showToast(message: string) {
  if (!message) return
  document.querySelector(".modern-toast")?.remove()
  const toast = document.createElement("div")
  toast.className = "modern-toast fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-main/15 bg-white/90 px-7 py-3 text-sm font-semibold text-slate-800 shadow-2xl backdrop-blur-xl"
  toast.textContent = message
  document.body.appendChild(toast)
  window.setTimeout(() => toast.remove(), 3000)
}

export default function ServicesN({ content }: { content?: RouteSectionBody }) {
  const details = content?.servicesDetail
  const services = details?.services ?? []
  const [selectedId, setSelectedId] = useState("")
  const current = services.find((service) => service.id === selectedId) ?? services[0]
  const CurrentIcon = icons[current?.icon ?? ""] ?? Wrench

  return <PageLayout cmsOnly badgeText={content?.badge} titleText={content?.heading} subtitleText={content?.subheading}>
    <p className="mx-auto mt-8 max-w-3xl text-center leading-relaxed text-slate-500 dark:text-foreground/55">{details?.intro}</p>
    {current ? <div className="mx-auto mt-12 max-w-7xl px-4"><div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
        <div className="flex flex-wrap gap-2">{services.map((service) => <button key={service.id} type="button" onClick={() => setSelectedId(service.id)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${current.id === service.id ? "bg-main text-white shadow-lg shadow-main/25" : "border border-slate-200/60 bg-white/60 text-slate-500 dark:border-foreground/10 dark:bg-white/[.045]"}`}>{service.tabLabel}</button>)}</div>
        <motion.div key={current.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200/60 bg-white/70 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,.08)] backdrop-blur-xl dark:border-foreground/10 dark:bg-[#0a2022]/82"><span className="grid size-20 place-items-center rounded-3xl bg-main/10 text-main"><CurrentIcon className="size-10" /></span><h2 className="mt-6 text-3xl font-bold text-slate-800 dark:text-foreground">{current.title}</h2><p className="mt-2 font-medium text-main/80">{current.subtitle}</p><div className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase"><span className="size-1.5 animate-pulse rounded-full bg-main" />{details?.activeLabel}</div></motion.div>
        <div className="rounded-[2rem] border border-main/10 bg-main/[.035] p-7"><p className="mb-4 text-sm font-medium text-slate-600 dark:text-foreground/62">{details?.ctaText}</p><Button onClick={() => showToast(details?.ctaToast ?? "")} className="w-full rounded-xl bg-alt text-white hover:bg-main">{details?.ctaButton}<ArrowRight className="size-4 rtl:rotate-180" /></Button></div>
      </aside>
      <div className="space-y-5 lg:col-span-7" key={current.id}>
        {[{ label: details?.audienceLabel, value: current.audience, icon: Info }, { label: details?.approachLabel, value: current.approach, icon: Blocks }].map(({ label, value, icon: Icon }) => <motion.section key={label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-slate-200/60 bg-white/60 p-7 backdrop-blur-sm dark:border-foreground/10 dark:bg-white/[.045]"><h3 className="flex items-center gap-3 text-xs font-bold tracking-widest text-slate-800 uppercase dark:text-foreground"><Icon className="size-4 text-main" />{label}</h3><p className="mt-4 leading-relaxed text-slate-500 dark:text-foreground/55">{value}</p></motion.section>)}
        <section className="rounded-2xl border border-main/10 bg-main/[.03] p-7"><h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase dark:text-foreground">{current.listTitle}</h3><ul className="mt-5 grid gap-3 sm:grid-cols-2">{current.listItems.map((item, index) => <li key={`${item.text}-${index}`} className="flex items-start gap-3 rounded-xl p-3 text-sm text-slate-600 dark:text-foreground/62"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-main/10 text-main"><Check className="size-3" /></span>{item.text}</li>)}</ul></section>
        <section className="rounded-2xl border border-slate-200/60 bg-white/60 p-7 dark:border-foreground/10 dark:bg-white/[.045]"><h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase dark:text-foreground">{details?.outcomeLabel}</h3><p className="mt-4 leading-relaxed text-slate-500 dark:text-foreground/55">{current.outcome}</p></section>
      </div>
    </div></div> : null}
    <section className="mx-auto mt-20 max-w-7xl px-4"><h3 className="text-center text-2xl font-bold text-slate-800 dark:text-foreground">{details?.workWaysTitle}</h3><div className="mt-10 grid gap-5 md:grid-cols-3">{details?.workModels.map((model, index) => { const Icon = icons[model.icon] ?? Compass; return <motion.article key={`${model.title}-${index}`} whileHover={{ y: -8 }} className="rounded-[2rem] border border-slate-200/60 bg-white/70 p-8 backdrop-blur-sm dark:border-foreground/10 dark:bg-[#0a2022]/78"><span className="grid size-14 place-items-center rounded-2xl bg-main/10 text-main"><Icon className="size-7" /></span><h4 className="mt-5 text-lg font-bold text-slate-800 dark:text-foreground">{model.title}</h4><p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-foreground/55">{model.description}</p></motion.article> })}</div></section>
    <section className="mx-auto mt-16 max-w-3xl rounded-[2rem] border border-slate-200/60 bg-white/60 p-8 text-center backdrop-blur-sm dark:border-foreground/10 dark:bg-[#0a2022]/78"><h3 className="text-lg font-bold text-slate-800 dark:text-foreground">{details?.bottomTitle}</h3><p className="mt-2 text-slate-500 dark:text-foreground/55">{details?.bottomDescription}</p><Button onClick={() => showToast(details?.bottomToast ?? "")} className="mt-6 rounded-xl bg-alt px-8 text-white hover:bg-main">{details?.bottomButton}<ArrowRight className="size-4 rtl:rotate-180" /></Button></section>
  </PageLayout>
}
