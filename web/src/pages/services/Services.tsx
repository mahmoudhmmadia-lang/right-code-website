import LangHandler from "@/components/LangHandler"
import PageLayout from "@/components/PageLayout"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"
import { motion } from "framer-motion"

function Services() {
  useSignals()

  const services = [
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
          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M3 10h18" />
        </svg>
      ),
      titleKey: "service1Title",
      descKey: "service1Desc",
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
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M12 17V5" />
          <path d="M6 17v-3" />
        </svg>
      ),
      titleKey: "service2Title",
      descKey: "service2Desc",
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
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      titleKey: "service3Title",
      descKey: "service3Desc",
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
          <rect x="3" y="9" width="18" height="12" rx="2" />
          <path d="M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
          <circle cx="12" cy="16" r="1.5" fill="#006b70" stroke="none" />
        </svg>
      ),
      titleKey: "service4Title",
      descKey: "service4Desc",
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
        </svg>
      ),
      titleKey: "service5Title",
      descKey: "service5Desc",
    },
  ]

  return (
    <PageLayout
      badge="servicesBadge"
      title="servicesTitle"
      subtitle="servicesSubtitle"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-24 left-[8%] h-28 w-28 rounded-[2rem] border border-main/15 bg-card/25 backdrop-blur-sm"
          animate={{ y: [0, 20, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[9%] bottom-24 h-24 w-24 rounded-full border border-alt/10 bg-main/5"
          animate={{ y: [0, -16, 0], x: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className="app-card app-hover-card app-lift-card group relative overflow-hidden rounded-3xl p-8"
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: idx * 0.07 }}
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-main/35 to-transparent" />
            <div className="app-card-accent h-32! w-32! rounded-[2.2rem]!" />
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-main/10 p-2 text-main shadow-sm ring-1 ring-main/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-main group-hover:text-white group-hover:shadow-lg group-hover:shadow-main/20">
              {service.icon}
            </div>
            <h3 className="mb-3 text-xl font-bold text-alt">
              <LangHandler
                content={service.titleKey as keyof typeof translator.en}
              />
            </h3>
            <p className="leading-relaxed text-alt/60">
              <LangHandler
                content={service.descKey as keyof typeof translator.en}
              />
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="app-card relative mx-auto mt-20 max-w-5xl overflow-hidden rounded-3xl bg-linear-to-r from-alt/5 to-main/8 p-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23006b70%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative">
          <p className="text-lg font-medium text-alt/70 italic">
            “<LangHandler content="servicesQuote" />”
          </p>
          <p className="mt-3 text-sm font-semibold text-main">
            — <LangHandler content="servicesQuoteAuthor" />
          </p>
        </div>
      </motion.div>
    </PageLayout>
  )
}

export default Services
