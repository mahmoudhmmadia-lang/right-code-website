import LangHandler from "@/components/LangHandler"
import PageLayout from "@/components/PageLayout"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"
import { useState } from "react"

function WhyChooseUs() {
  useSignals()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const reasons = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 7h-4.5A2.5 2.5 0 0 0 13 9.5v0A2.5 2.5 0 0 0 15.5 12H18" />
          <path d="M4 7h4.5A2.5 2.5 0 0 1 11 9.5v0A2.5 2.5 0 0 1 8.5 12H6" />
          <path d="M12 21v-4" />
          <path d="M12 7V3" />
          <path d="M3 16h4" />
          <path d="M17 16h4" />
        </svg>
      ),
      titleKey: "whyUsReason1Title",
      descKey: "whyUsReason1Desc",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
      titleKey: "whyUsReason2Title",
      descKey: "whyUsReason2Desc",
    },
    {
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
          <path d="M12 6v6l4 2" />
          <path d="M16 21.5L21 20l-1.5-5" />
          <circle cx="18" cy="18" r="3" />
        </svg>
      ),
      titleKey: "whyUsReason3Title",
      descKey: "whyUsReason3Desc",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
          <path d="M12 3v18" />
        </svg>
      ),
      titleKey: "whyUsReason4Title",
      descKey: "whyUsReason4Desc",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path d="M12 2v15.77" />
          <path d="M7 14.14L2 9.27l6.91-1.01L12 2" />
        </svg>
      ),
      titleKey: "whyUsReason5Title",
      descKey: "whyUsReason5Desc",
    },
  ]

  return (
    <PageLayout title="whyUsTitle" subtitle="whyUsSubtitle" badge="whyUsBadge">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,transparent_45%,rgba(0,107,112,0.02)_45%,rgba(0,107,112,0.02)_55%,transparent_55%,transparent_100%)]" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-main/3 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-alt/3 blur-3xl" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative hidden md:block">
          <div className="sticky top-32">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-alt/5 to-main/5 p-8">
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-main/10 blur-2xl" />
              <div className="relative">
                <div className="text-8xl font-black text-alt/10">05</div>
                <div className="-mt-12">
                  <div className="text-3xl font-bold text-alt">
                    <LangHandler content="whyUsQuote" />
                  </div>
                  <div className="mt-6 h-px w-12 bg-main" />
                  <p className="mt-6 text-alt/60">
                    <LangHandler content="whyUsQuoteText" />
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative numbers */}
            <div className="mt-8 flex justify-between">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className="text-2xl font-black text-alt/10 transition-all hover:text-alt/30"
                >
                  {String(num).padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: interactive accordion-style reasons */}
        <div className="space-y-4">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className={`group cursor-pointer transition-all duration-300 ${
                activeIndex === idx ? "scale-[1.02]" : "scale-100"
              }`}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  activeIndex === idx
                    ? "border-main/40 bg-white/80 shadow-xl"
                    : "border-alt/10 bg-white/40 hover:border-alt/20 hover:bg-white/60"
                } backdrop-blur-sm`}
              >
                {/* Animated progress bar on hover */}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-main to-alt transition-all duration-500 ${
                    activeIndex === idx ? "w-full" : "w-0"
                  }`}
                />

                <div className="p-6">
                  <div className="flex items-start gap-5">
                    {/* Icon container with fresh shape (hexagon-inspired) */}
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                        activeIndex === idx
                          ? "bg-gradient-to-br from-main to-alt text-white shadow-lg"
                          : "bg-main/10 text-main"
                      }`}
                    >
                      <div className="h-6 w-6">{reason.icon}</div>
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`text-lg font-bold transition-colors duration-300 ${
                          activeIndex === idx ? "text-main" : "text-alt"
                        }`}
                      >
                        <LangHandler
                          content={
                            reason.titleKey as keyof typeof translator.en
                          }
                        />
                      </h3>

                      {/* Animated description that slides in on hover */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeIndex === idx
                            ? "mt-2 max-h-32 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-sm leading-relaxed text-alt/60">
                          <LangHandler
                            content={
                              reason.descKey as keyof typeof translator.en
                            }
                          />
                        </p>
                      </div>

                      {/* Static hint for non-hover state */}
                      <div
                        className={`mt-1 text-xs text-alt/30 transition-opacity duration-300 ${
                          activeIndex === idx ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <LangHandler content="whyUsHoverHint" />
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <div
                      className={`text-alt/30 transition-all duration-300 ${
                        activeIndex === idx ? "rotate-90 text-main" : ""
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default WhyChooseUs
