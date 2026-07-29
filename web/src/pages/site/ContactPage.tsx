import {
  AnimatedRoutePage,
  RouteChapter,
} from "@/components/RouteScrollExperience"
import Loader from "@/components/Loader"
import { RouteSectionRenderer } from "./components/RouteSectionRenderer"
import { useRoutePage } from "./useRoutePage"

export default function ContactPage() {
  const route = useRoutePage("contact")
  if (route.query.isLoading) return <Loader />

  return (
    <AnimatedRoutePage className="pt-16" chapters={route.chapters} variant="contact">
      {route.sections.map((section, index) => (
        <RouteChapter key={section.id} id={section.anchor ?? section.key} index={index}>
          <RouteSectionRenderer section={section} />
        </RouteChapter>
      ))}
    </AnimatedRoutePage>
  )
}
