import { useTheme } from "@/components/theme-provider"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> }
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    )
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  async function toggleTheme() {
    const next = isDark ? "light" : "dark"
    const doc = document as ViewTransitionDocument
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (
      !doc.startViewTransition ||
      !buttonRef.current ||
      prefersReducedMotion
    ) {
      setTheme(next)
      return
    }

    const transition = doc.startViewTransition(() =>
      flushSync(() => setTheme(next))
    )
    await transition.ready

    const rect = buttonRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 480,
        easing: "cubic-bezier(.2,.8,.2,1)",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      className="group grid size-10 cursor-pointer place-items-center rounded-full border border-alt/10 bg-white/55 text-alt shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-main/30 hover:text-main"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Theme: ${theme}`}
    >
      {isDark ? (
        <Sun className="size-4 transition group-hover:rotate-12" />
      ) : (
        <Moon className="size-4 transition group-hover:-rotate-12" />
      )}
    </button>
  )
}
