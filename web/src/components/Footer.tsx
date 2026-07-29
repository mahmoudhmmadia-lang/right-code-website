import type { translator } from "@/translator"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { mediaUrl } from "@/lib/media"
import Container from "./Container"
import LangHandler from "./LangHandler"

const links = [
  ["/services", "nav_services"],
  ["/work", "nav_work"],
  ["/about", "nav_about"],
  ["/team", "nav_team"],
  ["/blog", "nav_blog"],
  ["/create-project", "nav_project"],
  ["/contact", "nav_contact"],
] satisfies Array<[string, keyof typeof translator.en]>

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0b1717] text-white">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={mediaUrl("/assets/home/logo.png")} className="size-14 object-contain" alt="" />
              <span className="text-xl font-black tracking-tight">
                RIGHT<span className="text-main">CODE</span>
              </span>
            </Link>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">
              <LangHandler content="footerDescription" />
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-3"
            aria-label="Footer navigation"
          >
            {links.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="group inline-flex items-center gap-1 text-sm text-white/65 transition hover:text-main"
              >
                <LangHandler content={label} />
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/45">
          <span>© {new Date().getFullYear()} Right Code</span>
          <span>
            <LangHandler content="footerTagline" />
          </span>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
