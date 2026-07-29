import { HoverImageReveal, type HoverImageRevealItem } from "@/components/HoverImageReveal"
import PageLayout from "@/components/PageLayout"
import type { HomeMedia, HomeTranslation } from "../home/types"

export default function Customers({ content, media }: { content?: HomeTranslation["partners"]; media?: HomeMedia["partners"] }) {
  const items: HoverImageRevealItem[] = (content?.items ?? [])
    .map((item, index) => ({
      title: item.name?.trim(),
      category: item.category?.trim(),
      image: media?.[index]?.imageUrl?.trim() ?? "",
    }))
    .filter((item) => Boolean(item.title && item.image))

  return (
    <PageLayout
      badgeText={content?.badge}
      titleText={content?.heading}
      subtitleText={content?.subheading}
      cmsOnly
    >
      <HoverImageReveal items={items} className="mx-auto mt-14 max-w-6xl" />
    </PageLayout>
  )
}
