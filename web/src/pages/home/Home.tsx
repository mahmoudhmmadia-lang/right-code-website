import PageTransition from "@/components/PageTransition"
import Loader from "@/components/Loader"
import ServicesCatalog from "@/components/ServicesCatalog"
import Customers from "@/pages/customers/Customers"
import Landing from "@/pages/landing/Landing"
import MoreAbout from "@/pages/more-about/MoreAbout"
import Testimonials from "@/pages/testimonials/Testimonials"
import { ChapterTracker } from "./components/ChapterTracker"
import { HomeChapter } from "./components/HomeChapter"
import { ScrollAtmosphere } from "./components/ScrollAtmosphere"
import { useHome } from "./useHome"

export default function Home() {
  const { homeRef, activeIndex, chapters, progress, selectChapter, experience } = useHome()
  const home = experience.data

  if (experience.isLoading) return <Loader />
  if (!home) return null

  const sections = {
    hero: <Landing content={home.hero} media={home.content?.hero} />,
    partners: <Customers content={home.partners} media={home.content?.partners} />,
    painPoints: <MoreAbout content={home.painPoints} />,
    services: <ServicesCatalog content={home.services} />,
    testimonials: <Testimonials content={home.testimonials} />,
  }

  return (
    <PageTransition className="overflow-clip">
      <div ref={homeRef} className="relative isolate">
        <ScrollAtmosphere progress={progress} />
        <ChapterTracker chapters={chapters} progress={progress} activeIndex={activeIndex} onSelect={selectChapter} />
        {chapters.map((chapter, index) => (
          <HomeChapter key={chapter.id} id={chapter.id} index={index}>
            {sections[chapter.key]}
          </HomeChapter>
        ))}
      </div>
    </PageTransition>
  )
}
