export const HOME_CHAPTERS = [
  { id: "home-intro", key: "hero" },
  { id: "home-partners", key: "partners" },
  { id: "home-challenges", key: "painPoints" },
  { id: "home-services", key: "services" },
  { id: "home-stories", key: "testimonials" },
] as const satisfies ReadonlyArray<{
  id: string
  key: "hero" | "partners" | "painPoints" | "services" | "testimonials"
}>
