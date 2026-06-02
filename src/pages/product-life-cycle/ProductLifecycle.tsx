import LangHandler from "@/components/LangHandler"
import PageLayout from "@/components/PageLayout"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"

function ProductLifecycle() {
  useSignals()

  const lifecycleSteps = [
    {
      step: "01",
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
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      titleKey: "lifecycleStep1Title",
      descKey: "lifecycleStep1Desc",
      color: "from-main/20 to-main/5",
    },
    {
      step: "02",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
          <circle
            cx="15.5"
            cy="8.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="8.5"
            cy="15.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
          <circle
            cx="15.5"
            cy="15.5"
            r="1.5"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
      titleKey: "lifecycleStep2Title",
      descKey: "lifecycleStep2Desc",
      color: "from-alt/20 to-alt/5",
    },
    {
      step: "03",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      titleKey: "lifecycleStep3Title",
      descKey: "lifecycleStep3Desc",
      color: "from-main/20 to-main/5",
    },
    {
      step: "04",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 16l4-4-4-4" />
          <path d="M12 12h8" />
          <path d="M21 12a9 9 0 0 0-9-9" />
          <path d="M21 12a9 9 0 0 1-9 9" />
        </svg>
      ),
      titleKey: "lifecycleStep4Title",
      descKey: "lifecycleStep4Desc",
      color: "from-alt/20 to-alt/5",
    },
    {
      step: "05",
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
        </svg>
      ),
      titleKey: "lifecycleStep5Title",
      descKey: "lifecycleStep5Desc",
      color: "from-main/20 to-main/5",
    },
  ]

  return (
    <PageLayout
      badge="lifecycleBadge"
      title="lifecycleTitle"
      subtitle="lifecycleSubtitle"
    >
      <div className={`relative overflow-hidden transition-all duration-700`}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-main/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-alt/5 blur-3xl" />
        </div>

        <div className="absolute top-0 bottom-0 left-[32px] hidden w-0.5 bg-linear-to-b from-main/30 via-main/60 to-main/30 md:left-1/2 md:block" />

        {lifecycleSteps.map((step, idx) => (
          <div
            key={idx}
            className={`relative mb-16 flex flex-col md:flex-row ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <div className="absolute top-0 left-0 hidden md:left-1/2 md:block md:-translate-x-1/2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-main to-alt shadow-lg">
                <span className="text-xs font-bold text-white">
                  {step.step}
                </span>
              </div>
            </div>

            <div
              className={`w-full md:w-5/12 ${idx % 2 === 0 ? "md:pr-12" : "md:pl-12 md:text-right"}`}
            >
              <div
                className={`group relative overflow-hidden rounded-2xl border border-main/10 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-main/30 hover:bg-white/80 hover:shadow-xl md:p-8`}
              >
                {/* Step number badge (mobile) */}
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-main to-alt text-xs font-bold text-white shadow-md md:hidden">
                  {step.step}
                </div>

                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br p-2 ${
                    step.color
                  } text-main transition-all duration-300 group-hover:scale-110 group-hover:bg-main group-hover:text-white ${
                    idx % 2 !== 0 ? "md:ml-auto" : ""
                  }`}
                >
                  {step.icon}
                </div>

                <h3
                  className={`text-xl font-bold text-alt md:text-2xl ${idx % 2 !== 0 ? "md:text-right" : ""}`}
                >
                  <LangHandler
                    content={step.titleKey as keyof typeof translator.en}
                  />
                </h3>

                <p
                  className={`mt-3 leading-relaxed text-alt/60 ${idx % 2 !== 0 ? "md:text-right" : ""}`}
                >
                  <LangHandler
                    content={step.descKey as keyof typeof translator.en}
                  />
                </p>
              </div>
            </div>

            {/* Empty spacer */}
            <div className="hidden w-5/12 md:block" />
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default ProductLifecycle
