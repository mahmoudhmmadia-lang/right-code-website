import ProjectsShowcase from "@/components/ProjectsShowcase"
import { TerminalAbout } from "@/components/Terminal"
import CaseStudies from "@/pages/case-studies/CaseStudies"
import ProductLifecycle from "@/pages/product-life-cycle/ProductLifecycle"
import ServicesN from "@/pages/services-n/ServicesN"
import Contact from "@/pages/contact/Contact"
import WhyChooseUs from "@/pages/why-us/WhyChooseUs"
import type { RouteSection } from "../types"

export function RouteSectionRenderer({ section }: { section: RouteSection }) {
  let rendered = null
  switch (section.content?.component) {
    case "about-why":
      rendered = <WhyChooseUs content={section.body} />
      break
    case "about-terminal":
      rendered = <TerminalAbout content={section.body} />
      break
    case "services-detail":
      rendered = <ServicesN content={section.body} />
      break
    case "services-lifecycle":
      rendered = <ProductLifecycle content={section.body} />
      break
    case "work-projects":
      rendered = <ProjectsShowcase content={section.body} />
      break
    case "work-case-studies":
      rendered = <CaseStudies content={section.body} />
      break
    case "contact-overview":
      rendered = <Contact content={section.body} />
      break
    default:
      return null
  }
  return rendered
}
