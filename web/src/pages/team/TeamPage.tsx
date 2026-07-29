import Loader from "@/components/Loader"
import PageLayout from "@/components/PageLayout"
import {
  AnimatedRoutePage,
  RouteChapter,
} from "@/components/RouteScrollExperience"
import { useRoutePage } from "@/pages/site/useRoutePage"
import { CareerForm } from "./components/CareerForm"
import { TeamButtonCarousel } from "./components/TeamButtonCarousel"
import { useTeam } from "./useTeam"
import { RouteCopyProvider } from "@/context/route-copy"

export default function TeamPage() {
  const team = useTeam()
  const route = useRoutePage("team")
  const people = route.sections.find((section) => section.key === "team-people")
  const careers = route.sections.find((section) => section.key === "team-careers")
  if (route.query.isLoading) return <Loader />

  return (
    <AnimatedRoutePage className="pt-16" chapters={route.chapters} variant="team">
      {people ? (
      <RouteChapter id={people.anchor ?? people.key} index={route.sections.indexOf(people)}>
        <RouteCopyProvider copy={people.body?.copy}>
        <PageLayout
          cmsOnly
          badgeText={people.body?.badge}
          titleText={people.body?.heading}
          subtitleText={people.body?.subheading}
          className="pb-12"
        >
          {team.isLoading ? (
            <Loader fullScreen={false} />
          ) : (
            <TeamButtonCarousel members={team.members} content={people.body?.teamPeople} />
          )}
        </PageLayout>
        </RouteCopyProvider>
      </RouteChapter>
      ) : null}
      {careers ? (
      <RouteChapter
        id={careers.anchor ?? careers.key}
        index={route.sections.indexOf(careers)}
        className="app-section px-4 pb-24 sm:px-8 md:px-16 lg:px-32"
      >
        <RouteCopyProvider copy={careers.body?.copy}>
        <div className="mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-[2rem] border border-main/15 bg-card/70 p-6 shadow-[0_30px_90px_rgba(0,107,112,.10)] backdrop-blur-md md:p-10 lg:grid-cols-[.75fr_1.25fr]">
          <div className="rounded-3xl bg-[#0b2526] p-7 text-white md:p-9">
            <span className="text-xs font-black tracking-[.2em] text-main uppercase">
              {careers.body?.eyebrow}
            </span>
            <h2 className="mt-6 text-3xl leading-tight font-black">
              {careers.body?.heading}
            </h2>
            <p className="mt-4 leading-7 text-white/65">
              {careers.body?.subheading}
            </p>
            <div className="mt-10 h-px bg-white/10" />
            <p className="mt-6 text-sm leading-6 text-white/50">
              {careers.body?.teamCareers?.privacy}
            </p>
          </div>
          <CareerForm team={team} content={careers.body?.teamCareers} />
        </div>
        </RouteCopyProvider>
      </RouteChapter>
      ) : null}
    </AnimatedRoutePage>
  )
}
