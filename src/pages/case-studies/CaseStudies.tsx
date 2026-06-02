import LangHandler from "@/components/LangHandler"
import PageLayout from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"
import { useState, useEffect } from "react"

function CaseStudies() {
  useSignals()
  const [activeTab, setActiveTab] = useState("public")
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
    { id: "public", labelKey: "tabPublic" },
    { id: "ngo", labelKey: "tabNGO" },
    { id: "private", labelKey: "tabPrivate" },
    { id: "cross", labelKey: "tabCross" },
  ]

  const caseStudies = {
    public: {
      id: "public",
      titleKey: "casePublicTitle",
      subtitleKey: "casePublicSubtitle",
      contextKey: "casePublicContext",
      challengesKey: "casePublicChallenges",
      solutionKey: "casePublicSolution",
      elementsKey: "casePublicElements",
      resultsKey: "casePublicResults",
      results: [
        "casePublicResult1",
        "casePublicResult2",
        "casePublicResult3",
        "casePublicResult4",
      ],
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
          <rect x="8" y="4" width="8" height="16" rx="1" />
        </svg>
      ),
    },
    ngo: {
      id: "ngo",
      titleKey: "caseNgoTitle",
      subtitleKey: "caseNgoSubtitle",
      contextKey: "caseNgoContext",
      challengesKey: "caseNgoChallenges",
      solutionKey: "caseNgoSolution",
      elementsKey: "caseNgoElements",
      resultsKey: "caseNgoResults",
      results: [
        "caseNgoResult1",
        "caseNgoResult2",
        "caseNgoResult3",
        "caseNgoResult4",
      ],
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    private: {
      id: "private",
      titleKey: "casePrivateTitle",
      subtitleKey: "casePrivateSubtitle",
      contextKey: "casePrivateContext",
      challengesKey: "casePrivateChallenges",
      solutionKey: "casePrivateSolution",
      elementsKey: "casePrivateElements",
      resultsKey: "casePrivateResults",
      results: [
        "casePrivateResult1",
        "casePrivateResult2",
        "casePrivateResult3",
        "casePrivateResult4",
      ],
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="9" width="18" height="12" rx="2" />
          <path d="M7 9V7a5 5 0 0 1 10 0v2" />
        </svg>
      ),
    },
    cross: {
      id: "cross",
      titleKey: "caseCrossTitle",
      subtitleKey: "caseCrossSubtitle",
      contextKey: "caseCrossContext",
      challengesKey: "caseCrossChallenges",
      solutionKey: "caseCrossSolution",
      elementsKey: "caseCrossElements",
      resultsKey: "caseCrossResults",
      results: [
        "caseCrossResult1",
        "caseCrossResult2",
        "caseCrossResult3",
        "caseCrossResult4",
      ],
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 4L20 6L18 8M6 20L4 18L6 16" />
          <path d="M20 18L18 20L16 18M4 6L6 4L8 6" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  }

  const currentCase = caseStudies[activeTab as keyof typeof caseStudies]

  const detailSections = [
    { label: "caseContextLabel", key: currentCase.contextKey },
    { label: "caseChallengesLabel", key: currentCase.challengesKey },
    { label: "caseSolutionLabel", key: currentCase.solutionKey },
    { label: "caseElementsLabel", key: currentCase.elementsKey },
  ]

  return (
    <PageLayout
      title="caseStudiesTitle"
      subtitle="caseStudiesSubtitle"
      badge="caseStudiesBadge"
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

      {/* Main 2-column layout */}
      <div className="mx-auto mt-12 max-w-7xl px-4">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* LEFT COLUMN — Sticky navigation + overview */}
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

              {/* Case Overview Card */}
              <div
                className={`group relative rounded-[2rem] border border-slate-200/60 bg-white/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all delay-100 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              >
                <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-main/20 to-transparent" />

                <div className="p-8 md:p-10">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-main/10 to-main/5 text-main shadow-sm ring-1 ring-main/10 transition-all duration-500 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-main/10">
                    <div className="h-10 w-10">{currentCase.icon}</div>
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                    <LangHandler
                      content={
                        currentCase.titleKey as keyof typeof translator.en
                      }
                    />
                  </h2>
                  <p className="mt-2 text-base font-medium text-main/80">
                    <LangHandler
                      content={
                        currentCase.subtitleKey as keyof typeof translator.en
                      }
                    />
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-main" />
                    Active Case Study
                  </div>
                </div>
              </div>

              {/* Common Section */}
              <div
                className={`relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-gradient-to-br from-white/80 to-slate-50/80 p-8 backdrop-blur-sm transition-all delay-200 duration-700 md:p-10 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              >
                <div className="absolute top-0 left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-main/30 to-transparent" />

                <h3 className="mb-2 text-center text-lg font-bold tracking-tight text-slate-800">
                  <LangHandler content="caseCommonTitle" />
                </h3>
                <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-main to-transparent" />

                <div className="space-y-3">
                  {["caseCommon1", "caseCommon2", "caseCommon3"].map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-300 hover:border-slate-100 hover:bg-white hover:shadow-sm"
                      >
                        <div className="h-2.5 w-2.5 rounded-full bg-main shadow-[0_0_8px_rgba(0,107,112,0.4)] transition-transform duration-300 group-hover:scale-125" />
                        <span className="text-sm font-medium text-slate-600">
                          <LangHandler
                            content={item as keyof typeof translator.en}
                          />
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Scrollable details */}
          <div className="lg:col-span-7" key={activeTab}>
            <div className="space-y-5">
              {/* Detail Cards */}
              {detailSections.map((section, idx) => (
                <div
                  key={section.label}
                  className={`group relative rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-700 hover:border-slate-300/60 hover:bg-white/80 hover:shadow-md md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                  style={{
                    transitionDelay: mounted ? `${300 + idx * 80}ms` : "0ms",
                  }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-gradient-to-b from-main to-main/30" />
                    <h4 className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                      <LangHandler
                        content={section.label as keyof typeof translator.en}
                      />
                    </h4>
                  </div>
                  <p className="pl-4 leading-relaxed text-slate-500">
                    <LangHandler
                      content={section.key as keyof typeof translator.en}
                    />
                  </p>
                </div>
              ))}

              {/* Results Card */}
              <div
                className={`relative rounded-2xl border border-main/10 bg-gradient-to-br from-main/[0.03] to-main/[0.01] p-6 backdrop-blur-sm transition-all duration-700 md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: mounted ? "620ms" : "0ms" }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-6 w-1 rounded-full bg-gradient-to-b from-main to-main/30" />
                  <h4 className="text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                    <LangHandler content="caseResultsLabel" />
                  </h4>
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {currentCase.results.map((result, idx) => (
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
                          content={result as keyof typeof translator.en}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Card */}
              <div
                className={`relative rounded-2xl border border-slate-200/60 bg-white/60 p-6 backdrop-blur-sm transition-all duration-700 md:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: mounted ? "700ms" : "0ms" }}
              >
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-main/5 to-transparent opacity-50" />

                <div className="relative">
                  <p className="mb-6 text-base font-medium text-slate-500">
                    <LangHandler content="caseCTAText" />
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => showToast("Let's discuss your challenge")}
                      className="group relative h-11 rounded-full bg-gradient-to-r from-main to-alt px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-main/20 active:scale-95"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <LangHandler content="caseCTAPrimary" />
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

                    <Button
                      onClick={() => showToast("Explore our services")}
                      className="group h-11 rounded-full border-2 border-slate-200 bg-white/50 px-6 text-sm font-semibold text-slate-600 transition-all duration-300 hover:border-main/40 hover:bg-main/5 hover:text-main active:scale-95"
                    >
                      <LangHandler content="caseCTASecondary" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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

export default CaseStudies
