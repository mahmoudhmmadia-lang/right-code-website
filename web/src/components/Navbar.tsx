import { lang } from "@/context/global"
import { cn } from "@/lib/utils"
import { mediaUrl } from "@/lib/media"
import type { translator } from "@/translator"
import { useSignals } from "@preact/signals-react/runtime"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { AnimatedHeader } from "./animated-header"
import LangHandler from "./LangHandler"
import LangSelect, { LanguageOptions } from "./LangSelect"
import ThemeToggle from "./ThemeToggle"
import LazyImage from "./LazyImage"

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

function MobileNavItems({ onNavigate }: { onNavigate: () => void }) {
  return NAV_LINKS.map((link, index) => (
    <motion.div
      key={link.to}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.035, duration: 0.28 }}
    >
      <NavLink
        to={link.to}
        end={link.to === "/"}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "group flex min-h-16 items-center justify-between rounded-[1.4rem] border px-5 text-lg font-black transition",
            isActive
              ? "border-main/25 bg-main text-white shadow-[0_18px_45px_rgba(0,107,112,.22)]"
              : "border-alt/10 bg-white/72 text-alt hover:border-main/20 hover:bg-main/8 hover:text-main dark:border-foreground/10 dark:bg-white/[.045] dark:text-foreground/78 dark:hover:text-main"
          )
        }
      >
        {({ isActive }) => (
          <>
            <span className="flex items-center gap-4">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-xs font-black",
                  isActive
                    ? "bg-white text-main"
                    : "bg-main/10 text-main group-hover:bg-main group-hover:text-white"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <LangHandler content={link.label} />
            </span>
            <ArrowUpRight
              className={cn(
                "size-5 transition group-hover:rotate-45",
                isActive && "rotate-45"
              )}
            />
          </>
        )}
      </NavLink>
    </motion.div>
  ))
}

function Navbar() {
  useSignals()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <>
      <AnimatedHeader forceVisible={open}>
        <NavLink
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="Right Code home"
        >
          <LazyImage
            src={mediaUrl("/assets/home/logo.png")}
            alt=""
            width={44}
            height={44}
            priority
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
      </AnimatedHeader>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-999 overflow-y-auto bg-[#f7fbfa]/96 px-4 py-4 text-alt backdrop-blur-2xl lg:hidden dark:bg-[#061313]/96 dark:text-foreground"
            initial={{
              opacity: 0,
              clipPath: "circle(0% at calc(100% - 2rem) 2rem)",
            }}
            animate={{
              opacity: 1,
              clipPath: "circle(145% at calc(100% - 2rem) 2rem)",
            }}
            exit={{
              opacity: 0,
              clipPath: "circle(0% at calc(100% - 2rem) 2rem)",
            }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none fixed -top-20 -right-20 size-72 rounded-full border-[42px] border-main/[.055] dark:border-main/[.08]" />
            <div className="pointer-events-none fixed bottom-[-8rem] left-[-6rem] size-72 rounded-full bg-main/[.045] blur-3xl dark:bg-main/[.08]" />
            <div className="relative mx-auto flex min-h-full w-full max-w-2xl flex-col">
              <div className="flex items-center justify-between">
                <NavLink
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3"
                  aria-label="Right Code home"
                >
                  <LazyImage
                    src={mediaUrl("/assets/home/logo.png")}
                    alt=""
                    width={48}
                    height={48}
                    priority
                    className="size-12 object-contain"
                  />
                  <span className="text-lg font-black tracking-[-0.04em] text-alt dark:text-foreground">
                    RIGHT<span className="text-main">CODE</span>
                  </span>
                </NavLink>
                <button
                  type="button"
                  className="grid size-12 place-items-center rounded-full border border-alt/10 bg-white/75 text-alt shadow-lg shadow-alt/8 backdrop-blur-xl transition hover:border-main/30 hover:text-main dark:border-foreground/10 dark:bg-white/[.06] dark:text-foreground"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-10">
                <p className="text-[0.68rem] font-black tracking-[0.22em] text-main uppercase">
                  Menu
                </p>
                <nav
                  className="mt-4 grid gap-2.5"
                  aria-label="Mobile navigation"
                >
                  <MobileNavItems onNavigate={() => setOpen(false)} />
                </nav>
              </div>

              <motion.section
                className="mt-8 rounded-[1.75rem] border border-alt/10 bg-white/72 p-3 shadow-[0_22px_70px_rgba(18,36,35,.09)] backdrop-blur-xl dark:border-foreground/10 dark:bg-white/[.045]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.3 }}
              >
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="text-[0.68rem] font-black tracking-[0.18em] text-main uppercase">
                    Language
                  </span>
                  <span className="rounded-full bg-main/10 px-2.5 py-1 text-[0.65rem] font-black text-main">
                    {lang.value.toUpperCase()}
                  </span>
                </div>
                <LanguageOptions onSelect={() => setOpen(false)} />
              </motion.section>

              <div className="mt-auto pt-8 pb-3">
                <div className="flex items-center justify-between rounded-[1.5rem] border border-alt/10 bg-white/55 px-4 py-3 text-xs font-bold text-alt/45 dark:border-foreground/10 dark:bg-white/[.035] dark:text-foreground/45">
                  <span>RIGHTCODE</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">{lang.value}</span>
    </>
  )
}

export default Navbar
