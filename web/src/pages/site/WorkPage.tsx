import {
  AnimatedRoutePage,
  RouteChapter,
} from "@/components/RouteScrollExperience"
import Loader from "@/components/Loader"
import { RouteSectionRenderer } from "./components/RouteSectionRenderer"
import { useRoutePage } from "./useRoutePage"

export default function WorkPage() {
  const route = useRoutePage("work")
  if (route.query.isLoading) return <Loader />

  return (
    <AnimatedRoutePage className="pt-16" chapters={route.chapters} variant="work">
      {route.sections.map((section, index) => (
        <RouteChapter key={section.id} id={section.anchor ?? section.key} index={index}>
          <RouteSectionRenderer section={section} />
        </RouteChapter>
      ))}
    </AnimatedRoutePage>
  )
}
