import { useServices } from "@/hooks/usePublicContent"
import { motion } from "framer-motion"
import {
  Blocks,
  CloudCog,
  Code2,
  Gauge,
  ShieldCheck,
  Wrench,
} from "lucide-react"
import Loader from "./Loader"
import PageLayout from "./PageLayout"
import type { HomeTranslation } from "@/pages/home/types"

const icons = [Code2, Gauge, Blocks, CloudCog, ShieldCheck, Wrench]

export default function ServicesCatalog({ content }: { content?: HomeTranslation["services"] }) {
  const query = useServices()

  return (
    <PageLayout
      badgeText={content?.badge}
      titleText={content?.heading}
      subtitleText={content?.subheading}
      cmsOnly
    >
      {query.isLoading ? <Loader fullScreen={false} /> : null}
      {query.isError ? (
        <p className="mx-auto mt-12 max-w-xl rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-center text-sm text-destructive">
          {content?.errorMessage}
        </p>
      ) : null}
      <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {query.data?.data.map((service, index) => {
          const Icon = icons[index % icons.length]
          return (
            <motion.article
              key={service.id}
              className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/60 p-7 shadow-[0_18px_52px_rgba(18,36,35,0.08)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -7 }}
            >
              <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-main/10 text-main transition group-hover:bg-main group-hover:text-white">
                <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-black text-alt">
                {service.title ?? service.slug}
              </h3>
              {service.subtitle ? (
                <p className="mt-1 text-xs font-bold tracking-wider text-main uppercase">
                  {service.subtitle}
                </p>
              ) : null}
              <p className="mt-4 text-sm leading-7 text-alt/60">
                {service.description}
              </p>
              {service.outcome ? (
                <p className="mt-5 border-t border-alt/10 pt-4 text-sm font-semibold text-alt/75">
                  {service.outcome}
                </p>
              ) : null}
            </motion.article>
          )
        })}
      </div>
      {!query.isLoading && !query.isError && !query.data?.data.length ? (
        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-alt/55">
          {content?.emptyMessage}
        </p>
      ) : null}
    </PageLayout>
  )
}
