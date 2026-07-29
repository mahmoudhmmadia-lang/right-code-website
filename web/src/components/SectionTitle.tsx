import type { translator } from "@/translator"
import LangHandler from "./LangHandler"
import { PixelDriftText } from "./PixelDriftText"

type TKey = keyof typeof translator.en
function SectionTitle({
  badge,
  title,
  subtitle,
  badgeText,
  titleText,
  subtitleText,
  cmsOnly = false,
}: {
  badge?: TKey
  title?: TKey
  subtitle?: TKey
  badgeText?: string
  titleText?: string
  subtitleText?: string
  cmsOnly?: boolean
}) {
  return (
    <div className="mb-4 flex flex-col items-center text-center">
      <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-main/20 bg-card/50 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-main/30 dark:bg-[#0b2022]/72 dark:shadow-[0_10px_34px_rgba(66,209,213,0.08)]">
        <div className="h-2 w-2 animate-pulse rounded-full bg-main shadow-[0_0_14px_rgba(0,107,112,0.36)] dark:shadow-[0_0_14px_rgba(66,209,213,0.4)]" />
        <span className="text-xs font-semibold tracking-wider text-main uppercase">
          {badgeText ?? (!cmsOnly && badge ? <LangHandler content={badge} /> : null)}
        </span>
      </div>

      <PixelDriftText
        as="h2"
        className="gradient-text mx-auto max-w-4xl bg-linear-to-br bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-4xl dark:bg-[linear-gradient(135deg,#9ff5f3_0%,#42d1d5_48%,#ffb84d_100%)]"
      >
        {titleText ?? (!cmsOnly && title ? <LangHandler content={title} /> : null)}
      </PixelDriftText>

      <p className="mx-auto mt-4 max-w-2xl text-sm text-alt/60 lg:text-lg dark:text-foreground/68">
        {subtitleText ?? (!cmsOnly && subtitle ? <LangHandler content={subtitle} /> : null)}
      </p>
    </div>
  )
}

export default SectionTitle
