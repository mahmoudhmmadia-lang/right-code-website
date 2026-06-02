import Container from "@/components/Container"
import LangHandler from "@/components/LangHandler"
import { Button } from "@/components/ui/button"
import type { translator } from "@/translator"

function Landing() {
  return (
    <Container className="pt-[108px] pb-20">
      <div className={`relative transition-all duration-700`}>
        <div className="text-center">
          <div className="mb-8 inline-flex animate-pulse items-center gap-3 rounded-full border border-main/20 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-main" />
            <span className="text-xs font-semibold tracking-wider text-main uppercase">
              <LangHandler content="landingBadge" />
            </span>
          </div>

          <h1 className="gradient-text mx-auto max-w-[900px] bg-linear-to-br bg-clip-text text-5xl leading-[1.2] font-black tracking-tight text-transparent sm:text-6xl md:text-7xl">
            <LangHandler content="heroTitle" />
          </h1>

          <p className="mx-auto mt-6 max-w-[600px] leading-relaxed text-alt/60 sm:text-lg">
            <LangHandler content="heroDescription" />
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Button className="gradient w-[200px] text-white">
              <LangHandler content="ctaPrimary" />
            </Button>

            <Button className="w-[200px] border-2 border-main bg-transparent font-bold text-main">
              <LangHandler content="ctaSecondary" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        className={`mx-auto mt-24 grid max-w-5xl grid-cols-3 gap-8 transition-all delay-100 duration-700 md:grid-cols-3`}
      >
        {(
          [
            { number: "stat2Number", label: "stat2Label" },
            { number: "stat3Number", label: "stat3Label" },
            { number: "stat4Number", label: "stat4Label" },
          ] as {
            number: keyof typeof translator.en
            label: keyof typeof translator.en
          }[]
        ).map((stat, idx) => (
          <div
            key={idx}
            className="group rounded-2xl border border-gray-200 bg-white/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
          >
            <div className="text-3xl font-black text-alt transition-all group-hover:scale-110 group-hover:text-main sm:text-4xl">
              <LangHandler content={stat.number} />
            </div>
            <div className="mt-2 text-xs font-semibold tracking-wider text-alt/70 uppercase">
              <LangHandler content={stat.label} />
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Landing
