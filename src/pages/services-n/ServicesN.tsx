import LangHandler from "@/components/LangHandler"
import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"
import { useState, useEffect } from "react"

function ServicesN() {
  useSignals()
  const [activeTab, setActiveTab] = useState("discovery")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const showToast = (message: string) => {
    const existing = document.querySelector(".modern-toast") as HTMLElement
    if (existing) existing.remove()

    const toast = document.createElement("div")
    toast.className = "modern-toast"
    toast.innerText = message
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(16px);
      color: #0f172a;
      padding: 14px 28px;
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      font-family: 'Inter Variable', sans-serif;
      backdrop-filter: blur(20px) saturate(180%);
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(0, 107, 112, 0.15);
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.5) inset;
      z-index: 9999;
      letter-spacing: -0.2px;
      pointer-events: none;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `
    document.body.appendChild(toast)

    requestAnimationFrame(() => {
      toast.style.opacity = "1"
      toast.style.transform = "translateX(-50%) translateY(0)"
    })

    setTimeout(() => {
      toast.style.opacity = "0"
      toast.style.transform = "translateX(-50%) translateY(16px)"
      setTimeout(() => toast.remove(), 400)
    }, 3000)
  }

  const tabs = [
    { id: "discovery", labelKey: "serviceTabDiscovery" },
    { id: "platforms", labelKey: "serviceTabPlatforms" },
    { id: "dashboards", labelKey: "serviceTabDashboards" },
    { id: "integration", labelKey: "serviceTabIntegration" },
    { id: "hosting", labelKey: "serviceTabHosting" },
    { id: "training", labelKey: "serviceTabTraining" },
  ]

  const services = {
    discovery: {
      id: "discovery",
      titleKey: "serviceDiscoveryTitle",
      subtitleKey: "serviceDiscoverySubtitle",
      forTextKey: "serviceDiscoveryForText",
      doTextKey: "serviceDiscoveryDoText",
      listTitleKey: "serviceDiscoveryListTitle",
      listItems: [
        "serviceDiscoveryList1",
        "serviceDiscoveryList2",
        "serviceDiscoveryList3",
        "serviceDiscoveryList4",
        "serviceDiscoveryList5",
      ],
      outcomeTextKey: "serviceDiscoveryOutcomeText",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      ),
    },
    platforms: {
      id: "platforms",
      titleKey: "servicePlatformsTitle",
      subtitleKey: "servicePlatformsSubtitle",
      forTextKey: "servicePlatformsForText",
      doTextKey: "servicePlatformsDoText",
      listTitleKey: "servicePlatformsListTitle",
      listItems: [
        "servicePlatformsList1",
        "servicePlatformsList2",
        "servicePlatformsList3",
        "servicePlatformsList4",
        "servicePlatformsList5",
      ],
      outcomeTextKey: "servicePlatformsOutcomeText",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <path d="M6 8h.01M6 12h.01" />
          <path d="M10 8h8M10 12h5" />
        </svg>
      ),
    },
    dashboards: {
      id: "dashboards",
      titleKey: "serviceDashboardsTitle",
      subtitleKey: "serviceDashboardsSubtitle",
      forTextKey: "serviceDashboardsForText",
      doTextKey: "serviceDashboardsDoText",
      listTitleKey: "serviceDashboardsListTitle",
      listItems: [
        "serviceDashboardsList1",
        "serviceDashboardsList2",
        "serviceDashboardsList3",
        "serviceDashboardsList4",
        "serviceDashboardsList5",
      ],
      outcomeTextKey: "serviceDashboardsOutcomeText",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
      ),
    },
    integration: {
      id: "integration",
      titleKey: "serviceIntegrationTitle",
      subtitleKey: "serviceIntegrationSubtitle",
      forTextKey: "serviceIntegrationForText",
      doTextKey: "serviceIntegrationDoText",
      listTitleKey: "serviceIntegrationListTitle",
      listItems: [
        "serviceIntegrationList1",
        "serviceIntegrationList2",
        "serviceIntegrationList3",
        "serviceIntegrationList4",
        "serviceIntegrationList5",
      ],
      outcomeTextKey: "serviceIntegrationOutcomeText",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    hosting: {
      id: "hosting",
      titleKey: "serviceHostingTitle",
      subtitleKey: "serviceHostingSubtitle",
      forTextKey: "serviceHostingForText",
      doTextKey: "serviceHostingDoText",
      listTitleKey: "serviceHostingListTitle",
      listItems: [
        "serviceHostingList1",
        "serviceHostingList2",
        "serviceHostingList3",
        "serviceHostingList4",
        "serviceHostingList5",
      ],
      outcomeTextKey: "serviceHostingOutcomeText",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <path d="M6 6h.01M6 18h.01" />
        </svg>
      ),
    },
    training: {
      id: "training",
      titleKey: "serviceTrainingTitle",
      subtitleKey: "serviceTrainingSubtitle",
      forTextKey: "serviceTrainingForText",
      doTextKey: "serviceTrainingDoText",
      listTitleKey: "serviceTrainingListTitle",
      listItems: [
        "serviceTrainingList1",
        "serviceTrainingList2",
        "serviceTrainingList3",
        "serviceTrainingList4",
        "serviceTrainingList5",
      ],
      outcomeTextKey: "serviceTrainingOutcomeText",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  }

  const currentService = services[activeTab as keyof typeof services]

  const workModels = [
    {
      titleKey: "workDiscoveryTitle",
      descKey: "workDiscoveryDesc",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
    },
    {
      titleKey: "workEndToEndTitle",
      descKey: "workEndToEndDesc",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      ),
    },
    {
      titleKey: "workOngoingTitle",
      descKey: "workOngoingDesc",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a10 10 0 1 0 10 10" />
          <path d="M12 12l7-7" />
          <path d="M12 12v10" />
        </svg>
      ),
    },
  ]

  return (
    <PageLayout
      title="servicesTitle"
      subtitle="servicesSubtitle"
      badge="servicesBadge"
      className="relative overflow-hidden bg-slate-50/50"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-drift absolute -top-60 -right-40 h-[600px] w-[600px] rounded-full bg-main/[0.07] blur-[120px]" />
        <div className="animate-drift-slow absolute -bottom-60 -left-40 h-[600px] w-[600px] rounded-full bg-alt/[0.05] blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-main/[0.03] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,107,112,0.15) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Intro text */}
      <div
        className={`mx-auto mt-8 max-w-3xl text-center transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <p className="leading-relaxed text-slate-500">
          <LangHandler content="servicesIntro" />
        </p>
      </div>

      {/* Main 2-column layout */}
      <div className="mx-auto mt-12 max-w-7xl px-4">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* LEFT COLUMN — Sticky navigation */}
          <div className="lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-8">
              {/* Tabs */}
              <div
                className={`flex flex-wrap gap-2 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              >
                {tabs.map((tab, i) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-500 ${
                      activeTab === tab.id
                        ? "scale-105 bg-main text-white shadow-lg shadow-main/25"
                        : "border border-slate-200/60 bg-white/60 text-slate-500 backdrop-blur-sm hover:bg-white hover:text-slate-700"
                    }`}
                    style={{ transitionDelay: mounted ? `${i * 60}ms` : "0ms" }}
                  >
                    <LangHandler
                      content={tab.labelKey as keyof typeof translator.en}
                    />
                    {activeTab === tab.id && (
                      <span className="animate-pulse-soft absolute inset-0 -z-10 rounded-full bg-main/20 blur-md" />
                    )}
                  </button>
                ))}
              </div>

              {/* Service Overview Card */}
              <div
                className={`group relative rounded-[2rem] border border-slate-200/60 bg-white/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all delay-100 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              >
                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-main/20 to-transparent" />

                <div className="p-8 md:p-10">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-main/10 to-main/5 text-main shadow-sm ring-1 ring-main/10 transition-all duration-500 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-main/10">
                    <div className="h-10 w-10">{currentService.icon}</div>
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                    <LangHandler
                      content={
                        currentService.titleKey as keyof typeof translator.en
                      }
                    />
                  </h2>
                  <p className="mt-2 text-base font-medium text-main/80">
                    <LangHandler
                      content={
                        currentService.subtitleKey as keyof typeof translator.en
                      }
                    />
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-main" />
                    <LangHandler content="serviceActiveLabel" />
                  </div>
                </div>
              </div>

              {/* Mini CTA */}
              <div
                className={`relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-gradient-to-br from-main/[0.04] to-main/[0.01] p-6 backdrop-blur-sm transition-all delay-200 duration-700 md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              >
                <div className="absolute top-0 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-main/30 to-transparent" />
                <p className="mb-4 text-sm font-medium text-slate-600">
                  <LangHandler content="servicesCTAText" />
                </p>
                <Button
                  onClick={() => showToast("Let's talk about your project")}
                  className="group relative h-11 w-full rounded-full bg-gradient-to-r from-main to-alt px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-main/20 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <LangHandler content="servicesCTAButton" />
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Scrollable details */}
          <div className="lg:col-span-7" key={activeTab}>
            <div className="space-y-5">
              {/* Who it's for */}
              <div
                className={`group relative rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-700 hover:border-slate-300/60 hover:bg-white/80 hover:shadow-md md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: mounted ? "300ms" : "0ms" }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-main to-main/30" />
                  <h4 className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                    <LangHandler content="serviceForLabel" />
                  </h4>
                </div>
                <p className="pl-4 leading-relaxed text-slate-500">
                  <LangHandler
                    content={
                      currentService.forTextKey as keyof typeof translator.en
                    }
                  />
                </p>
              </div>

              {/* What we do */}
              <div
                className={`group relative rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-700 hover:border-slate-300/60 hover:bg-white/80 hover:shadow-md md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: mounted ? "380ms" : "0ms" }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-main to-main/30" />
                  <h4 className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                    <LangHandler content="serviceDoLabel" />
                  </h4>
                </div>
                <p className="pl-4 leading-relaxed text-slate-500">
                  <LangHandler
                    content={
                      currentService.doTextKey as keyof typeof translator.en
                    }
                  />
                </p>
              </div>

              {/* What's Included / Deliverables */}
              <div
                className={`group relative rounded-2xl border border-main/10 bg-gradient-to-br from-main/[0.03] to-main/[0.01] p-6 backdrop-blur-sm transition-all duration-700 md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: mounted ? "460ms" : "0ms" }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-main to-main/30" />
                  <h4 className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                    <LangHandler
                      content={
                        currentService.listTitleKey as keyof typeof translator.en
                      }
                    />
                  </h4>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {currentService.listItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="group/item flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all duration-300 hover:border-slate-100 hover:bg-white/60"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-main/10 text-main ring-1 ring-main/20">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="h-3 w-3"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <span className="text-sm leading-snug text-slate-600">
                        <LangHandler
                          content={item as keyof typeof translator.en}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcome */}
              <div
                className={`group relative rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-700 hover:border-slate-300/60 hover:bg-white/80 hover:shadow-md md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: mounted ? "540ms" : "0ms" }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-main to-main/30" />
                  <h4 className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                    <LangHandler content="serviceOutcomeLabel" />
                  </h4>
                </div>
                <p className="pl-4 leading-relaxed text-slate-500">
                  <LangHandler
                    content={
                      currentService.outcomeTextKey as keyof typeof translator.en
                    }
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ways to work with us */}
      <div
        className={`mx-auto mt-20 max-w-7xl px-4 transition-all delay-300 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <div className="mb-10 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-slate-800">
            <LangHandler content="workWaysTitle" />
          </h3>
          <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-main to-transparent" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {workModels.map((model, idx) => (
            <div
              key={idx}
              className="group relative rounded-[2rem] border border-slate-200/60 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-main/10 hover:bg-white hover:shadow-lg hover:shadow-main/5 md:p-10"
              style={{
                transitionDelay: mounted ? `${400 + idx * 100}ms` : "0ms",
              }}
            >
              <div className="absolute top-0 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-main/20 to-transparent" />

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-main/10 to-main/5 text-main ring-1 ring-main/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-main/10">
                <div className="h-7 w-7">{model.icon}</div>
              </div>

              <h4 className="mb-3 text-lg font-bold tracking-tight text-slate-800">
                <LangHandler
                  content={model.titleKey as keyof typeof translator.en}
                />
              </h4>
              <p className="text-sm leading-relaxed text-slate-500">
                <LangHandler
                  content={model.descKey as keyof typeof translator.en}
                />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className={`mx-auto mt-16 max-w-3xl px-4 text-center transition-all delay-500 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <div className="relative rounded-[2rem] border border-slate-200/60 bg-white/60 p-8 backdrop-blur-sm md:p-10">
          <div className="pointer-events-none absolute -inset-px rounded-[2rem] bg-gradient-to-b from-main/5 to-transparent opacity-50" />
          <div className="relative">
            <p className="mb-2 text-lg font-bold text-slate-800">
              <LangHandler content="servicesBottomCTATitle" />
            </p>
            <p className="mb-6 text-base text-slate-500">
              <LangHandler content="servicesBottomCTADesc" />
            </p>
            <Button
              onClick={() => showToast("Talk to us about your needs")}
              className="group relative h-12 rounded-full bg-gradient-to-r from-main to-alt px-8 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-main/20 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <LangHandler content="servicesBottomCTAButton" />
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, -20px) scale(1.05); }
          66% { transform: translate(25px, 30px) scale(0.98); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-drift {
          animation: drift 25s ease-in-out infinite;
        }
        .animate-drift-slow {
          animation: drift-slow 30s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
      `}</style>
    </PageLayout>
  )
}

export default ServicesN
