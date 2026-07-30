import type { translator } from "@/translator"
import { COMPANY_CONTACT } from "@/constants/company"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { mediaUrl } from "@/lib/media"
import Container from "./Container"
import LangHandler from "./LangHandler"
import LazyImage from "./LazyImage"

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
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <LazyImage src={mediaUrl("/assets/home/logo.png")} width={56} height={56} className="size-14 object-contain" alt="" />
              <span className="text-xl font-black tracking-tight">
                RIGHT<span className="text-main">CODE</span>
              </span>
            </Link>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">
              <LangHandler content="footerDescription" />
            </p>
            <div className="mt-6 flex gap-2">
              <a href={COMPANY_CONTACT.linkedIn} target="_blank" rel="noreferrer" aria-label="Right Code on LinkedIn" className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[.04] text-white/70 transition hover:-translate-y-0.5 hover:border-main/50 hover:bg-main hover:text-white"><FaLinkedinIn className="size-5" /></a>
              <a href={COMPANY_CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label="Contact Right Code on WhatsApp" className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[.04] text-white/70 transition hover:-translate-y-0.5 hover:border-main/50 hover:bg-main hover:text-white"><FaWhatsapp className="size-5" /></a>
            </div>
          </div>
          <nav
            className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1"
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
          <address className="grid content-start gap-3 text-sm not-italic text-white/65">
            <a href={`mailto:${COMPANY_CONTACT.email}`} className="group flex items-start gap-3 transition hover:text-main"><Mail className="mt-0.5 size-4 shrink-0 text-main" /><span>{COMPANY_CONTACT.email}</span></a>
            <a href={COMPANY_CONTACT.phoneHref} className="group flex items-start gap-3 transition hover:text-main"><Phone className="mt-0.5 size-4 shrink-0 text-main" /><span dir="ltr">{COMPANY_CONTACT.phoneDisplay}</span></a>
            <a href={COMPANY_CONTACT.maps} target="_blank" rel="noreferrer" className="group flex items-start gap-3 leading-6 transition hover:text-main"><MapPin className="mt-0.5 size-4 shrink-0 text-main" /><span><LangHandler content="contactOfficeAddress" /></span></a>
          </address>
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
