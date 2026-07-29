import PageLayout from "@/components/PageLayout"
import { motion } from "framer-motion"
import type { HomeTranslation } from "../home/types"

function MoreAbout({ content }: { content?: HomeTranslation["painPoints"] }) {
  const painPoints = [
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
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4M8 2h8" />
          <path d="M12 2v6" />
          <path d="M12 22a4 4 0 0 0 4-4h-8a4 4 0 0 0 4 4z" />
        </svg>
      ),
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
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
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
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01" />
        </svg>
      ),
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
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ]
  return (
    <PageLayout
      badgeText={content?.badge}
      titleText={content?.heading}
      subtitleText={content?.subheading}
      cmsOnly
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_40%,rgba(0,107,112,0.02)_40%,rgba(0,107,112,0.02)_60%,transparent_60%,transparent_100%)]" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-main/3 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-alt/3 blur-3xl" />
        <motion.div
          className="absolute top-24 right-[12%] h-24 w-24 rounded-[1.75rem] border border-main/15 bg-card/25 shadow-[0_24px_60px_rgba(18,36,35,0.08)] backdrop-blur-sm dark:shadow-[0_24px_60px_rgba(66,209,213,0.08)]"
          animate={{ y: [0, -18, 0], rotate: [8, -7, 8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 left-[10%] h-20 w-20 rounded-full border border-alt/10 bg-main/5"
          animate={{ y: [0, 16, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Pain points grid */}
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:gap-8">
        {painPoints.map((point, idx) => (
          <motion.div
            key={idx}
            className="app-card app-hover-card app-lift-card group relative overflow-hidden rounded-3xl p-6 md:p-8"
            initial={{ opacity: 0, y: 34, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: idx * 0.08 }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute -inset-full bg-gradient-to-r from-main/8 via-main/4 to-[#ffb84d]/8 transition-[inset,opacity] duration-500 group-hover:inset-0 dark:from-main/12 dark:via-main/5 dark:to-[#ffb84d]/10" />
            <div className="app-card-accent right-5! bottom-5! h-20! w-20! rounded-[1.4rem]! opacity-0 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-main/10 to-alt/10 text-main shadow-sm ring-1 ring-main/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-main group-hover:to-alt group-hover:text-white group-hover:shadow-lg group-hover:shadow-main/20">
                <div className="h-7 w-7">{point.icon}</div>
              </div>

              <h3 className="text-xl font-bold text-alt transition-colors duration-300 group-hover:text-main">
                {content?.items?.[idx]?.title}
              </h3>

              <div className="mt-3 h-px w-12 bg-main/30 transition-all duration-300 group-hover:w-24" />

              <p className="mt-4 leading-relaxed text-alt/60">
                {content?.items?.[idx]?.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to action after pain points */}
      <motion.div
        className="app-card relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-alt/5 to-main/8 p-6 text-center md:p-8"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23006b70%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%C2%A0%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative">
          <p className="text-lg font-medium text-alt/80">
            {content?.cta}
          </p>
        </div>
      </motion.div>
    </PageLayout>
  )
}

export default MoreAbout
