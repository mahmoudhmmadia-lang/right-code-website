export type HomeCta = { label?: string; href?: string }

export type HomeHeroContent = {
  badge?: string
  heading?: string
  subheading?: string
  tags?: string[]
  scenePrimaryLabel?: string
  sceneSecondaryLabel?: string
  capabilitiesLabel?: string
  primaryCta?: HomeCta
  secondaryCta?: HomeCta
  stats?: Array<{ value?: string; label?: string }>
}

export type HomeSectionHeading = {
  badge?: string
  heading?: string
  subheading?: string
}

export type HomePartner = { name?: string; category?: string }
export type HomePainPoint = { title?: string; description?: string }
export type HomeTestimonial = { quote?: string; name?: string; title?: string }

export type HomeTranslation = {
  hero?: HomeHeroContent
  partners?: HomeSectionHeading & { items?: HomePartner[] }
  painPoints?: HomeSectionHeading & {
    cta?: string
    items?: HomePainPoint[]
  }
  services?: HomeSectionHeading & {
    emptyMessage?: string
    errorMessage?: string
  }
  testimonials?: HomeSectionHeading & { items?: HomeTestimonial[] }
}

export type HomeMedia = {
  hero?: {
    imageUrl?: string
    backgroundImageUrl?: string
    visualLabels?: string[]
  }
  partners?: Array<{ imageUrl?: string }>
  visibility?: Partial<
    Record<"hero" | "partners" | "painPoints" | "services" | "testimonials", boolean>
  >
}

export type HomeExperience = HomeTranslation & {
  id: string
  status: string
  content?: HomeMedia
}

export type ApiEnvelope<T> = { materials: T; message: string }
