import LangSelect from "./LangSelect"
import LangHandler from "./LangHandler"
import type { translator } from "@/translator"
import { AnimatedHeader } from "./animated-header"

const NAV_LINKS = [
  { href: "#work", label: "nav_work" as const },
  { href: "#services", label: "nav_services" as const },
  { href: "#about", label: "nav_about" as const },
  { href: "#blog", label: "nav_blog" as const },
] as const

function Navbar() {
  return (
    <AnimatedHeader>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Right Code Logo" width={50} height={50} />
        <span className="text-xl font-bold tracking-tight text-alt">
          RIGHT<span className="text-main">CODE</span>
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-alt/80 transition hover:text-main"
          >
            <LangHandler content={link.label as keyof typeof translator.en} />
          </a>
        ))}
      </div>

      {/* Lang Switcher */}
      <LangSelect />
    </AnimatedHeader>
  )
}

export default Navbar
