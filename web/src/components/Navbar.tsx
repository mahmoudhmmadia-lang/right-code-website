import { lang } from "@/context/global"
import { cn } from "@/lib/utils"
import { mediaUrl } from "@/lib/media"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { AnimatedHeader } from "./animated-header"
import LangHandler from "./LangHandler"
import LangSelect from "./LangSelect"
import ThemeToggle from "./ThemeToggle"

const NAV_LINKS = [
  { to: "/", label: "nav_home" },
  { to: "/services", label: "nav_services" },
  { to: "/work", label: "nav_work" },
  { to: "/about", label: "nav_about" },
  { to: "/team", label: "nav_team" },
  { to: "/blog", label: "nav_blog" },
  { to: "/contact", label: "nav_contact" },
] satisfies Array<{ to: string; label: keyof typeof translator.en }>

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return NAV_LINKS.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.to === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "relative rounded-full px-3 py-2 text-sm font-semibold text-alt/65 transition-colors hover:text-main",
          isActive && "bg-main/10 text-main"
        )
      }
    >
      <LangHandler content={link.label} />
    </NavLink>
  ))
}

function Navbar() {
  useSignals()
  const [open, setOpen] = useState(false)

  return (
    <AnimatedHeader forceVisible={open}>
      <NavLink
        to="/"
        className="group flex items-center gap-2.5"
        aria-label="Right Code home"
      >
        <img
          src={mediaUrl("/assets/home/logo.png")}
          alt=""
          width={44}
          height={44}
          className="size-10 object-contain transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
        />
        <span className="hidden text-lg font-black tracking-[-0.04em] text-alt sm:inline">
          RIGHT<span className="text-main">CODE</span>
        </span>
      </NavLink>

      <nav
        className="hidden items-center gap-1 lg:flex"
        aria-label="Primary navigation"
      >
        <NavItems />
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden sm:block">
          <LangSelect />
        </div>
        <button
          type="button"
          className="grid size-10 cursor-pointer place-items-center rounded-full border border-alt/10 bg-white/55 text-alt backdrop-blur-md transition hover:border-main/30 hover:text-main lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute top-[calc(100%+0.6rem)] right-0 left-0 overflow-hidden rounded-3xl border border-alt/10 bg-white/90 p-3 shadow-2xl shadow-alt/10 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="grid gap-1" aria-label="Mobile navigation">
              <NavItems />
            </nav>
            <div className="mt-2 border-t border-alt/10 pt-3 sm:hidden">
              <LangSelect />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">{lang.value}</span>
    </AnimatedHeader>
  )
}

export default Navbar
