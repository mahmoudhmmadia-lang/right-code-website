import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import type { RouteSectionBody } from "@/pages/site/types"
import { motion } from "framer-motion"
import { Building2, HandHeart, LockKeyhole, Network, Check, type LucideIcon } from "lucide-react"
import { useState } from "react"

const icons: Record<string, LucideIcon> = { public: Building2, ngo: HandHeart, private: LockKeyhole, cross: Network }

function showToast(message: string) {
  if (!message) return
  document.querySelector(".modern-toast")?.remove()
  const toast = document.createElement("div")
  toast.className = "modern-toast fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-main/15 bg-white/90 px-7 py-3 text-sm font-semibold text-slate-800 shadow-2xl backdrop-blur-xl"
  toast.textContent = message
  document.body.appendChild(toast)
  window.setTimeout(() => toast.remove(), 3000)
}

export default function CaseStudies({ content }: { content?: RouteSectionBody }) {
  const details = content?.caseStudies
  const cases = details?.cases ?? []
  const [selectedId, setSelectedId] = useState("")
  const current = cases.find((item) => item.id === selectedId) ?? cases[0]
  const CurrentIcon = icons[current?.icon ?? ""] ?? Building2
  const detailSections = current && details ? [
    { label: details.contextLabel, value: current.context },
    { label: details.challengesLabel, value: current.challenges },
    { label: details.solutionLabel, value: current.solution },
    { label: details.elementsLabel, value: current.elements },
  ] : []

  return <PageLayout cmsOnly badgeText={content?.badge} titleText={content?.heading} subtitleText={content?.subheading}>
    {current ? <div className="mx-auto mt-12 max-w-7xl px-4"><div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
        <div className="flex flex-wrap gap-2">{cases.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${current.id === item.id ? "bg-main text-white shadow-lg shadow-main/25" : "border border-slate-200/60 bg-white/60 text-slate-500 dark:border-foreground/10 dark:bg-white/[.045]"}`}>{item.tabLabel}</button>)}</div>
        <motion.div key={current.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200/60 bg-white/70 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,.08)] backdrop-blur-xl dark:border-foreground/10 dark:bg-[#0a2022]/82"><span className="grid size-20 place-items-center rounded-3xl bg-main/10 text-main"><CurrentIcon className="size-10" /></span><h2 className="mt-6 text-3xl font-bold text-slate-800 dark:text-foreground">{current.title}</h2><p className="mt-2 font-medium text-main/80">{current.subtitle}</p><div className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase"><span className="size-1.5 animate-pulse rounded-full bg-main" />{details?.activeLabel}</div></motion.div>
        <section className="rounded-[2rem] border border-main/10 bg-main/[.035] p-8"><h3 className="text-center text-lg font-bold text-slate-800 dark:text-foreground">{details?.commonTitle}</h3><div className="mt-5 grid gap-3">{details?.commonItems.map((item, index) => <div key={`${item.text}-${index}`} className="flex items-start gap-3 rounded-xl bg-white/50 p-3 text-sm text-slate-600 dark:bg-white/[.035] dark:text-foreground/62"><span className="mt-1 size-2 shrink-0 rounded-full bg-main" />{item.text}</div>)}</div></section>
      </aside>
      <div className="space-y-5 lg:col-span-7" key={current.id}>
        {detailSections.map((section, index) => <motion.section key={section.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }} className="rounded-2xl border border-slate-200/60 bg-white/60 p-7 backdrop-blur-sm dark:border-foreground/10 dark:bg-white/[.045]"><h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase dark:text-foreground">{section.label}</h3><p className="mt-4 leading-relaxed text-slate-500 dark:text-foreground/55">{section.value}</p></motion.section>)}
        <section className="rounded-2xl border border-main/10 bg-main/[.03] p-7"><h3 className="text-xs font-bold tracking-widest text-slate-800 uppercase dark:text-foreground">{details?.resultsLabel}</h3><ul className="mt-5 grid gap-3 sm:grid-cols-2">{current.results.map((result, index) => <li key={`${result.text}-${index}`} className="flex items-start gap-3 rounded-xl p-3 text-sm text-slate-600 dark:text-foreground/62"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-main/10 text-main"><Check className="size-3" /></span>{result.text}</li>)}</ul></section>
        <section className="rounded-2xl border border-slate-200/60 bg-white/60 p-7 dark:border-foreground/10 dark:bg-[#0a2022]/78"><p className="text-slate-500 dark:text-foreground/55">{details?.ctaText}</p><div className="mt-6 flex flex-wrap gap-3"><Button onClick={() => showToast(details?.primaryToast ?? "")} className="rounded-full bg-main px-6 text-white">{details?.primaryButton}</Button><Button onClick={() => showToast(details?.secondaryToast ?? "")} variant="outline" className="rounded-full px-6">{details?.secondaryButton}</Button></div></section>
      </div>
    </div></div> : null}
  </PageLayout>
}
