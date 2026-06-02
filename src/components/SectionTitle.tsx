import type { translator } from "@/translator"
import LangHandler from "./LangHandler"

type TKey = keyof typeof translator.en
function SectionTitle({
  badge,
  title,
  subtitle,
}: {
  badge: TKey
  title: TKey
  subtitle: TKey
}) {
  return (
    <div className="mb-4 text-center">
      <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-main/20 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm">
        <div className="h-2 w-2 animate-pulse rounded-full bg-main" />
        <span className="text-xs font-semibold tracking-wider text-main uppercase">
          <LangHandler content={badge} />
        </span>
      </div>

      <h2 className="gradient-text mx-auto max-w-4xl bg-linear-to-br bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-4xl">
        <LangHandler content={title} />
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-sm text-alt/60">
        <LangHandler content={subtitle} />
      </p>
    </div>
  )
}

export default SectionTitle
